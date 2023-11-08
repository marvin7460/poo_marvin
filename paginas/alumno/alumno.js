const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs'); // Establecer el motor de plantillas a EJS
app.use(express.static('public')); // Carpeta para archivos estáticos como CSS

// Datos de las clases en variables
const claseMatematicas = {
    codigo: 'MAT123',
    horario: 'Lunes y Miércoles, 10:00 AM - 12:00 PM',
    creditos: 3
};

const claseHistoria = {
    codigo: 'HIS456',
    horario: 'Martes y Jueves, 2:00 PM - 4:00 PM',
    creditos: 4
};

app.get('/', (req, res) => {
    res.render('index', { claseMatematicas, claseHistoria });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});