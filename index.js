const AWS = require('aws-sdk');
const fs = require('fs');
const {exec} = require('child_process');
require('dotenv').config();

const KEY_ID = getFromEnvOrFail('KEY_ID');
const APPLICATION_KEY = getFromEnvOrFail('APPLICATION_KEY');
const S3_REGION = getFromEnvOrFail('S3_REGION');
const S3_ENDPOINT = getFromEnvOrFail('S3_ENDPOINT');
const BUCKET_NAME = getFromEnvOrFail('BUCKET_NAME');
const PG_HOST = getFromEnvOrFail('PG_HOST');
const PG_PORT = getFromEnvOrDefault('PG_PORT', 5432);
const PG_USER = getFromEnvOrFail('PG_USER');
const PG_DATABASES = getFromEnvOrFail('PG_DATABASES');
getFromEnvOrFail('PGPASSWORD'); // check if a postgres password was set
// const TODAY = new Date(Date.parse('2020-10-29'));
const TODAY = new Date();
const KEEP_DAYS = 10;

AWS.config.credentials = new AWS.Credentials({
	accessKeyId: KEY_ID, secretAccessKey: APPLICATION_KEY
});
AWS.config.region = S3_REGION;
const s3 = new AWS.S3({
	endpoint: new AWS.Endpoint(S3_ENDPOINT)
});


(async () => {
	const databases = PG_DATABASES.split(',').map(v => v.trim());
	console.log(`creating backup of databases: ${databases.join(', ')}`)

	for (const database of databases) {
		await createBackup(database)
	}

	await deleteOldBackups(databases)
})()

async function deleteOldBackups(databases) {
	console.log('[delete]: Deleting old Backups');
	console.time('[delete]')
	const databaseSet = new Set(databases)
	let deleteCount = 0;
	console.log('[delete-file]: get remote files');
	console.time('[delete-file]');
	const files = await getRemoteFiles();
	console.timeLog('[delete-file]', `got remote files. count: ${files.length}`);

	for (const file of files) {
		const fileName = file.slice(0, -7);
		const fileDate = new Date(Date.parse(file.slice(0, 10)))
		const fileDatabase = fileName.slice(11)
		const daysOld = getDiffDays(fileDate, TODAY);

		if (daysOld >= KEEP_DAYS && databaseSet.has(fileDatabase)) {
			console.log(`[delete-db ${fileName}]: Deleting backup. fileName: ${file}`);
			console.time(`[delete-db ${fileName}]`);
			await deleteFile(file);
			console.timeLog(`[delete-db ${fileName}]`, `Deleted backup`);
			deleteCount++;
		}
	}

	console.timeLog(`[delete]`, ` Deleted ${deleteCount} old backups`)
}

function getRemoteFiles() {
	return new Promise((resolve, reject) => {
		s3.listObjectsV2({
			Bucket: BUCKET_NAME
		}, (err, data) => {
			if (err)
				reject(err);
			resolve(data.Contents.map(value => value.Key))
		})
	})
}

async function createBackup(databaseName) {
	console.log(`[db ${databaseName}]: creating Backup`)
	console.time(`[db ${databaseName}]`)
	const fileName = getFileName(new Date(), databaseName);
	const localFilePath = `/tmp/${fileName}`
	await executeCommand(`pg_dump -U ${PG_USER} --host=${PG_HOST} --port=${PG_PORT} -F c ${databaseName} -f ${localFilePath}`);
	console.timeLog(`[db ${databaseName}]`, `created Backup and saved to ${localFilePath}`)
	console.log(`[db ${databaseName}]: uploading Backup ${localFilePath} with size ${getFilesizeInMegabytes(localFilePath)}mb`)
	await uploadFile(localFilePath, fileName);
	console.timeLog(`[db ${databaseName}]`, `uploaded Backup`)
}

async function deleteFile(file) {
	return new Promise((resolve, reject) => {
		s3.deleteObject({
			Bucket: BUCKET_NAME,
			Key: file
		}, function (err, data) {
			if (err)
				return reject(err);
			return resolve(data);
		});
	});
}

function uploadFile(localFilePath, fileName) {
	const readStream = fs.createReadStream(localFilePath);
	const params = {
		Bucket: BUCKET_NAME,
		Key: fileName,
		Body: readStream
	};

	return new Promise((resolve, reject) => {
		s3.upload(params, function (err, data) {
			readStream.destroy();
			if (err)
				return reject(err);
			return resolve(data);
		});
	});
}

function getFileName(date, databaseName) {
	return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}-${databaseName}.tar.gz`
}

function getFromEnvOrFail(name) {
	const value = process.env[name];
	if (value)
		return value;
	console.error(`could not load value from environment. env: ${name}`);
	process.exit(1);
}

function getFromEnvOrDefault(name, defaultValue) {
	const value = process.env[name];
	if (value)
		return value;
	return defaultValue
}

function executeCommand(command) {
	return new Promise((res, rej) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				rej(error.message)
			} else if (stderr) {
				rej(stderr)
			} else {
				res(stdout)
			}
		});
	})
}

function getDiffDays(first, second) {
	return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

function getFilesizeInMegabytes(filename) {
	const fileSizeInBytes = fs.statSync(filename)['size']
	return fileSizeInBytes / 1000000.0
}
