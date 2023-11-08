const router = require('express').Router();

const miSchema = require('../models/clase'); // Importa tu modelo

router.get('/alumno', (req, res) => {
    if (req.session.user) {
        // Renderizar la vista de alumno con los datos del usuario
        res.render('alumno/inicio/index', { usuario: req.session.user });
    } else {
        // Redirigir al login si no hay sesión
        res.redirect('/');
    }
});
router.get('/inicio', (req, res) => {
    if (req.session.user) {
        // Renderizar la vista de alumno con los datos del usuario
        res.render('alumno/inicio/index', { usuario: req.session.user });
    } else {
        // Redirigir al login si no hay sesión
        res.redirect('/');
    }
});
router.get('/clases', async (req, res) => {
  // Asegúrate de que la sesión del usuario contenga el código del alumno
  if (req.session.user && req.session.user.codigo) {
    const codigoAlumno = req.session.user.codigo;
    
    try {
      // Busca todas las clases donde el array 'alumnos' contiene el código del alumno
      const clasesEncontradas = (await miSchema.find({ alumnos: codigoAlumno })).map(doc => doc.toObject());

      // Comprueba si se encontraron clases
      if (clasesEncontradas.length > 0) {
        // Si se encuentran clases, renderiza la vista 'alumno/clases/clases' con los datos de las clases
        res.render('alumno/clases/clases', { clases: clasesEncontradas });
      } else {
        // Si no se encuentran clases, informa al usuario
        res.status(404).send('No se encontraron clases para el alumno con el código proporcionado.');
      }
    } catch (error) {
      // Si ocurre un error en la consulta, envía una respuesta de error
      console.error(error);
      res.status(500).send('Ocurrió un error al buscar las clases.');
    }
  } else {
    // Si no hay datos del usuario en la sesión, redirige al inicio de sesión
    res.redirect('/');
  }
});

module.exports = router;    