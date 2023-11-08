const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const { engine }  = require('express-handlebars');
const mongoose = require('mongoose');
require('dotenv').config();
const UserRoutes = require('./routes/user');

//conecciones
const port = process.env.PORT || 5000;
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs',engine({
    defaultLayout: 'main',
    extname: '.hbs',
    partialsDir: path.join(app.get('views'), 'partials'),
    layoutsDir: path.join(app.get('views'), 'layouts')
}));
app.set('view engine', '.hbs');

//midelwares
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'NERO',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

//rutas
app.use(require('./routes/index'));
app.use(require('./routes/alumno'));
app.use(require('./routes/user'));

//estaticos
app.use(express.static(path.join(__dirname, 'public')));

//apis
app.use(express.json());
app.use('/api',UserRoutes);

// Conexión a la base de datos
mongoose.connection.openUri(process.env.MONGODb_URI)
.then(() => {
    console.log('Conectado a la base de datos');
});


//servidor esuchando
app.listen(port, () => {
    console.log('Server on port', port);
});
