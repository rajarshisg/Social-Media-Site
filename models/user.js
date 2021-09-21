const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    }, 
    
    password : {
        type : String,
        required : true
    },

    name : {
        type : String,
        required : true
    },

    avatar : {
        type : String
    },

    about : {
        type : String
    },

    posts : [
        {
            type : mongoose.Schema.Types.ObjectId, //refers to the post schema
            ref : 'Post'
        }
    ],
    
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId, //refers to the user schema
            ref: 'User'
        }
    ],

    sentRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    recievedRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    chatRooms: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },

            roomId: {
                type: String,
                required: true
            }
        }
    ]
    
}, {
    timestapms : true
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
});

//static methods
userSchema.statics.uploadedAvatar = multer({storage : storage}).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model('User', userSchema);
module.exports = User;