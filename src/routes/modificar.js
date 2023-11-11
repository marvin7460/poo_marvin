const router = require('express').Router();
const userSchema = require('../models/user');
const profeSchema = require('../models/profesor');
const miSchema = require('../models/clase'); // Importa tu modelo

// Ruta para mostrar información de usuario (alumno o profesor) y sus clases
router.get('/administrador/buscar/encontrado', async (req, res) => {
    // Verifica si hay un usuario en sesión
    if (!req.session.user) {
        return res.redirect('/'); // No hay sesión, redirige al inicio de sesión
    }

    const usuario = req.session.user;
    let filtroClases;

    try {
        // Determina si la sesión es de un alumno o un profesor
        const esProfesor = !!usuario.nacionalidad;
        const esAlumno = !esProfesor;

        // Prepara el filtro basado en si es alumno o profesor
        if (esProfesor) {
            filtroClases = { maestro: usuario.nombreCompleto };
        } else if (esAlumno) {
            filtroClases = { alumnos: usuario.codigo };
        }

        // Busca las clases basadas en el filtro
        const clasesEncontradas = await miSchema.find(filtroClases).lean();

        // Verifica si se encontraron clases
        if (clasesEncontradas.length > 0) {
            // Renderiza la vista correspondiente con los datos de las clases
            const vista = esProfesor ? 'administrador/buscar/b-profe' : 'administrador/buscar/bs-alumno';
            res.render(vista, { clases: clasesEncontradas, usuario: req.session.user });
        } else {
            // No se encontraron clases, informa al usuario
            const mensajeError = esProfesor ? 'No se encontraron clases para el profesor.' : 'No se encontraron clases para el alumno.';
            res.status(404).send(mensajeError);
        }
    } catch (error) {
        // Error en la consulta, envía una respuesta de error
        console.error(error);
        res.status(500).send('Ocurrió un error al buscar las clases.');
    }
});




router.get('/administrador/salir',async (req,res)=>{
    if (req.session.user) {
      // Renderizar la vista de alumno con los datos del usuario
      res.redirect('/');
  }});

module.exports = router;    