const mail = require("nodemailer");
const {sendMail, mailPassword, mailServer} = require("./config")

const transporter = mail.createTransport({
    host: "mail.server.com", //put your mail server name mail.domainname.com for cpanel
    port: 465,
    secure: true,
    auth: {
      user: "admin@orbaic.com", //email of your
      pass: "1234568", // add password here
    },
    from: "admin@orbaic.com"
  });

  async function emailSender(email, data, subject){
    const info = await transporter.sendMail({
        from: "admin@orbaic.com", // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: data, // plain text body
        //html: "<b>Hello world?</b>", // html body
      });

      console.log(info.response);
  }

  module.exports = {emailSender}