//require du framework express
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
require('dotenv').config({path: './config/.env'}); //recuperer les parametres environnement
require('./config/db');
const {checkUser, requireAuth} = require('./middleware/auth.middleware');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({encoded: true}));
app.use(cookieParser());

//jwt
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
});

//routes
app.use('/api/user', userRoutes);


// ecouter le port 5000
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})