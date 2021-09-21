const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    roomId: {
        type: String,
        required: true
    },

    messages: [
        {
            content: {
                type: String,
                required: true
            },

            userName: {
                type: String,
                required: true
            }
        }
    ]
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;