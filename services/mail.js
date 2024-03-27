const {Mailer} = require('../config/nodemailer')

class MailService {
    static sendContactusMail = async (param, next) => {
        try {
            await Mailer.send({
                template: 'contactus',
                message: {
                    to: param.email
                },
                locals: {
                    link: process.env.APP_URL,
                    emai: param.name
                }
            })
        } catch (error) {
            next(error);
        }
    }
}

module.exports = { MailService }