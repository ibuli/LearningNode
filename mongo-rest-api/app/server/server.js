'use strict';

const app = require('express')();
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./../db/mongoose');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

// the body-parser middleware
app.use(bodyParser.json());

// create a GET /todos route
app.get('/todos', (req, res) => {
    
    Todo.find().then((data) => {
        res.send({data});
    }, (err) => {
        res.status(400).send(err);
    });
});

// create a POST /todos route 
app.post('/todos', (req, res) => {
    // make a todo and save it into the database
    let todo = new Todo({
        text : req.body.text
    });

    todo.save().then((data) => {
        // send the todo as a response
        res.send(data);
    }, (err) => {
        // send the error as a response
        res.status(400).send(err);
    });
});

// get todos by id GET /todos/id
app.get('/todos/:id', (req, res) => {
    //get the todo id in todoID
    let todoID = req.params.id;

    // if the ID is valid not valid, send a message
    if (!ObjectID.isValid(todoID)) {
        console.log('Invalid todo ID');
        return res.status(400).send({
            message : 'InvalidID',
            status : 400
        });
    }

    Todo.findById(todoID).then((data) => {
        if (!data) {
            return res.status(404).send({
                message : 'Todo not found',
                status : 404
            });
        }

        res.status(200).send({
            todo : data, 
            status : 200
        });

    }).catch((err) => {
        res.sendStatus(400).send({err});
        console.log('todoId not found');
    });
});

app.listen(3000, () => {
    console.log('server listening at port 3000');
});

module.exports = {app};