# scale360-todo
Simple todo nodejs backed api service(Scale360 Interview Assignment)

## Installation
### Prerequisite 
- docker and docker-compose are installed

### Setup Environment
- Copy config file `cp .env.sample .env`
- Change database credential, port and table name as you wish
- Same database credential need to applied to `docker-db/init_db.sql`

### Build and run
    docker-compose build
    docker-compose up

_By default application will run on port 3000. Change can be make to docker-compose.yml file_

## Api Documentation

#### Get all Task
Retrieve list of created task

    GET http://sampleurl.com/todo

#### Get single task
Retrieve one entry identify by task id

    GET http://sampleurl.com/todo/{id}

#### Create new task
Store new task to database

    POST http://sampleurl.com/todo

Body 
    
    {
        "subject": "sample-subject",
        "content": "sample-long-content",
        "status": "pending"
    }

- **subject** _require_ title of the task
- **content** _optional_ content of that task
- **status** _optional_ task status default to pending. Only pending or done are allow

#### Edit Task
Edit exiting task identify by id
    
    PUT http://sampleurl.com/todo/{id}

Body - Same as create task

#### Update task
Update exiting task identify by id 

    PATCH http://sampleurl.com/todo/{id}

Body - Only content and status are allow

    {
        "status": "done"
    }

#### Delete task
Remove task from task list identify by id

    DELETE http://sampleurl.com/todo/{id}
