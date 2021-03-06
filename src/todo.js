const DB = require('./db');

class Todo {
    constructor() {
        this.db = new DB();
        this.db.connect();
        this.tableName = "todo";

        this._id;
        this.subject;
        this.content;
        this.status;
    }

    /**
     * @return {Object} lasted result from database operation
     */
    data() {
        return this._dbResult || null;
    }

    /**
     * Insert or update current instance property into database 
     * 
     * @return {Promise<Object>} response object from mysql
     */
    save() {
        const data = this._getDataForDB();
        this._validate(data);
        let query;
        
        if ( !this.id ) {
            query = `INSERT INTO ${this.tableName} (subject, content, status)
                        VALUES (${data.subject}, ${data.content}, ${data.status});`;
        } else {
            query = `UPDATE ${this.tableName}
                        SET subject = ${data.subject}, content = ${data.content}, status = ${data.status}
                        WHERE id = ${data.id};`
        }
                
        return this.db.query(query)
                .then((res) => {
                    this._dbResult = res;
                    if ( res.insertId ) this.id = res.insertId;

                    return res;
                })
                .catch(error => {
                    throw error;
                });
    }

    /**
     * Get all record from the database
     * 
     * @return {Promise<Object>} response object from mysql
     */
    getAll() {
        const query  =  `SELECT *
                        FROM ${this.tableName}`;

        return this.db.query(query)
                .then(rows => {
                    this._dbResult = rows;
                    return rows;
                });
    }

    /**
     * Get single row of record from the database
     * 
     * @return {Promise<Object>} response object from mysql
     */
    get() {
        const query  =  `SELECT *
                        FROM ${this.tableName}
                        WHERE id = ${this.id}`;
        
        return this.db.query(query)
                .then(rows => {
                    this._dbResult = rows[0] || null;
                    if(this._dbResult) this.set(this._dbResult);
                    return this._dbResult;
                });
    }

    /**
     * Populate data to property in current instance
     */
    set(data) {
        this.id = data.id;
        this.subject = data.subject;
        this.content = data.content;
        this.status = data.status;
    }

    /**
     * Remove record from the database
     * 
     * @return {Promise<Object>} response object from mysql
     */
    delete() {
        const query  =  `DELETE
            FROM ${this.tableName}
            WHERE id = ${this.id}`;

            return this.db.query(query)
            .then(res => {
                this._dbResult = res;
                return res;
            });
    }

    /**
     * @param {Object} data data object to be validated
     */
    _validate(data) {        
        data = data;        
        
        if (!data.subject) throw "subject can not be empty";
        if (!data.status) throw "status can not be empty";
        if (data.status != `'pending'` && data.status != `'done'`) throw "status can only be pending or done";
    }

    /**
     * @returns {Object} ready to use data for database operation
     */
    _getDataForDB() {
        return {
            id: this.id,
            subject: this.subject? `'${this.subject}'`: null,
            content: this.content? `'${this.content}'`: null,
            status: this.status? `'${this.status}'` : `'pending'`
        }
    }

    /**
     * @return {Promise} of all todo list object 
     */
    static all() {
        const todo = new Todo();

        return todo.getAll()
        .then((rows) => {
            todo.db.close();
            return rows;
        });
    }

    /**
     * @param {number} id of todo item
     * 
     * @return {Promise} instance of todo
     */
    static find(id) {
        const todo = new Todo();
        todo.id = id;

        return todo.get()
                .then( row => {
                    todo.db.close();
                    return todo;
                });
    }

    /**
     * @param {Object} data data object to store into database
     * 
     * @return {Promise<Todo>} Instance of new inserted todo
     */
    static store(data) {
        const todo = new Todo();
        todo.subject = data.subject;
        todo.content = data.content;
        todo.status = data.status;
        return todo.save()
                .then(() => {
                    todo.db.close();
                    return todo
                });
    }


    /**
     * @param {number} id unique identifier for todo item
     * @param {Object} data data object to store into database
     * 
     * @return {Promise<Todo>} Instance of new inserted todo
     */
    static update(id,data) {
        const todo = new Todo();
        todo.id = id;
        
        return todo.get()
                .then((row) => {
                    if (row === null) throw 'Record Not Found';
                    todo.subject = data.subject;
                    todo.content = data.content;
                    todo.status = data.status;
                    return todo.save();
                })
                .then(() => {
                    return todo.get();
                })
                .then(() => {
                    todo.db.close();
                    return todo;
                });
    }

    /**
     * @param {number} id unique identifier for todo item
     * 
     * @return {Promise<Boolean>} indicate result of delete
     */
    static delete(id) {
        const todo = new Todo();
        todo.id = id;

        return todo.delete()
                .then((res) => {
                    if (res.affectedRows == 0) return false;
                    return true;
                });
    }

    // Setter and Getter

    set id(newId) {
        if (!typeof Number(newId)) throw "Id must be type of number";
        this._id = newId;
    }

    get id() {
        return this._id;
    }
}

module.exports = Todo;