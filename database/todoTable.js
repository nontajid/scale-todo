const DB = require('../src/db');

class TodoTable {
    constructor() {
        this.db = new DB;
        this.tablename = `todo`;
    }
    
    up() {
        this.db.connect();
        const query = `CREATE TABLE IF NOT EXISTS ${this.tablename} (
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
                console.log(`table: ${this.tablename} created`);
            })
            .catch((error) => reject(error));
    }

    down() {
        this.db.connect();
        const query = `DROP TABLE IF EXISTS ${this.tablename}`;

        return this.db.query(query)
                .then(() => {
                    this.db.close();
                })
                .then(() => {
                    console.log(`table: ${this.tablename} dropped`);
                })
                .catch((error) => reject(error));
    }
}

module.exports = TodoTable;