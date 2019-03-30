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
 * @method put
 * @route /todo/{id}
 */
router.put('/:todoId(\\d+)', function (req, res) {
  try {
    Todo.update(parseInt(req.params.todoId),req.body)
    .then(todo => {
      const data = todo.data();
      res.json(data);
    })
    .catch(error => {
      res.status(500).send({'error': error});
    }); 
  } catch (error) {
    res.status(500).send({'error': error});
  }
});

/**
 * @method patch
 * @route /todo/{id}
 */
router.patch('/:todoId(\\d+)', function (req, res) {
  let todo;
  const patchAllow = ['status','content'];

  Todo.find(parseInt(req.params.todoId))
  .then((_todo) => {
    todo = _todo;
    if (todo.data() === null) {
      res.status(404).send({'error': 'Recond Not Found'});
      return;
    }

    Object.keys(req.body).forEach(key => {
      if(patchAllow.includes(key)) {
        todo[key] = req.body[key];
      }
    });

    todo.db.connect(); // reconnect to db since find close connection
    return todo.save();
  })
  .then(() => {
    return todo.get();
  })
  .then(() => {
    res.json(todo.data());
  })
  .catch(error => {
    res.status(500).send({'error': error});
  });
});

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