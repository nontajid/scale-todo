const DB = require('./src/db');
const TodoTable = require('./database/todoTable');

class Database {
    constructor() {
        this.db = new DB;
        this.todoTable = new TodoTable();
        this.db.connectWithoutDB();
        this.databaseName = this.db.databaseName;        
    }

    createDatabase() {
        const query = `CREATE DATABASE IF NOT EXISTS ${this.databaseName}`;
        return this.db.query(query);
    }

    dropDatabase() {
        const query = `DROP DATABASE IF EXISTS ${this.databaseName}`;
        return this.db.query(query);
    }

    createTable() {
        return this.todoTable.up()
                .catch( error => reject(error)); 
    }

    dropTable() {
        return this.todoTable.down()
                .catch( error => reject(error)); 

    }

    upSequent() {
        this.createDatabase()
        .then(() => {
            console.log(`database: ${this.databaseName} created`);
            this.createTable()
        })
        .then( () => {
            this.db.close()
        });
    }

    downSequent() {
        this.dropTable()
        .then(() => {
            this.dropDatabase()
        })
        .then(() => {
            console.log(`database: ${this.databaseName} dropped`);
            this.db.close()
        });
    }
}

// Get Command line Argument 
const firstArg = process.argv[2];
const database = new Database;

switch (firstArg) {
    case '--up':
            database.upSequent();
        break;

    case '--down':
            database.downSequent();
        break;

    default:
        break;
}