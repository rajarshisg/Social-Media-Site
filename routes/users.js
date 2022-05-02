const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controllers/users_controller');

router.get('/allProfiles', passport.checkAuthentication, userController.allProfiles)
router.get('/profile/:id', passport.checkAuthentication, userController.profile);
router.post('/update/:id', passport.checkAuthentication, userController.update);
router.get('/posts', userController.posts);
router.get('/sign-in', userController.signIn); //route for sign in page
router.get('/sign-up', userController.signUp); //route for sign up page
router.post('/create-user', userController.createUser); //route for creating a new user

//route is used to create a session cookie, use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    { failureRedirect: 'sign-in' },
), userController.createSession);

router.get('/sign-out', userController.destroySession);
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: 'sign-in' }), userController.createSession);
router.get('/forgot_password', userController.forgotPassword);
router.post('/create_reset_token', userController.createResetPasswordToken);
router.get('/reset_password/:access_token', userController.resetPasswordPage);
router.post('/update-password/:access_token', userController.resetPassword);
router.get('/send-friend-request/:id', userController.sendFriendRequest);
router.get('/accept-friend-request/:id', userController.acceptFriendRequest);
router.get('/reject-friend-request/:id', userController.rejectFriendRequest);
router.get('/remove-friend/:id', userController.unfriend);
module.exports = router;