const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');


//auth 

// methode post pour ajouter un utilisateur 
router.post("/register", authController.signUp); //utilisation de la fonction pour l'authendification
router.post('/login', authController.signIn);
router.get('/logout', authController.logout);

//user display: 'block',
router.get('/', userController.getAllUsers);
router.get('/:id', userController.userInfo);
router.put("/:id", userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.patch('/follow/:id', userController.follow); //mettre à jour le tableau à l'interieur d'un utilisateur
router.patch('/unfollow/:id', userController.unfollow); 

module.exports = router;