//require du framework express
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const uploadRoute = require('./routes/upload');
require('dotenv').config({path: './config/.env'}); //recuperer les parametres environnement
require('./config/db');
const {checkUser, requireAuth} = require('./middleware/auth.middleware');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({encoded: true}));
app.use(cookieParser());

// Middleware pour parser le body des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Intégrer la route de l'upload
app.use('/api/user', uploadRoute);

//jwt
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
});

//routes
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes)


// ecouter le port 5000
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})