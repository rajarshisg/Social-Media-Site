const express = require("express");
const User = require("../models/user");
const PasswordToken = require('../models/reset_password_token');
const resetLinkMailer = require('../mailers/forgot_password_mailer');
const newUserMailer = require('../mailers/new_user_mailer');
const Message = require('../models/message');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

module.exports.allProfiles = async function (req, res) {
    try {
        let users = await User.find({});
        return res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Some error occured' });
    }
}

module.exports.profile = async function (req, res) {
    try {
        let user = await User.findById(req.params.id).populate({
            path: 'posts',
            populate: {
                path: 'user comments',
                populate: {
                    path: 'user'
                }
            },
            options: {
                sort: { 'createdAt': -1 }
            }
        });

        let currUser = await User.findById(req.user._id);

        let isFriend = (user.friends.indexOf(currUser._id) == -1) ? false : true;
        let sentRequest = (user.sentRequests.indexOf(currUser._id) == -1) ? false : true;
        let recievedRequest = (user.recievedRequests.indexOf(currUser._id) == -1) ? false : true;

        return res.render('user_profile', {
            title: 'Connecti | User Profile',
            profile_user: user,
            isFriend: isFriend,
            acceptOrRejectRequest: sentRequest,
            awaitingResponse: recievedRequest,
            isFollowed: true
        });

    } catch (err) {
        console.log('Error occured in profile controller!');
        return;
    }

}

module.exports.update = async function (req, res) {
    if (req.user.id == req.params.id) {
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function (err) {
                if (err) {
                    console.log('Multer error : ', err);
                }
                user.name = req.body.name;
                user.email = req.body.email;
                user.about = req.body.about;
                if (req.file) {
                    if (user.avatar && fs.existsSync(path.join(__dirname, '..', user.avatar))) {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    //this is saving the path of the uploaded file into the avatar field in user
                    user.avatar = User.avatarPath + '/' + req.file.filename;

                }
                user.save();
                return res.redirect('back');
            });
        } catch (err) {
            req.flash('error', err);
            return res.redirect('back');
        }

    } else {
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}

module.exports.posts = function (req, res) {
    return res.end('<h1>Posts</h1>');
}

//renders the sign in page on route '/users/sign-in'
module.exports.signIn = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: 'Connecti | Sign In'
    });
}

//renders the sign up page on route '/users/sign-up'
module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: 'Connecti | Sign Up'
    });
}

//creates a new user
module.exports.createUser = function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        //if password and confirm password don't match
        req.flash('error', 'Passwords don\'t match!');
        return res.redirect('back');
    }

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) { console.log('Error in searching for user in DB!'); return; }

        if (!user) {
            //if user dosen't exist in db we create one
            User.create(req.body, function (err, user) {
                if (err) { console.log('Error in creating user!'); return; }
                req.flash('success', 'Account created!');
                newUserMailer.newUser(user);
                return res.render('user_sign_in', {
                    title: 'Connecti | Sign In'
                });
            });
        } else {
            //if user already exist
            req.flash('error', 'Account already exists');
            return res.redirect('back');
        }
    })

}

//creates a new session for the user
module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged in succesfully!'); //flash message
    return res.redirect('/');
}

//destroys the session for the user
module.exports.destroySession = function (req, res) {
    req.logout();
    req.flash('success', 'Logged out succesfully!'); //flash message
    return res.redirect('/users/sign-in');
}


module.exports.forgotPassword = function (req, res) {
    return res.render('user_forgot_password', {
        title: 'Connecti | Forgot Password'
    });
}

module.exports.createResetPasswordToken = async function (req, res) {
    try {
        let reqUser = await User.findOne({ email: req.body.email });
        if (reqUser) {
            let passwordToken = await PasswordToken.create({
                user: reqUser._id,
                accessToken: crypto.randomBytes(20).toString('hex'), //generating a random acccess token
                isValid: true
            });
            passwordToken = await passwordToken.populate('user', 'email').execPopulate();
            resetLinkMailer.newResetLink(passwordToken);
            req.flash('success', 'Reset Link Sent! Check your mail (spam/others)!')
            return res.redirect('back');
        } else {
            req.flash('error', 'Email does not exist!');
            return res.render('user_sign_in', {
                title: 'Connecti | Sign In'
            });
        }
    } catch (err) {
        console.log('Error in creating reset token!');
    }
}




module.exports.resetPasswordPage = async function (req, res) {
    try {
        let passwordToken = await PasswordToken.findOne({ accessToken: req.params.access_token });
        return res.render('user_reset_password', {
            title: 'Connecti | Reset Password',
            password_token: passwordToken
        });
    } catch (err) {
        console.log('Error in accessing reset token!');
    }

}

module.exports.resetPassword = function (req, res) {
    PasswordToken.findOneAndUpdate({ accessToken: req.params.access_token }, { isValid: false }, function (err, passwordToken) {
        if (passwordToken.isValid == true) {
            if (req.body.password != req.body.confirm_password) {
                req.flash('error', 'Passwords don\'t match!');
                return res.redirect('back');
            }
            User.findByIdAndUpdate(passwordToken.user, { password: req.body.password }, function (err, user) {
                if (err) { console.log('Error while resetting the password'); return; }
                req.flash('sucess', 'Password updated successfully!');
                return res.redirect('/users/sign-in');
            });
        }
    });
}

module.exports.sendFriendRequest = async function (req, res) {
    try {

        let toUser = await User.findById(req.params.id);
        let fromUser = await User.findById(req.user._id);

        let indexOne = toUser.recievedRequests.indexOf(fromUser._id);
        let indexTwo = fromUser.sentRequests.indexOf(toUser._id);
        let indexThree = toUser.friends.indexOf(fromUser._id);

        if ((indexOne != -1 && indexTwo != -1) || indexThree != -1) {
            return res.redirect('back');
        }


        toUser.recievedRequests.push(fromUser);
        fromUser.sentRequests.push(toUser);

        toUser.save();
        fromUser.save();

        console.log(toUser);
        console.log(fromUser);
        return res.redirect('back');
    } catch {
        console.log('Error in sendFriendRequest controller!');
    }
}

module.exports.acceptFriendRequest = async function (req, res) {
    try {
        let acceptingUser = await User.findById(req.user._id);
        let sendingUser = await User.findById(req.params.id);

        let indexOne = acceptingUser.recievedRequests.indexOf(sendingUser._id);
        let indexTwo = sendingUser.sentRequests.indexOf(acceptingUser._id);
        let indexThree = sendingUser.friends.indexOf(acceptingUser._id);

        if (indexOne == -1 || indexTwo == -1 || indexThree != -1) {
            return res.redirect('back');
        }

        acceptingUser.friends.push(sendingUser);
        sendingUser.friends.push(acceptingUser);
        await Message.create({
            roomId: `${acceptingUser.email}${sendingUser.email}`,
            messages: []
        });
        acceptingUser.chatRooms.push({
            user: sendingUser._id,
            roomId: `${acceptingUser.email}${sendingUser.email}`
        });
        sendingUser.chatRooms.push({
            user: acceptingUser._id,
            roomId: `${acceptingUser.email}${sendingUser.email}`
        });

        acceptingUser.recievedRequests.splice(indexOne, 1);
        sendingUser.sentRequests.splice(indexTwo, 1);

        acceptingUser.save();
        sendingUser.save();

        return res.redirect('back');
    } catch {
        console.log('Error in acceptFriendRequest controller!');
    }
}

module.exports.rejectFriendRequest = async function (req, res) {
    try {
        let acceptingUser = await User.findById(req.user._id);
        let sendingUser = await User.findById(req.params.id);

        let indexOne = acceptingUser.recievedRequests.indexOf(sendingUser._id);
        let indexTwo = sendingUser.sentRequests.indexOf(acceptingUser._id);
        let indexThree = sendingUser.friends.indexOf(acceptingUser._id);

        if (indexOne == -1 || indexTwo == -1 || indexThree != -1) {
            return res.redirect('back');
        }

        acceptingUser.recievedRequests.splice(indexOne, 1);
        sendingUser.sentRequests.splice(indexTwo, 1);

        acceptingUser.save();
        sendingUser.save();

        return res.redirect('back');
    } catch {
        console.log('Error in acceptFriendRequest controller!');
    }
}




module.exports.unfriend = async function (req, res) {
    let userOne = await User.findById(req.user._id);
    let userTwo = await User.findById(req.params.id);

    let indexOne = userOne.friends.indexOf(userTwo._id);
    let indexTwo = userTwo.friends.indexOf(userOne._id);

    if (indexOne == -1 || indexTwo == -1) {
        return res.redirect('back');
    }

    userOne.friends.splice(indexOne, 1);
    userTwo.friends.splice(indexTwo, 1);
    let newArrayOne = [];
    let newArrayTwo = [];
    for (let room of userOne.chatRooms) {
        if (room.roomId != userOne.email + userTwo.email && room.roomId != userTwo.email + userOne.email) {
            newArrayOne.push(room);
        }
    }
    for (let room of userTwo.chatRooms) {
        if (room.roomId != userOne.email + userTwo.email && room.roomId != userTwo.email + userOne.email) {
            newArrayTwo.push(room);
        }
    }
    userOne.chatRooms = newArrayOne;
    userTwo.chatRooms = newArrayTwo;
    let message = await Message.findOneAndDelete({ roomId: userOne.email + userTwo.email });
    if (!message) {
        message = await Message.findOneAndDelete({ roomId: userTwo.email + userOne.email });
    }
    userOne.save();
    userTwo.save();
    return res.redirect('back');
}
