import app from './app';
import user from './routes/app.routes';

app.use('/', user);

app.listen(app.get('PORT'), () => {
    console.log(`http://localhost:${app.get('PORT')}`);
});