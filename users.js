const express = require('express');
const userSchema = require('./src/models/user');
const router = express.Router();


/*
//crear usuario
router.post('/users', (req, res) => {
    // Create a new instance of the User model
    const newUser = new User(req.body);

    // Save the new user to the database
    newUser.save()
        .then(data => {
            res.status(201).json(data); // Send back the created user data with status 201 (Created)
        })
        .catch(error => {
            res.status(400).json(error); // Send back the error with status 400 (Bad Request)
        });
});
//ubtener todos los usuarios
router.get('/users', (req, res) => {
    userSchema.find()
        .then((data) => {
            res.json(data);
            console.log('ok');
        })
        .catch((error) => {
            res.json(error);
        });
});
//ubtener 1 usuario
router.get('/users/:id', (req, res) => {
    userSchema.findById(req.params.id)
        .then((data) => {
            res.json(data);
            console.log('ok2');
        })
        .catch((error) => {
            res.json(error);
            console.log('error2');
        });
});

//actualizar usuario

router.put('/users/:id', (req, res) => {
    const {id} = req.params;
    const {codigo, pasword} = req.body;
    userSchema.updateOne({_id:id}, {$set:{pasword, codigo}})
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.json(error);
        });
});

//eliminar usuario
router.delete('/users/:id', (req, res) => {
    const {id} = req.params;
    userSchema.findOneAndDelete({_id:id})
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.json(error);
        });
});
*/
module.exports = router;