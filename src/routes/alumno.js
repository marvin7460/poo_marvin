const router = require('express').Router();
const userSchema = require('../models/user');

const miSchema = require('../models/clase'); // Importa tu modelo

const obtenerTodasLasClases = async () => {
  try {
      // Realiza la consulta a la base de datos para obtener todas las clases
      const clases = await miSchema.find();
      return clases;
  } catch (error) {
      // Maneja cualquier error que ocurra durante la consulta
      console.error('Error al obtener las clases:', error);
      throw error; // O maneja el error como prefieras
  }
};


router.get('/alumno', (req, res) => {
    if (req.session.user) {
        // Renderizar la vista de alumno con los datos del usuario
        res.render('alumno/inicio/index', { usuario: req.session.user });
    } else {
        // Redirigir al login si no hay sesión
        res.redirect('/');
    }
});

router.get('/alumno/registrar', async (req, res) => {
  if (req.session.user) {
      try {
          // Obtener el código del usuario de la sesión
          const codigoUsuario = req.session.user.codigo;

          // Obtener todas las clases
          const todasLasClases = await miSchema.find().lean();
          
          // Filtrar las clases para incluir solo aquellas donde el usuario no está registrado
          const clasesParaRegistrar = todasLasClases.filter(clase => 
              !clase.alumnos.includes(codigoUsuario)
          );

          // Renderizar la vista con las clases filtradas
          res.render('alumno/registrar/registrar', { clases: clasesParaRegistrar });

      } catch (error) {
          console.error(error);
          res.status(500).send('Error al obtener las clases');
      }
  } else {  
      // Redirigir al login si no hay sesión
      res.redirect('/');
  }
});
router.post('/alumno/agregar-clase', async (req, res) => {
  try {
      const { nrc } = req.body;
      const codigoAlumno = req.session.user.codigo; // Asegúrate de que el código del alumno esté disponible en la sesión

      // Encuentra la clase por NRC y actualiza la lista de alumnos
      await miSchema.findOneAndUpdate({ nrc }, { $addToSet: { alumnos: codigoAlumno } });

      // Redirigir a alguna página o mostrar un mensaje
      res.redirect('/alumno/registrar');
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al agregar la clase');
  }
});
router.get('/alumno/inicio', (req, res) => {
    if (req.session.user) {
        // Renderizar la vista de alumno con los datos del usuario
        res.render('alumno/inicio/index', { usuario: req.session.user });
    } else {
        // Redirigir al login si no hay sesión
        res.redirect('/');
    }
});
router.get('/alumno/clases', async (req, res) => {
  // Asegúrate de que la sesión del usuario contenga el código del alumno
  if (req.session.user && req.session.user.codigo) {
    const codigoAlumno = req.session.user.codigo;
    //console.log(codigoAlumno);
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
router.get('/alumno/salir',async (req,res)=>{
  if (req.session.user) {
    // Renderizar la vista de alumno con los datos del usuario
    res.redirect('/');
}});

router.get('/alumno/cambiar_contrase%C3%B1a', (req, res) => {
  if (req.session.user) {
      // Renderizar la vista de alumno con los datos del usuario
      res.render('alumno/cambiar/cambiar_contraseña', { usuario: req.session.user });
  }
  else {
      // Redirigir al login si no hay sesión
      res.redirect('/');
  
  }})

  router.post('/alumno/cambiar_contrase%C3%B1a', async (req, res) => {
      const { contrasenaActual, nuevaContrasena, confirmarContrasena } = req.body;
  
      // Asegúrate de que el ID del usuario está en la sesión
      const usuarioId = req.session.user._id;
  
      if (nuevaContrasena !== confirmarContrasena) {
          return res.render('alumno/cambiar/cambiar_contraseña', {
              errores: [{ text: 'Las contraseñas nuevas no coinciden.' }]
          });
      }
  
      try {
          // Aquí deberías verificar la contraseña actual
          // Esta es una verificación simulada, debes implementar tu propia lógica
          const contrasenaValida = true;
  
          if (!contrasenaValida) {
              return res.render('alumno/cambiar/cambiar_contraseña', {
                  errores: [{ text: 'La contraseña actual es incorrecta.' }]
              });
          }
  
          // Encripta la nueva contraseña aquí
          const contrasenaEncriptada = nuevaContrasena; // Usa una función de encriptación real
  
          // Actualiza la contraseña del usuario en la base de datos
          await userSchema.updateOne(
              { _id: usuarioId },
              { $set: { pasword: contrasenaEncriptada } }
          );
  
          res.redirect('/');
      } catch (error) {
          console.error(error);
          res.status(500).send('Error al actualizar la contraseña.');
      }
  });

module.exports = router;    