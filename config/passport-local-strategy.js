const passport = require('passport'); //requiring passport
const LocalStrategy = require('passport-local').Strategy; //passport local strategy is used
const User = require('../models/user'); //user schema is needed to authenticate the user

//authentication using passport local
passport.use(new LocalStrategy({
        usernameField : 'email', //the unique key which is used to authenticate in our case it is email
        passReqToCallback : true
    }, function(req, email, password, done){
        //find a user and establish the identity
        User.findOne({email : email}, function(err, user){
            if(err){
                req.flash('error', err);
                return done(err);
            }

            if(!user || user.password!=password){
                req.flash('error', 'Invalid Username/Password');
                return done(null, false); //authentication not done --> user not found
            }

            return done(null, user); //authentication done --> user found
        });
    }
));

//serializing the user to decide which key is to be kept in the cookie
passport.serializeUser(function(user, done){
    done(null, user.id); //encrypts the user id in the session cookie
});

//desirializing the user from key in cookie
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding the user -> Passport');
            return done(err);
        }
        return done(null, user);
    });
});

//check if the user is authenticated 
passport.checkAuthentication = function(req, res, next){
    //if the user is signed in then pass on the request to the next function
    if(req.isAuthenticated()){
        return next();
    }

    //if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        //req.user contains the current user from the signed in cookie and we are just sending it to the locals for the views
        res.locals.user = req.user;
    }
    next();
}
module.exports = passport;