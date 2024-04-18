"use strict"
const nodemailer = require('nodemailer');

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
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    }
});

Transport.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("SMTP ready to send messages");
    }
});

const contactUsTemplate = (param) => {
    return {
      from: process.env.MAIL_FROM_ADDRESS,
      to: process.env.MAIL_TO_ADDRESS_CONTACT_US,
      subject: `[CARBONXCO-WEB] ${param.subject}`,
      html: `<div lang="en" role="article" aria-roledescription="email" aria-label="Reset Password">
      <table
         style="font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI',            sans-serif; height: 100%; width: 100%;"
         role="presentation" cellspacing="0" cellpadding="0">
         <tbody>
            <tr>
               <td style="border-radius: 5px; padding-top: 24px; padding-bottom: 24px; vertical-align: middle; background-color: #ffffff;"
                  align="center" valign="middle">
                  <table class="sm-w-full" style="width: 900px;" role="presentation" cellspacing="0" cellpadding="0">
                     <tbody>
                        <tr>
                           <td class="sm-px-24">
                              <table class="sm-w-full" style="width: 75%;" role="presentation" cellspacing="0"
                                 cellpadding="0" align="center">
                                 <tbody>
                                    <tr>
                                       <td style="padding-left: 48px; text-align: center;"><img style="width: 128px;"
                                             src="https://carbonxco.s3.ap-southeast-1.amazonaws.com/Screenshot+2024-03-27+at+12.24.55.png"
                                             alt="" /> <br /><br /></td>
                                    </tr>
                                    <tr>
                                       <td class="sm-px-24" style="background-color: #ffffff; padding: 48px;">
                                          <p
                                             style="font-weight: 600; font-size: 18px; color: #374151; margin: 0; text-align: center; text-decoration: none;">
                                             This email is coming from Contact Us form from carbonxco website.
                                          <p style="font-size: 16px; line-height: 2; color: #374151; text-align: center;">
                                             Data Preview:
                                          </p>
                                          <br />
                                          <p
                                             style="font-size: 16px; color: #374151; margin: 0; text-align: justify;">
                                             Email:  ${param.email}<br />
                                             Name:  ${param.name}<br />
                                             Phone:  ${param.phone}<br />
                                             Subject:  ${param.subject}<br />
                                             <br /> ${param.body}<br />
                                          </p>
                                          <br />
                                          <p style="font-size: 16px; line-height: 2; color: #374151; text-align: center;">
                                             You can preview all data on cms Carbonxco</p>
                                          <p style="color: #374151;">
                                             <strong>Best Regards,</strong> <br />Carbonxco
                                          </p>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td style="background-color: #ffffff; height: 2px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                       <td style="font-size: 12px; padding: 32px; text-align: center; color: #000000;">
                                          <p style="margin: 0 0 4px; text-transform: italic;">Please do not reply to this
                                             email</p>
                                       </td>
                                    </tr>
                                 </tbody>
                              </table>
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </td>
            </tr>
         </tbody>
      </table>
   </div>`
    }
}

const jobTemplate = (param) => {
   return {
     from: process.env.MAIL_FROM_ADDRESS,
     to: process.env.MAIL_TO_ADDRESS_JOB,
     subject: `[CARBONXCO-WEB] Career Application`,
     html: `<div lang="en" role="article" aria-roledescription="email" aria-label="Reset Password">
     <table
        style="font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI',            sans-serif; height: 100%; width: 100%;"
        role="presentation" cellspacing="0" cellpadding="0">
        <tbody>
           <tr>
              <td style="border-radius: 5px; padding-top: 24px; padding-bottom: 24px; vertical-align: middle; background-color: #ffffff;"
                 align="center" valign="middle">
                 <table class="sm-w-full" style="width: 900px;" role="presentation" cellspacing="0" cellpadding="0">
                    <tbody>
                       <tr>
                          <td class="sm-px-24">
                             <table class="sm-w-full" style="width: 75%;" role="presentation" cellspacing="0"
                                cellpadding="0" align="center">
                                <tbody>
                                   <tr>
                                      <td style="padding-left: 48px; text-align: center;"><img style="width: 128px;"
                                            src="https://carbonxco.s3.ap-southeast-1.amazonaws.com/Screenshot+2024-03-27+at+12.24.55.png"
                                            alt="" /> <br /><br /></td>
                                   </tr>
                                   <tr>
                                      <td class="sm-px-24" style="background-color: #ffffff; padding: 48px;">
                                         <p
                                            style="font-weight: 600; font-size: 18px; color: #374151; margin: 0; text-align: center; text-decoration: none;">
                                            This email is coming from Job Opportunities form from carbonxco website.
                                         <p style="font-size: 16px; line-height: 2; color: #374151; text-align: center;">
                                            Data Preview:
                                         </p>
                                         <br />
                                         <p
                                            style="font-size: 16px; color: #374151; margin: 0; text-align: justify;">
                                            Email:  ${param.email}<br />
                                            Name:  ${param.name}<br />
                                            Phone:  ${param.phone}<br />
                                            Address:  ${param.address}<br />
                                            <br /> Job Descriptions <br />
                                            Title: ${param.title} <br />
                                            Type: ${param.type}<br />
                                            Location: ${param.location}</br>
                                            
                                         </p>
                                         <br />
                                         <p style="font-size: 16px; line-height: 2; color: #374151; text-align: center;">
                                            You can preview all data on cms Carbonxco</p>
                                         <p style="color: #374151;">
                                            <strong>Best Regards,</strong> <br />Carbonxco
                                         </p>
                                      </td>
                                   </tr>
                                   <tr>
                                      <td style="background-color: #ffffff; height: 2px;">&nbsp;</td>
                                   </tr>
                                   <tr>
                                      <td style="font-size: 12px; padding: 32px; text-align: center; color: #000000;">
                                         <p style="margin: 0 0 4px; text-transform: italic;">Please do not reply to this
                                            email</p>
                                      </td>
                                   </tr>
                                </tbody>
                             </table>
                          </td>
                       </tr>
                    </tbody>
                 </table>
              </td>
           </tr>
        </tbody>
     </table>
  </div>`
   }
}

export {
    Transport,
    contactUsTemplate,
    jobTemplate
}
