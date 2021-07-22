const nodeMailer = require('../config/nodemailer');

exports.newUser = (user) => {
    let htmlString = nodeMailer.renderTemplate({user: user}, '/new_user.ejs');
    nodeMailer.transporter.sendMail({
        from: 'connecti.spprt@gmail.com',
        to: user.email,
        subject: 'Welcome to Connecti!',
        html: htmlString
    }, (err, info) => {
        if(err){console.log('Error in sending mail', err); return;}
        console.log('Mail sent', info);
        return;
    })
}
