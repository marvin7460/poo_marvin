const router = require('express').Router();
const userSchema = require('../models/user');
const profeSchema = require('../models/profesor');
const adminSchema = require('../models/administrador');
const miSchema = require('../models/clase'); // Importa tu modelo
// Variable global para almacenar el usuario encontrado
router.get('/administrador', (req, res) => {
    if (req.session.user.posicionActual) {
        // Renderizar la vista de alumno con los datos del usuario
        //console.log(req.session.user);
        res.render('administrador/inicio/index', { usuario: req.session.user });
    } else {
        // Redirigir al login si no hay sesión
        res.redirect('/');
    }
});
router.get('/administrador/inicio', (req, res) => {
    if (req.session.user.posicionActual) {
        // Renderizar la vista de alumno con los datos del usuario
        //console.log(req.session.user);
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
router.get('/administrador/cambiar_contrase%C3%B1a', (req, res) => {
    if (req.session.user) {
        // Renderizar la vista de alumno con los datos del usuario
        res.render('administrador/cambiar/cambiar_contraseña', { usuario: req.session.user });
    }
    else {
        // Redirigir al login si no hay sesión
        res.redirect('/');
    
    }})

    router.post('/administrador/cambiar_contrase%C3%B1a', async (req, res) => {
        const { contrasenaActual, nuevaContrasena, confirmarContrasena } = req.body;
    
        // Asegúrate de que el ID del usuario está en la sesión
        const usuarioId = req.session.user._id;
    
        if (nuevaContrasena !== confirmarContrasena) {
            return res.render('administrador/cambiar/cambiar_contraseña', {
                errores: [{ text: 'Las contraseñas nuevas no coinciden.' }]
            });
        }
    
        try {
            // Aquí deberías verificar la contraseña actual
            // Esta es una verificación simulada, debes implementar tu propia lógica
            const contrasenaValida = true;
    
            if (!contrasenaValida) {
                return res.render('administrador/cambiar/cambiar_contraseña', {
                    errores: [{ text: 'La contraseña actual es incorrecta.' }]
                });
            }
    
            // Encripta la nueva contraseña aquí
            const contrasenaEncriptada = nuevaContrasena; // Usa una función de encriptación real
    
            // Actualiza la contraseña del usuario en la base de datos
            await adminSchema.updateOne(
                { _id: usuarioId },
                { $set: { pasword: contrasenaEncriptada } }
            );
    
            res.redirect('/');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al actualizar la contraseña.');
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
        if (alumnos || profesores || administradores) {
            // Almacena los resultados en una nueva propiedad de la sesión
            req.session.searchResults = {
                alumnos: alumnos ? { ...alumnos._doc, password: undefined } : null,
                profesores: profesores ? { ...profesores._doc, password: undefined } : null,
                administradores: administradores ? { ...administradores._doc, password: undefined } : null,
            };
        
            // Redirige a la ruta deseada
            res.redirect('/administrador/buscar/encontrado')
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