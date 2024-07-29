const nodemailer = require('nodemailer')

function sendEmail (user, pass) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: pass,
        },
    })
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'gagenotar@gmail.com',
        subject: 'Test email',
        test: 'This is a test for email functionality.',
    }
    
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email: ', error.message);
                return reject(error);
            } else {
                console.log('Email sent successfully: ', info.response);
                return resolve(info.response);
            }
        })
    })
}

module.exports = { sendEmail }