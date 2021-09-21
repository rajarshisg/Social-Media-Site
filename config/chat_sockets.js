const Message = require('../models/message');

module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer);
    
    io.on('connection', function(socket){
        console.log('New connection recieved - ', socket.id);
        socket.on('disconnect', function(){
            console.log('Socket disconnected!');
        });
        socket.on('join_room', async function(data){
            let message = await Message.findOne({ roomId: data.chatroom });
            let messageList = message.messages;
            console.log('joining request recieved', data);
            socket.join(data.chatroom);
            console.log(message);
            io.in(data.chatroom).emit('user_joined', {
                data: data,
                messages: messageList
            });
        });
        socket.on('send_message', async function(data) {
            let message = await Message.findOne({ roomId: data.chatroom });
            console.log("SENDING MESSAGE");
            let messageList = message.messages;
            messageList.push({
                content: data.message,
                userName: data.user_name,
                userEmail: data.user_email 
            })
            message.save();
            io.in(data.chatroom).emit('recieve_message', data);
        });
       socket.on('leave-room', function(data) {
           socket.leave(data.chatroom);
           socket.removeAllListeners('send_message');
           socket.removeAllListeners('join_room');
           socket.removeAllListeners('user_joined');
           socket.removeAllListeners('recieve_message');
       });
    });
}