const mail = require("nodemailer");
const {sendMail, mailPassword, mailServer} = require("./config")

const transporter = mail.createTransport({
    host: "mail.team71.xyz", //put your mail server name mail.domainname.com for cpanel
    port: 465,
    secure: true,
    auth: {
      user: "noreply@team71.xyz", //email of your
      pass: "528236", // add password here
    },
    from: "noreply@team71.xyz"
  });

  async function emailSender(email, data, subject){
    const info = await transporter.sendMail({
        from: "noreply@team71.xyz", // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: data, // plain text body
        //html: "<b>Hello world?</b>", // html body
      });

      console.log(info.response);
  }

  module.exports = {emailSender}