import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import connectToDatabase from './configDatabase.js';
import routes from './routes/index.js';
import cookieParser from 'cookie-parser';
import errorHandler from './app/middlewares/errorHandler.js';
import cors from 'cors';

const app = express();

await connectToDatabase();

app.use(
    cors({
        origin: 'https://localhost:4000',
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.resolve('src/public')));
app.engine('hbs', engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', 'src/views');

routes(app);

app.use(errorHandler);

app.listen(4000, () => {
    console.log('App listening at http://localhost:4000');
});
