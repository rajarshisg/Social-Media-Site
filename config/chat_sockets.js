module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer);
    io.on('connection', function(socket){
        console.log('New connection recieved - ', socket.id);
        socket.on('disconnect', function(){
            console.log('Socket disconnected!');
        });
        socket.on('join_room', function(data){
            console.log('joining request recieved', data);
            socket.join(data.chatroom);
            io.in(data.chatroom).emit('user_joined', data);
        });
        socket.on('send_message', function(data){
            io.in(data.chatroom).emit('recieve_message', data);
        });
    });

}