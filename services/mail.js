const {Transport, contactUsTemplate, jobTemplate} = require('../config/nodemailer')

class MailService {
    static sendContactusMail = async (param, next) => {
        try {
            Transport.sendMail(
                contactUsTemplate(param),
                (error) => {
                  if (error) {
                    throw {
                        code: 400,
                        name: "error sending mail",
                    };
                  } else {
                    console.log(`email sent to ${param.email}`);
                  }
                }
            );
        } catch (error) {
            next(error);
        }
    }

    static sendJobMail = async (param, next) => {
      try {
          Transport.sendMail(
              jobTemplate(param),
              (error) => {
                if (error) {
                  throw {
                      code: 400,
                      name: "error sending mail",
                  };
                } else {
                  console.log(`email sent to ${param.email}`);
                }
              }
          );
      } catch (error) {
          next(error);
      }
  }
}

module.exports = { MailService }