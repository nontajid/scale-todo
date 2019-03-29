const express = require('express');
const router = express.Router();

const Todo = require('../src/todo');

/**
 * @method get
 * @route /todo/
 * @respose {JSON} all record under todo table
 */
router.get('/', function (req, res) {
  try {
    Todo.all()
    .then(rows => {
      res.json(rows);
    })
    .catch(error => {
      res.status(500).send({'error': error});
    });
  } catch (error) {
    res.status(500).send({'error': error});
  }
})

/**
 * @method get
 * @route /todo/{id}
 * @respose {JSON}  single record of todo item
 */
router.get('/:todoId(\\d+)', function (req, res) {
  try {
    Todo.find(parseInt(req.params.todoId))
    .then(todo => {
      const data = todo.data();

      if (data === null) {        
        res.status(404).send({'error': 'Recond Not Found'});
        return;
      }

      res.json(data);
    })
    .catch(error => {
      res.status(500).send({'error': error});
    });
  } catch (error) {
    res.status(500).send({'error': error});
  }

})

/**
 * @method post
 * @route /todo/
 * @request {JSON} body contain info to create new record
 * @respose {JSON} id of newly created record
 */
router.post('/', function (req, res) {
  try {
    Todo.store(req.body)
    .then(todo => {
      res.json({'id': todo.id});
    })
    .catch(error => {
      res.status(500).send({'error': error});
    });  
  } catch (error) {
    res.status(500).send({'error': error});
  }
})

/**
 * @method delete
 * @route /todo/
 */
router.delete('/:todoId(\\d+)', function (req, res) {
    try {
      Todo.delete(parseInt(req.params.todoId))
      .then(result => {
        if (!result) res.status(404).send({'error': 'Recond Not Found'});
        res.status(200).send();
      });
    } catch (error) {
      res.status(500).send({'error': error});
    }
})

module.exports = router