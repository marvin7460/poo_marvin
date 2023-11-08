const mongoose = require('mongoose');

const miSchema = mongoose.Schema({
    nrc: {
        type: String,
        required: true,
        unique: true
    },
    nombre: { // 'Nombre' field added
        type: String,
        required: true
    },
    maestro: { // 'Profesor' field added
        type: String,
        required: true
    },
    horario: { // 'Horario' field added
        type: String,
        required: true
    },
    salon :{ // 'Aula' field added
        type: String,
        required: true
    },
    periodo: { // 'Período' field added
        type: String,
        required: true
    },
    alumnos: { // 'Alumnos' field added
        type: [String],
        required: true
    }
});
module.exports = mongoose.model('alumno', miSchema);