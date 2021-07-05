class ChatEngine{
    constructor(chatBoxId, userName, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userName = userName;
        this.userEmail = userEmail;
        this.socket = io.connect('http://54.236.25.227:5000');
        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){
        let self = this;
        this.socket.on('connect', function(){
            console.log('Connection established using sockets!');
            self.socket.emit('join_room', {
                user_name : self.userName,
                user_email : self.userEmail,
                chatroom : 'connecti_public'
            });
            self.socket.on('user_joined', function(data){
                console.log('A user joined!', data);
                let joinMessage = $('<div>');
                joinMessage.append(`${data.user_name} joined the chat!`);
                joinMessage.addClass('global-message');
                $('#chat-message-list').append(joinMessage);
            });
        });

        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();
            console.log('Message - ',msg);
            if(msg!=''){
                $('#chat-message-input').val('');
                self.socket.emit('send_message', {
                    message: msg,
                    user_name: self.userName,
                    user_email: self.userEmail,
                    chatroom: 'connecti_public'
                });
            }
        });

        self.socket.on('recieve_message', function(data){
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
            $('#chat-message-list').append(newMessage);
        });
    }
}