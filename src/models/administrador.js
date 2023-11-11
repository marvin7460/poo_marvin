const mongoose = require('mongoose');


const usuarioSchema = mongoose.Schema({
    nombreCompleto: {
        type: String,
        required: true
    },
    codigo: {
        type: String,
        required: true,
        unique: true
    },
    pasword: {
        type: String,
        required: true
    },
    titulosObtenidos: [{
        tipo: String, // Por ejemplo: 'Pregrado', 'Posgrado'
        nombreTitulo: String,
        institucion: String,
        año: Number
    }],
    areasEspecializacion: [String],
    certificaciones: [{
        nombre: String,
        institucion: String,
        año: Number
    }],
    posicionActual: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('administrador', usuarioSchema);

