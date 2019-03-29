require('dotenv').config();

const express = require('express');
const app = express();
const todo = require('./route/todo');
const bodyParser = require('body-parser');
const port = process.env.PORT;

app.use(bodyParser.json());
app.use('/todo',todo);

// Index Page
app.get('/', (req, res) => res.send('Scale Interview Assignment TODO API'));

app.listen(port, () => console.log(`Scale TODO API listening on port ${port}!`));