const mongoose = require('mongoose');

const resetSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId, //refers to the users unique object id
        ref : 'User'
    },

    accessToken : {
        type : String
    },

    isValid : {
        type : Boolean,
    }
}, {
    timestamps : true
});

const PasswordToken = mongoose.model('PasswordToken', resetSchema);
module.exports = PasswordToken;