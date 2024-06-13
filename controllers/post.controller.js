const postModel = require('../models/post.model');
const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.readPost = async (req, res) => {
    try {
        const docs = await PostModel.find().sort({createdAt: -1 });//pour le triage de données
        res.send(docs);
    } catch (err) {
        console.log('Erreur de connexion aux données : ' + err);
        res.status(500).send('Erreur de connexion aux données');
    }
};


module.exports.createPost = async (req, res) => {
    const newPost = new postModel({
        posterId: req.body.posterId,
        message: req.body.message,
        video: req.body.video,
        likers: [],
        comments: [],
    });

    //incrementer la data dans mongodb
    try{
        const post = await newPost.save();
        return res.status(201).json(post)
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.updatePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID unknown : " + req.params.id);
    }

    const updateRecord = {
        message: req.body.message
    };

    try {
        const docs = await PostModel.findByIdAndUpdate(
            req.params.id,
            { $set: updateRecord },
            { new: true }
        );
        if (!docs) {
            return res.status(404).send("Post not found");
        }
        res.send(docs);
    } catch (err) {
        console.log('Update error : ' + err);
        res.status(500).send('Update error: ' + err);
    }
};


module.exports.deletePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) 
        return res.status(400).send("ID unknown : " + req.params.id);
    
    try{
        const docs = await PostModel.findByIdAndDelete(req.params.id);
        res.send(docs)
    } catch (err){
        console.log(err)
        restart.status(500).send('Post pas trouvé' + err)
    }
}

module.exports.likePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID inconnu : " + req.params.id);

    try {
        const postUpdate = await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: { likers: req.body.id }
            },
            { new: true }
        );
        
        if (!postUpdate) {
            return res.status(404).send("Post not found");
        }

        const userUpdate = await UserModel.findByIdAndUpdate(
            req.body.id,
            {
                $addToSet: { likes: req.params.id }
            },
            { new: true }
        );

        if (!userUpdate) {
            return res.status(404).send("User not found");
        }

        res.send({ postUpdate, userUpdate });
    } catch (err) {
        console.log('Error : ', err);
        return res.status(500).send(err);
    }
};


module.exports.unlikePost = async(req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID inconnu : " + req.params.id)

    try {
        const postUpdate = await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { likers: req.body.id }
            },
            { new: true }
        );
        
        if (!postUpdate) {
            return res.status(404).send("Post not found");
        }

        const userUpdate = await UserModel.findByIdAndUpdate(
            req.body.id,
            {
                $pull: { likes: req.params.id }
            },
            { new: true }
        );

        if (!userUpdate) {
            return res.status(404).send("User not found");
        }

        res.send({ postUpdate, userUpdate });
    } catch (err) {
        console.log('Error : ', err);
        return res.status(500).send(err);
    }
}

module.exports.commentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID inconnu : " + req.params.id);

    const comment = {
        commenterId: req.body.commenterId,
        commenterPseudo: req.body.commenterPseudo,
        text: req.body.text,
        timestamp: new Date().getTime()
    };
    try {
        const updatedPost = await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: { comments: comment }
            },
            { new: true }
        );
        if (!updatedPost) {
            return res.status(404).send("Post not found");
        }

        res.send(updatedPost);
    } catch (err) {
        console.log('Error: ', err);
        return res.status(500).send(err);
    }
};


module.exports.editCommentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID inconnu : " + req.params.id);
  
    try {
      const post = await PostModel.findById(req.params.id);
      if (!post) return res.status(404).send("Post non trouvé");
  
      const theComment = post.comments.find((comment) =>
        comment._id.equals(req.body.commentId)
      );
  
      if (!theComment) return res.status(404).send("Commentaire non trouvé");
  
      theComment.text = req.body.text;
  
      try {
        await post.save();
        return res.status(200).send(post);
      } catch (saveErr) {
        return res.status(500).send(saveErr);
      }
    } catch (err) {
      return res.status(400).send(err);
    }
  };
  


  module.exports.deleteCommentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID inconnu : " + req.params.id);

    try {
        const updatedPost = await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comments: {
                        _id: req.body.commentId
                    }
                }
            },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).send("Post not found");
        }

        res.send(updatedPost);
    } catch (err) {
        console.log('Error:', err);
        return res.status(400).send(err);
    }
};
