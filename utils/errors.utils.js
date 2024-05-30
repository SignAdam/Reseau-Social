module.exports.signUpErrors = (err) => {
    let errors = {pseudo : '', email: '', password: 'Mauvais mot de passe'}

    if (err.message.includes('pseudo'))
        errors.pseudo = "Impossible d'utiliser ce pseudo";

    if (err.message.includes('email'))
        errors.email = "Mail invalide";

    if (err.message.includes(''))
        errors.password = "Mot de passe invalide";

    if(err.code == 11000 && Object.keys(err.keyValue)[0].includes('pseudo'))
        errors.email = "Cet pseudo est déjà utilisé";
    
    if(err.code == 11000 && Object.keys(err.keyValue)[0].includes('email'))
        errors.email = "Cet email est déjà utilisé";


    return errors
}