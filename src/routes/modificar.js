const router = require('express').Router();
const userSchema = require('../models/user');
const profeSchema = require('../models/profesor');
const miSchema = require('../models/clase'); // Importa tu modelo

router.post('/cambiopf', (req, res) => {
    const { id, nombreCompleto, nacionalidad, departamentoFacultad, codigo } = req.body;

    // Usar el campo 'id' para encontrar el documento del profesor
    profeSchema.findOneAndUpdate({ codigo: codigo },{
        nombreCompleto,
        nacionalidad,
        departamentoFacultad,
        codigo
    }, { new: true })
    .then(updatedProfesor => {
        if (updatedProfesor) {
            // Profesor actualizado con éxito
            res.redirect('/administrador/buscar/encontrado'); // Modificar con la ruta deseada
        } else {
            // Profesor no encontrado
            res.status(404).send('Profesor no encontrado');
        }
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('Error al actualizar los datos del profesor');
    });
});

router.post('/cambioal', (req, res) => {
    const { codigo, nombre, situacion, nivel, carrera, periodo, centro, sede } = req.body;

    // Identificador del usuario (debes obtenerlo de alguna manera, ej. de la sesión)

    userSchema.findOneAndUpdate({ codigo: codigo }, {
        nombre,
        situacion,
        nivel,
        carrera,
        periodo,
        centro,
        sede
    }, { new: true }) // { new: true } para devolver el documento modificado
    .then(updatedUser => {
        // Redirigir o manejar la respuesta tras la actualización exitosa
        res.redirect('/administrador/buscar/encontrado');

    })
    .catch(error => {
        // Manejar errores, como un fallo en la conexión a la base de datos
        console.error(error);
        res.status(500).send('Error al actualizar los datos del usuario');
    });
});
router.post('/alumno/eliminar-clase', async (req, res) => {
    try {
        const { nrc} = req.body;
        const { alumnos, profesores } = req.session.searchResults;
        //const codigoAlumno = req.session.searchResults.codigo; // Asegúrate de que el código del alumno esté disponible en la sesión
        //console.log(alumnos.codigo);
        //console.log(nrc);
        // Encuentra la clase por NRC y elimina el código del alumno de la lista de alumnos
        await miSchema.findOneAndUpdate({ nrc }, { $pull: { alumnos: alumnos.codigo } });

        // Redirigir a alguna página o mostrar un mensaje
        res.redirect('/administrador/buscar/encontrado');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar la clase');
    }
});

// Ruta para mostrar información de usuario (alumno o profesor) y sus clases
router.get('/administrador/buscar/encontrado', async (req, res) => {
    // Verifica si hay resultados de búsqueda en la sesión
    if (!req.session.searchResults) {
        return res.redirect('/'); // No hay resultados de búsqueda, redirige
    }

    try {
        //console.log(req.session.searchResults);
        const { alumnos, profesores } = req.session.searchResults;
        let filtroClases;

        // Determina si la sesión es de un alumno o un profesor
        if (profesores) {
            filtroClases = { maestro: profesores.nombreCompleto };
        } else if (alumnos) {
            filtroClases = { alumnos: alumnos.codigo };
        } else {
            // No hay información de alumno o profesor
            return res.status(404).send('No se encontró información del usuario.');
        }

        // Busca las clases basadas en el filtro
        const clasesEncontradas = await miSchema.find(filtroClases).lean();

        // Verifica si se encontraron clases
        if (clasesEncontradas.length > 0) {
            // Renderiza la vista correspondiente con los datos de las clases
            const vista = profesores ? 'administrador/buscar/b-profe' : 'administrador/buscar/bs-alumno';
            res.render(vista, { clases: clasesEncontradas, usuario: alumnos || profesores });
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