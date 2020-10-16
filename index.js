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
// const PG_PORT = getFromEnvOrFail('PG_PORT');
const PG_USER = getFromEnvOrFail('PG_USER');
const PG_DATABASES = getFromEnvOrFail('PG_DATABASES');


AWS.config.credentials = new AWS.Credentials({
	accessKeyId: KEY_ID, secretAccessKey: APPLICATION_KEY
});
AWS.config.region = S3_REGION;
const s3 = new AWS.S3({
	endpoint: new AWS.Endpoint(S3_ENDPOINT)
});

// Create a bucket and upload something into it
// s3.createBucket({Bucket: BUCKET_NAME}, function () {
// 	var params = {Bucket: bucketName, Key: keyName, Body: 'Hello World!'};
// 	s3.putObject(params, function (err, data) {
// 		if (err)
// 			console.log(err)
// 		else
// 			console.log('Successfully uploaded data to ' + bucketName + '/' + keyName);
// 	});
// });
//
// s3.deleteObject({
// 	Bucket: BUCKET_NAME,
// 	Key: 'var/lib/pgbackrest/backup/my_stanza/backup.info'
// }, (err, data) => console.log(err, data))
// s3.listObjectsV2({
// 	Bucket: BUCKET_NAME
// }, (err, data) => console.log(err, data))

// s3.listBuckets((err, data) => console.log(err, data))
createBackup('donato')

async function createBackup(databaseName) {
	console.log(`[${databaseName}] creating Backup`)
	console.time(`[${databaseName}]`)
	const fileName = getFileName(new Date(), databaseName);
	const localFilePath = `/tmp/${fileName}`
	await executeCommand(`pg_dump -U ${PG_USER} --host=${PG_HOST} -F c ${databaseName} -f ${localFilePath}`);
	console.timeLog(`[${databaseName}]`, `created Backup and saved to ${localFilePath}`)
	await uploadFile(localFilePath, fileName);
	console.timeLog(`[${databaseName}]`, `uploaded Backup`)
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
	return `${('0' + date.getDate()).slice(-2)}-${('0' + date.getMonth()).slice(-2)}-${date.getFullYear()}-${databaseName}.tar.gz`
}

function getFromEnvOrFail(name) {
	const value = process.env[name];
	if (value)
		return value;
	console.error(`could not load value from environment. env: ${name}`);
	process.exit(1);
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
