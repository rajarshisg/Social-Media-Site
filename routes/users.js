const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication, userController.profile);
router.post('/update/:id', passport.checkAuthentication, userController.update);
router.get('/posts', userController.posts);
router.get('/sign-in', userController.signIn);
router.get('/sign-up', userController.signUp);
router.post('/create-user', userController.createUser);
//use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: 'users/sign-in'},
), userController.createSession);
router.get('/sign-out', userController.destroySession);
router.get('/auth/google', passport.authenticate('google', {scope : ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), userController.createSession);
router.get('/forgot_password', userController.forgotPassword);
router.post('/create_reset_token', userController.createResetPasswordToken);
router.get('/reset_password/:access_token', userController.resetPasswordPage);
router.post('/update-password/:access_token', userController.resetPassword);
module.exports = router;