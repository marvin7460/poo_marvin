const mongoose = require('mongoose');

const profesorSchema = mongoose.Schema({
  nombreCompleto: {
    type: String,
    required: [true, 'El nombre completo es obligatorio']
  },
  nacionalidad: {
    type: String,
    required: [true, 'La nacionalidad es obligatoria']
  },
  titulosAcademicos: [{
    titulo: {
      type: String,
      required: [true, 'El título académico es obligatorio']
    },
    institucion: {
      type: String,
      required: [true, 'La institución del título académico es obligatoria']
    },
    fechaObtencion: Date // Opcional, dependiendo de si quieres almacenar la fecha de obtención del título
  }],
  cursosImpartidos: [{
    nombreCurso: String,
    codigoCurso: String
  }],
  departamentoFacultad: {
    type: String,
    required: [true, 'El departamento o facultad es obligatorio']
  },
   codigo:{ 
      type: String,
      required: [true, 'El código es obligatorio'],
      unique: true // Asegura que el código sea único en la colección
    },
    contrasena: {
      type: String,
      required: [true, 'La contraseña es obligatoria']
  }
  ,
  nrcs: [String] // Lista de NRCs que puede ser un array de strings
});

// Crear el modelo basado en el esquema
module.exports  = mongoose.model('Profesor', profesorSchema);
