const mongoose = require("mongoose");

mongoose
    .connect('mongodb+srv://' + process.env.DB_USER_PASS + '@cluster0.b1zcgqp.mongodb.net/projet-annuel',
        { //parametres depuis la doc
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false,
        }
    )
    .then(() => console.log('Connected to MongoDB')) //valider la connection
    .catch((err) => console.log('Failed to connect to MongoDB', err)) //catcher l'erreur 