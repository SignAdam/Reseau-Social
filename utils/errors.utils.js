module.exports.signUpErrors = (err) => {
    let errors = {pseudo : '', email: '', password: ''}

    if (err.message.includes('pseudo'))
        errors.pseudo = "Impossible d'utiliser ce pseudo";

    if (err.message.includes('email'))
        errors.email = "Mail invalide";

    if (err.message.includes('password'))
        errors.password = "Mot de passe invalide";

    if(err.code == 11000 && Object.keys(err.keyValue)[0].includes('pseudo'))
        errors.pseudo = "Ce pseudo est déjà utilisé";
    
    if(err.code == 11000 && Object.keys(err.keyValue)[0].includes('email'))
        errors.email = "Cet email est déjà utilisé";


    return errors;
};

// module.exports.signInErrors = (err) => {
//     let errors = {email: '', password: ''}

//     if (err.message.includes("email"))
//         errors.email = "Mail inconnu";

//     if (err.message.includes("password"))
//         errors.password = "Mot de passe incorrect";

//     return errors;
// };

// module.exports.uploadErrors = (err) =>{
//     let errors = {format: '', maxSize: ""};
//     if(err.message.includes('invalid file'))
//         errors.format= "Format incompatible";

//     if(err.message.includes('max size'))
//         errors.maxSize = "Le fichier dépasse 500ko";

//     return errors 
// }