const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

//defining the mail sending protocol
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    //sender mail id and pass
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD
    }
});

//defining the mail template
let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath), //path where mail template is present
        data,
        function (err, template) {
            if (err) { console.log('Error in rendering the template'); return; }
            mailHTML = template;

        }
    )
    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}