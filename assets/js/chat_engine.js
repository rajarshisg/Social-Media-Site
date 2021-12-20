class ChatEngine{
    constructor(chatBoxId, userName, userEmail, roomId){
        this.chatBox = document.getElementById(chatBoxId);
        this.userName = userName;
        this.userEmail = userEmail;
        this.roomId = roomId;
        this.socket = io.connect('http://52.90.86.178:5000'); //io.connect('http://localhost:5000')
    }

    connectionHandler(){
        let self = this;
        this.socket.on('connect', function(){
            console.log('Connection established using sockets!');
            self.socket.emit('join_room', {
                user_name : self.userName,
                user_email : self.userEmail,
                chatroom : self.roomId,
            });
            self.socket.on('user_joined', function(data){
                console.log('A user joined!', data);
                let joinMessage = $('<div>');
                joinMessage.append(`${data.data.user_name} joined the chat!`);
                
                for(let message of data.messages) {
                    let newMessage = $('<li>');
                    let messageType = 'other-message';
                    if(message.userName == self.userName){
                        messageType = 'self-message'
                    }
                    newMessage.append($('<span>', {
                        html : message.content
                    }));
                    newMessage.append($('<br/>'));
                    newMessage.append($('<sub>', {
                        html : data.user_name
                    }));
                    newMessage.addClass(messageType);
                    $('.chat-message-list').append(newMessage);
                }
                joinMessage.addClass('global-message');
                $('#chat-message-list').append(joinMessage);
            });
        });

        $('.chat-box-header').click(function() {
            console.log('Leaving room', self.roomId);
            self.socket.emit('leave-room', {
                chatroom: self.roomId
            });
        })

        $('.send-message').click(function(){
            let msg = $('.chat-message-input').val();
            console.log('Sending message to room', self.roomId);
            if(msg!=''){
                $('.chat-message-input').val('');
                self.socket.emit('send_message', {
                    message: msg,
                    user_name: self.userName,
                    user_email: self.userEmail,
                    chatroom: self.roomId
                });
            }
        });

        self.socket.on('recieve_message', function(data){
            console.log('Message recieved');
            let newMessage = $('<li>');
            let messageType = 'other-message';
            if(data.user_email == self.userEmail){
                messageType = 'self-message'
            }
            newMessage.append($('<span>', {
                html : data.message
            }));
            newMessage.append($('<br/>'));
            newMessage.append($('<sub>', {
                html : data.user_name
            }));
            newMessage.addClass(messageType);
            $('.chat-message-list').append(newMessage);
        });
    }
}