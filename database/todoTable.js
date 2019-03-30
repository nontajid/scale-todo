const DB = require('../src/db');

class TodoTable {
    constructor() {
        this.db = new DB;
        this.tableName = `todo`;
    }
    
    up() {
        this.db.connect();
        const query = `CREATE TABLE IF NOT EXISTS ${this.tableName} (
                            id INT AUTO_INCREMENT,
                            subject VARCHAR(255) NOT NULL,
                            content TEXT NULL,
                            status VARCHAR(255) NOT NULL,                    
                            PRIMARY KEY (id)
                        )  ENGINE=INNODB;`
        
        return this.db.query(query)
            .then(() => {
                this.db.close();
            })
            .then(() => {
                console.log(`table: ${this.tableName} created`);
            })
            .catch((error) => reject(error));
    }

    down() {
        this.db.connect();
        const query = `DROP TABLE IF EXISTS ${this.tableName}`;

        return this.db.query(query)
                .then(() => {
                    this.db.close();
                })
                .then(() => {
                    console.log(`table: ${this.tableName} dropped`);
                })
                .catch((error) => reject(error));
    }
}

module.exports = TodoTable;