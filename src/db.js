const mysql = require('mysql');
require('dotenv').config();

class DB {
    constructor() {
        this.databaseName = process.env.DB_DATABASE;
        this.creditial = {
            host     : process.env.DB_HOST,
            user     : process.env.DB_USER,
            password : process.env.DB_PASSWORD,
        }
    }

    /**
     * connect to mysql database
     * 
     * @return {Object} instance of Connection
     */
    connect() {
        this.connection = mysql.createConnection({
            ...this.creditial,
            database : this.databaseName,
        });

        this.connection.connect((error)=> {
            if (error) throw error;
        });
        
        return this.connection;
    }


    /**
     * connect to mysql without database specify
     * useful for create and drop database operation
     * 
     * @return {Object} instance of Connection
     */
    connectWithoutDB() {
        this.connection = mysql.createConnection(this.creditial);
        return this.connection;
    }

    /**
     * @param {String} query mysql query string
     * 
     * @return {Promise} mysql result
     */
    query(query) {
        return new Promise((resolve, reject) => {
            this.connection.query(query, (error, res) => {
                if(error) reject(error);
                resolve(res);
            });
        }) 
    }

    /**
     * Close connection to mysql
     * 
     * @return {Promise}
     */
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end( error => {
                if(error) reject(error);
                resolve();
            });
        }) 
    }
}

module.exports = DB;