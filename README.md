# BMW12 simple postgresql backup
[![Docker Build](https://img.shields.io/docker/cloud/build/donatowolfisberg/bmw12-simple-postgresql-backup)](https://hub.docker.com/r/donatowolfisberg/bmw12-simple-postgresql-backup)
[![Image Version](https://img.shields.io/docker/v/donatowolfisberg/bmw12-simple-postgresql-backup?sort=semver)](https://hub.docker.com/r/donatowolfisberg/bmw12-simple-postgresql-backup)
[![Image Size](https://img.shields.io/docker/image-size/donatowolfisberg/bmw12-simple-postgresql-backup?sort=date)](https://hub.docker.com/r/donatowolfisberg/bmw12-simple-postgresql-backup)
[![Docker Pulls](https://img.shields.io/docker/pulls/donatowolfisberg/bmw12-simple-postgresql-backup)](https://hub.docker.com/r/donatowolfisberg/bmw12-simple-postgresql-backup)

This Program creates Postgresql dumps and then uploads them to a configured s3 bucket. These Backups will be deleted again after 10 days. It can be used to backup a Database from a home server. Where a full WAL backuping System would be too complicated. The Program takes all the configuration from environment variables.

## Configuration

| Env Name          | Required                | Default  | Description |
| ----------------- | ----------------------- | -------- | -------- |
| KEY_ID            | :ballot_box_with_check: |          | The Access Key Id to authenticate with |
| APPLICATION_KEY   | :ballot_box_with_check: |          | The Access Key Secret to authenticate with |
| S3_REGION         | :ballot_box_with_check: |          | The Region. sample: us-west-002 |
| S3_ENDPOINT       | :ballot_box_with_check: |          | The S3 Endpoint. sample: s3.us-west-002.backblazeb2.com |
| BUCKET_NAME       | :ballot_box_with_check: |          | The Bucket where the backups are saved |
| PG_HOST           | :ballot_box_with_check: |          | The Database Host |
| PG_PORT           | :black_square_button:   | 5432     | The Database Port |
| PG_USER           | :ballot_box_with_check: |          | The User use for the PgDumps |
| PGPASSWORD        | :ballot_box_with_check: |          | The Password of the database User |
| PG_DATABASES      | :ballot_box_with_check: |          | All Databases that should be Backuped. The Databases are separated through a Comma. sample: db1,db2  |

### Example

An example of a Kubernetes Cronjob configuration can be found under [./k8s-example](https://github.com/SirCremefresh/bmw12-simple-postgresql-backup/tree/master/k8s-example).

## Versioning
The docker version is in the format of "vX.Y.Z". All Tags can be found on [DockerHub](https://hub.docker.com/r/donatowolfisberg/bmw12-simple-postgresql-backup/tags).
