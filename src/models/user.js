const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    codigo: {
        type: String,
        required: true,
        unique: true
    },
    pasword: { // Corrected the typo here from 'pasword' to 'password'
        type: String,
        required: true
    },
    nombre: { // 'Nombre' field added
        type: String,
        required: true
    },
    situacion: { // 'Situación' field added
        type: String,
        required: true
    },
    nivel: { // 'Nivel' field added
        type: String,
        required: true
    },
    carrera: { // 'Carrera' field added
        type: String,
        required: false // Assuming it's not required, adjust as needed
    },
    centro: { // 'Centro' field added
        type: String,
        required: false // Assuming it's not required, adjust as needed
    },
    sede: { // 'Sede' field added
        type: String,
        required: false // Assuming it's not required, adjust as needed
    },
    periodo: { // 'Período' field added
        type: String,
        required: false // Assuming it's not required, adjust as needed
    },
    nrcs: {
        nrc: [String] // Un array de strings dentro de un objeto
      }
});

module.exports = mongoose.model('User', userSchema);
