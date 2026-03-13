#!/bin/bash

DATE=$(date +"%Y-%m-%d_%H-%M-%S")

BACKUP_DIR=./backups

mkdir -p $BACKUP_DIR

docker exec todo-mysql \
mysqldump --no-tablespaces -u fenil -pfenil@123 todos \
> $BACKUP_DIR/todo_backup_$DATE.sql

echo "Backup saved as todo_backup_$DATE.sql"



echo "Starting Docker volume backup..."


VOLUME_NAME=todo-db-data
docker run --rm \
--name volume-backup-container \
-v $VOLUME_NAME:/volume \
-v $BACKUP_DIR:/backups \
alpine \
tar czf /backups/volume-backup-$DATE.tar.gz -C /volume .

echo "Backup completed: backup-$DATE.tar.gz"

echo "Cleaning old backups..."

# Delete backups older than 1 day
find $BACKUP_DIR -type f -mmin +4 -name "*.sql" -delete
find $BACKUP_DIR -type f -mmin +4 -name "*.tar.gz" -delete

echo "Old backups deleted"

echo "Backup process completed successfully!"

