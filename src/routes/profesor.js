const router = require('express').Router();
const misSchema = require('../models/clase'); // Importa tu modelo

router.get('/profesor', (req, res) => {
    if (req.session.user) {
        // Renderizar la vista de alumno con los datos del usuario
        res.render('profesor/inicio/index', { usuario: req.session.user });
    } else {
        // Redirigir al login si no hay sesión
        res.redirect('/');
    }
});
router.get('/profesor/inicio', (req, res) => {
    if (req.session.user) {
        // Renderizar la vista de alumno con los datos del usuario
        res.render('profesor/inicio/index', { usuario: req.session.user });
    } else {
        // Redirigir al login si no hay sesión
        res.redirect('/');
    }
});

router.get('/profesor/clases', async (req, res) => {
    // Asegúrate de que la sesión del usuario contenga el código del alumno
    if (req.session.user && req.session.user.nombreCompleto) {
      const codigoAlumno = req.session.user.nombreCompleto;
      //console.log(codigoAlumno);
      try {
        // Busca todas las clases donde el array 'alumnos' contiene el código del alumno
        const clasesEncontradas = (await misSchema.find({ maestro: codigoAlumno })).map(doc => doc.toObject());
  
        // Comprueba si se encontraron clases
        if (clasesEncontradas.length > 0) {
          // Si se encuentran clases, renderiza la vista 'alumno/clases/clases' con los datos de las clases
          res.render('alumno/clases/clases', { clases: clasesEncontradas });
        } else {
          // Si no se encuentran clases, informa al usuario
          res.status(404).send('No se encontraron clases para el profesor con el código proporcionado.');
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

  router.get('/profesor/salir',async (req,res)=>{
    if (req.session.user) {
      // Renderizar la vista de alumno con los datos del usuario
      res.redirect('/');
}});


module.exports = router;    