"use strict"
const nodemailer = require('nodemailer');

const Email = require('email-templates');

if (process.env.ENVIRONMENT != 'production') {
    require('dotenv').config();
}

let sendMail = { send: true };

if (process.env.NODE_ENV === 'test') { 
    sendMail = {};
}

const Transport = nodemailer.createTransport({
    pool: true,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_ENCRYPTION, // use TLS
    auth: {
      user: process.env.ACCESS_KEY,
      pass: process.env.SECRET_ACCESS_KEY
    }
});

Transport.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
});

const Mailer = new Email({
    message: {
        from: {
            name: process.env.MAIL_FROM_NAME,
            address: process.env.MAIL_FROM_ADDRESS
        }
    },
    ...sendMail,
    transport: Transport,
    views: {
        options: {
            extension: 'ejs'
        }
    }
});

export {
    Transport,
    Mailer
}
