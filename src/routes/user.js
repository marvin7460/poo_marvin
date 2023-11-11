const express = require('express');
const userSchema = require('../models/user');
const profeSchema = require('../models/profesor');
const adminSchema = require('../models/administrador');
const router = express.Router();

// Ruta para mostrar la página de inicio de sesión
router.get('/', (req, res) => {
    res.render('login');
});

// Ruta para manejar el inicio de sesión
router.post('/login', (req, res) => {
    const { codigo, pasword } = req.body;
    const errores = [];

    // Validación de campos
    if (!codigo) {
        errores.push({ text: 'Ingrese su código' });
    }
    if (!pasword) {
        errores.push({ text: 'Ingrese su password' });
    }

    // Si hay errores, renderizar nuevamente la página de inicio de sesión con los mensajes de error
    if (errores.length > 0) {
        res.render('login', { errores, codigo, pasword });
    } else {
        // Si no hay errores, proceder a buscar el usuario
    
        userSchema.findOne({ codigo, pasword }) // Asumiendo que quieres buscar por 'codigo' y 'password'
            .then((user) => {
                if (user) {
                    // Guardar datos del usuario en la sesión, excluyendo la contraseña
                     req.session.user = {...user._doc, pasword: undefined}; // Usar _doc para obtener el documento sin métodos adicionales
                     res.redirect('/alumno');
                }/* else {
                    // Si el usuario no existe, mostrar un mensaje de error
                    errores.push({ text: 'Usuario no encontrado o contraseña incorrecta.' });
                    res.render('login', { errores, codigo, pasword });
                }*/
            })
            .catch((error) => {
                // En caso de un error con la consulta de la base de datos, mostrar un mensaje de error
                errores.push({ text: 'Error al buscar el usuario.' });
                res.render('login', { errores, codigo, pasword });
            });
        profeSchema.findOne({ codigo, pasword }) // Asumiendo que quieres buscar por 'codigo' y 'password'
        .then((user) => {
            if (user) {
                // Guardar datos del usuario en la sesión, excluyendo la contraseña
                 req.session.user = {...user._doc, pasword: undefined}; // Usar _doc para obtener el documento sin métodos adicionales
                 res.redirect('/profesor');
            } /*else {
                // Si el usuario no existe, mostrar un mensaje de error
                errores.push({ text: 'Usuario no encontrado o contraseña incorrecta.' });
                res.render('login', { errores, codigo, pasword });
            }*/
        })
        .catch((error) => {
            // En caso de un error con la consulta de la base de datos, mostrar un mensaje de error
            errores.push({ text: 'Error al buscar el usuario.' });
            res.render('login', { errores, codigo, pasword });
        });
        adminSchema.findOne({ codigo, pasword }) // Asumiendo que quieres buscar por 'codigo' y 'password'
        .then((user) => {
            if (user) {
                // Guardar datos del usuario en la sesión, excluyendo la contraseña
                 req.session.user = {...user._doc, pasword: undefined}; // Usar _doc para obtener el documento sin métodos adicionales
                 res.redirect('/administrador');
            } /*else {
                // Si el usuario no existe, mostrar un mensaje de error
                errores.push({ text: 'Usuario no encontrado o contraseña incorrecta.' });
                res.render('login', { errores, codigo, pasword });
            }*/
        })
        .catch((error) => {
            // En caso de un error con la consulta de la base de datos, mostrar un mensaje de error
            errores.push({ text: 'Error al buscar el usuario.' });
            res.render('login', { errores, codigo, pasword });
        });
    }
});  
 

module.exports = router;
  