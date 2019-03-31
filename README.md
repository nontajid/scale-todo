# scale360-todo
Simple todo nodejs backed api service(Scale360 Interview Assignment)

## Installation
### Prerequisite 
- docker and docker-compose are installed

### Setup Environment
- Copy config file `cp .env.sample .env`
- Change credential and table name as you wish
- Same database credential need to applied to `docker-db/init_db.sql`

## Build and run
    docker-compose build
    docker-compose up