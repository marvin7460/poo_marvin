const router = require('express').Router();
const userSchema = require('../models/user');
const profeSchema = require('../models/profesor');
const adminSchema = require('../models/administrador');
const miSchema = require('../models/clase'); // Importa tu modelo

router.get('/administrador', (req, res) => {
    if (req.session.user) {
        // Renderizar la vista de alumno con los datos del usuario
        res.render('administrador/inicio/index', { usuario: req.session.user });
    } else {
        // Redirigir al login si no hay sesión
        res.redirect('/');
    }
});
router.get('/administrador/inicio', (req, res) => {
    if (req.session.user) {
        // Renderizar la vista de alumno con los datos del usuario
        res.render('administrador/inicio/index', { usuario: req.session.user });
    } else {
        // Redirigir al login si no hay sesión
        res.redirect('/');
    }
});

router.get('/administrador/buscar', (req, res) => {
    if (req.session.user) {
        // Renderizar la vista de alumno con los datos del usuario
        res.render('administrador/buscar/buscar', { usuario: req.session.user });
    } else {
        // Redirigir al login si no hay sesión
        res.redirect('/');
    }
});

router.get('/administrador/salir',async (req,res)=>{
    if (req.session.user) {
      // Renderizar la vista de alumno con los datos del usuario
      res.redirect('/');
  }});
  
// Ruta para manejar el inicio de sesión
router.post('/administrador/buscar/encontrado', async (req, res) => {
    const { nombre, clase, codigo } = req.body;
    const errores = [];

    // Crear un array de consultas basado en los criterios de búsqueda proporcionados
    let queryConditions = [];
    if (nombre) queryConditions.push({ nombre: new RegExp(nombre, 'i') }); // Búsqueda insensible a mayúsculas y minúsculas
    if (clase) queryConditions.push({ clase: new RegExp(clase, 'i') }); // Búsqueda insensible a mayúsculas y minúsculas
    if (codigo) queryConditions.push({ codigo });

    // Crear un objeto de consulta para el operador $or
    const searchQuery = queryConditions.length ? { $or: queryConditions } : {};

    // Chequear si hay condiciones de búsqueda, de lo contrario, enviar un error
    if (!queryConditions.length) {
        errores.push({ text: 'Por favor, proporcione al menos un criterio de búsqueda.' });
        res.render('login', { errores }); // Asegúrate de que 'login' es tu vista de búsqueda
        return;
    }

    try {
        // Ejecutar las búsquedas de forma concurrente
        const [alumnos, profesores, administradores] = await Promise.all([
            userSchema.findOne(searchQuery),
            profeSchema.findOne(searchQuery),
            adminSchema.findOne(searchQuery)
        ]);

        // Chequear los resultados y redirigir según corresponda
        if (alumnos) {
            req.session.user = { ...alumnos._doc, password: undefined };
            res.redirect('/administrador/buscar/encontrado');
        } else if (profesores) {
            req.session.user = { ...profesores._doc, password: undefined };
            res.redirect('/administrador/buscar/encontrado')
        } else if (administradores) {
            req.session.user = { ...administradores._doc, password: undefined };
            res.redirect('/administrador');
        } else {
            // Si no se encontraron resultados, enviar mensaje de error
            errores.push({ text: 'No se encontraron resultados con los criterios proporcionados.' });
            res.render('login', { errores, nombre, clase, codigo });
        }
    } catch (error) {
        // En caso de un error en alguna de las consultas, enviar mensaje de error
        errores.push({ text: 'Error durante la búsqueda.' });
        res.render('login', { errores, nombre, clase, codigo });
    }
});

module.exports = router;   