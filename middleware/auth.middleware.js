const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const UserModel = require('../models/user.model');

// check du token de l'utilisateur si il est reconnu
module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token){
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                res.cookies('jwt', '', {maxAge: 1});
                next();
            } else {
                let user = await UserModel.findById(decodedToken.id);
                res.locals.user = user;
                next()
            }
        })
    }else {
        res.locals.user = null;
        next();
    }
}

//middleware pour la premiere authentification du debut
module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token){
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err){
                console.log(err);
            } else {
                console.log(decodedToken.id);
                next();
            }
        })
    } else {
        console.log('Pas de Token');
    }
}
