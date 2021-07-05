const nodeMailer = require('../config/nodemailer');

exports.newComment = (comment) => {
    nodeMailer.transporter.sendMail({
        from : 'connecti.spprt@gmail.com',
        to : comment.user.email,
        subject : 'Comment added!',
        html : '<h3>Your comment is now published</h3>'
    }, (err, info) => {
        if(err){console.log('Error in sending mail', err); return;}
        console.log('Comment created', info);
        return;
    });
}