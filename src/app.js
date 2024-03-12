import express from 'express';
import path from 'path';
import config from './config';
import user from './routes/app.routes';
import morgan from 'morgan';

const app = express();

// Configuracion
app.set('PORT', config.PORT);

//Para recibir los datos en los formulario del codigo HTML en el app.controller (req.body)
app.use(express.urlencoded({ extended: true }));

// Platilla ejs para las views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files - Complementos como imagenes, archivos css, framework, codigos fuentes, javascript front-end se coloca en otra carpeta llamada 'public'
app.use(express.static(path.join(__dirname, "public")));

//Middleware
app.use(morgan('dev'));

app.use(user);

export default app;