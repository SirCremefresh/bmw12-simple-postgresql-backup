# Pgbackrest Docker Image
[![Docker Build](https://img.shields.io/docker/cloud/build/donatowolfisberg/bmw12-simple-postgresql-backup)](https://hub.docker.com/r/donatowolfisberg/bmw12-simple-postgresql-backup)
[![Image Version](https://img.shields.io/docker/v/donatowolfisberg/bmw12-simple-postgresql-backup?sort=semver)](https://hub.docker.com/r/donatowolfisberg/bmw12-simple-postgresql-backup)
[![Image Size](https://img.shields.io/docker/image-size/donatowolfisberg/bmw12-simple-postgresql-backup?sort=date)](https://hub.docker.com/r/donatowolfisberg/bmw12-simple-postgresql-backup)
[![Docker Pulls](https://img.shields.io/docker/pulls/donatowolfisberg/bmw12-simple-postgresql-backup)](https://hub.docker.com/r/donatowolfisberg/bmw12-simple-postgresql-backup)

pg_dump -U donato --host=pg.intra.bmw12.ch -F c donato -f /tmp/mydb.tar.gz


docker image: donatowolfisberg/bmw12-simple-postgresql-backup

https://hub.docker.com/r/donatowolfisberg/bmw12-simple-postgresql-backup

## Official docs
https://pgbackrest.org/user-guide.html#installation

## Versioning
The docker version is in the format of "vX.X.X" it will use the Major and Minor version of the pgbackrest release. The patch version will be incremented on updates or fixes in this project.
