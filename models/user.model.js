const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

//schema qui provient de la bibliotheque mongoose dans lequelle on va declarer le schema utilsateur
const userSchema = new mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 55,
            unique: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true,
            unique: true,
            trim: true, //retirer les espaces automatiquement
        },

        password: {
            type: String,
            required: true,
            minLength: 8,
            maxLength: 1024, //1024 car le password sera crypté 
        },

        picture: {
            type: String,
            default: "./uploads/profil/random-user.png"
        },

        bio: {
            type : String,
            max: 1024,
        },

        followers: {
            type: [String] //l'id de l'utilisateur qui l'aura suivi s'integrera dans ce tableau 
        },
        
        following: {
            type: [String]
        },

        likes: {
            type: String,
        }
    },

    //pour la date d'inscription de l'utilisateur
    {
        timestamps: true,
    }
)

userSchema.pre("save", async function(next){
    if (this.isModified('pseudo')) {
        this.pseudo = this.pseudo.toLowerCase();
    }
    next();
    const salt = await bcrypt.genSalt(); //generer un mot de passe que seul bcrypt peut comprendre
    this.password = await bcrypt.hash(this.password, salt)
    next(); //next qui signifie après cette étape faite passer à la suite directement
});

userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if (auth){
            return user;
        }
        throw Error('Mot de passe incorrecte');
    }
    throw Error('Email incorrecte')
}

const UserModel = mongoose.model('user', userSchema);
module.exports = UserModel; 