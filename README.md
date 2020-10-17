# BMW12 simple postgresql backup
[![Docker Build](https://img.shields.io/docker/cloud/build/donatowolfisberg/bmw12-simple-postgresql-backup)](https://hub.docker.com/r/donatowolfisberg/bmw12-simple-postgresql-backup)
[![Image Version](https://img.shields.io/docker/v/donatowolfisberg/bmw12-simple-postgresql-backup?sort=semver)](https://hub.docker.com/r/donatowolfisberg/bmw12-simple-postgresql-backup)
[![Image Size](https://img.shields.io/docker/image-size/donatowolfisberg/bmw12-simple-postgresql-backup?sort=date)](https://hub.docker.com/r/donatowolfisberg/bmw12-simple-postgresql-backup)
[![Docker Pulls](https://img.shields.io/docker/pulls/donatowolfisberg/bmw12-simple-postgresql-backup)](https://hub.docker.com/r/donatowolfisberg/bmw12-simple-postgresql-backup)

This Program creates Postgresql dumps and then uploads them to a configured s3 bucket. These Backups will be deleted again after 10 days. It can be used to backup a Database from a home server. Where a full WAL backuping System would be too complicated. The Program takes all the configuration from environment variables.

## Configuration

| Env Name          | Required                | Default  |
| ----------------- | ----------------------- | -------- |
| KEY_ID            | :ballot_box_with_check: |          |
| APPLICATION_KEY   | :ballot_box_with_check: |          |
| S3_REGION         | :ballot_box_with_check: |          |
| S3_ENDPOINT       | :ballot_box_with_check: |          |
| BUCKET_NAME       | :ballot_box_with_check: |          |
| PG_HOST           | :ballot_box_with_check: |          |
| PG_PORT           | :black_square_button:   | 5432     |
| PG_USER           | :ballot_box_with_check: |          |
| PGPASSWORD        | :ballot_box_with_check: |          |
| PG_DATABASES      | :ballot_box_with_check: |          |

## Versioning
The docker version is in the format of "vX.Y.Z". All Tags can be found on [DockerHub](https://hub.docker.com/r/donatowolfisberg/bmw12-simple-postgresql-backup/tags).
