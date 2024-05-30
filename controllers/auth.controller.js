const UserModel = require('../models/user.model')
const jwt = require('jsonwebtoken') //assigner la bibliotheque json
const {signUpErrors} = require('../utils/errors.utils');

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {
        expiresIn: maxAge//expire après 3 jours
    })
}

// fonction pour inscription
module.exports.signUp = async (req, res) => {
    const {pseudo, email, password} = req.body //destructuring / dans la request envoyer le pseudo mail et mot de passe

    try {
        const user = await UserModel.create({pseudo, email, password});
        res.status(201).json({user: user._id}) //reponse avec un statut 201 qui renvoi l'id pour valider la création
    }

    catch(err){
        const errors = signUpErrors(err)
        res.status(200).send({ errors })
    }
}

module.exports.signIn = async (req, res) => {
    const {email, password} = req.body //destructuring

    try{
        const user = await UserModel.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge});
        res.status(200).json({user: user._id})
    } catch (err){
        console.log(err)
        res.status(200).json(err)
    }
}

module.exports.logout = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1}); //pour que le cookie disparaisse rapidement
    res.redirect('/'); //redirection
}