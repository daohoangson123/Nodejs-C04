import aboutRoute from './aboutRoute.js';
import authRoute from './authRoute.js';
import blogRoute from './blogRoute.js';
import projectRoute from './projectRoute.js';
import subscriberRoute from './subscriberRoute.js';
import userRoute from './userRoute.js';

function routes(app) {
    app.use('/auth', authRoute);
    app.use(
        '/api',
        userRoute,
        blogRoute,
        projectRoute,
        aboutRoute,
        subscriberRoute,
    );

    app.get('/', (req, res) => {
        req.header;
        res.cookie('userName', 'son', {
            maxAge: 60000,
            httpOnly: true,
        });
        res.send('C04');
    });
}

export default routes;
