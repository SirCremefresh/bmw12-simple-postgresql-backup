# Simple Porstgresql Backup Kubernetes Example

In the file "[./cronjob.yaml](https://github.com/SirCremefresh/bmw12-simple-postgresql-backup/blob/master/k8s-example/cronjob.yaml)" is the Definition of a CronJob that runs once a day at 3am.   

The Following Variables should be moved to a secret when running in production.
* KEY_ID
* APPLICATION_KEY
* PG_HOST
* PG_USER
* PGPASSWORD
