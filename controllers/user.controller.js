const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId; //verifier que les id sont reconnus par la base de données 

module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
};

module.exports.userInfo = (req, res) => {
    console.log(req.params);
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown :' + req.params.id);

    // n'accepte plus les callbacks
    // UserModel.findById(req.params.id, (err, docs) => {
    //     if(!err) res.send(docs)
    //     else console.log('ID unknown : ' + err);
    // }).select('-password'); 

    UserModel.findById(req.params.id).select('-password')
        .then((docs)=>{
        res.status(200).json(docs);
        })
        .catch((error)=>{
        res.status(500).json(error)    
})

};

// impossible d'utiliser les callbacks
// module.exports.updateUser = async (req, res) => {
//     if (!ObjectID.isValid(req.params.id))
//         return res.status(400).send('ID unknown : ' + req.params.id)

//     try{
//         await UserModel.findOneAndUpdate(
//             {_id: req.params.id},
//             {
//                 $set: {
//                     bio: req.body.bio
//                 }
//             },
//             {new: true, upsert: true, setDefaultsOnInsert: true},
//             (err, docs) => {

//                 if (!err) return res.send(docs);
//                 if (err) return res.status(500).send({message: err});
//             }
//         )
//     } catch (err){
//         console.log(err)
//         return res.status(500).json({message: err});
//     }
// };

module.exports.updateUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id)

    try {
        const updatedUser = await UserModel.findOneAndUpdate(
            {_id: req.params.id},
            {$set: {bio: req.body.bio}},
            {new: true, upsert: true, setDefaultsOnInsert: true}
        );
        return res.send(updatedUser);
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: err});
    }
};

module.exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id)

    try {
        await UserModel.deleteOne({_id: req.params.id}).exec();
        res.status(200).json({message : "Suppression réussite. "});
    } catch(err){
        console.log(err)
        return res.status(500).json({message: err})
    }
}

module.exports.follow = async (req, res)=> {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow) )
        return res.status(400).send('ID unknown : ' + req.params.id)

    try {
        // ajout à la liste des followers 
        const user = await UserModel.findByIdAndUpdate(
            req.params.id,
            {$addToSet : {following : req.body.idToFollow}},
            {new: true, upsert: true}
        );
        res.status(201).json(user);
        

        //ajout à la liste des followings
        await UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            {$addToSet : {following : req.body.idToFollow}}, //rajoute à ce qu'on a déjà mit 
            {new: true, upsert: true}
        ); 

    } catch(err){
        console.log(err)
        return res.status(500).json({message: err})
    }
}

module.exports.unfollow = async (req, res)=> {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnfollow))
        return res.status(400).send('ID unknown : ' + req.params.id)

    try {
        // ajout à la liste des followers 
        const user = await UserModel.findByIdAndUpdate(
            req.params.id,
            {$pull : {following : req.body.idToUnfollow}},
            {new: true, upsert: true}
        );
        res.status(201).json(user);
        

        //ajout à la liste des followings
        await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow,
            {$pull : {following : req.body.idToUnfollow}}, //rajoute à ce qu'on a déjà mit 
            {new: true, upsert: true}
        ); 

    } catch(err){
        console.log(err)
        return res.status(500).json({message: err})
    }
}