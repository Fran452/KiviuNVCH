/*
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const tranporter = nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:465,
    securete:true,
    service: 'gmail',
    auth: {
        user: 'cai.lema.francisco@gmail.com',
        pass: 'P1p2l3t00'
    }
    
})

async function enviarMail(){
    console.log(process.env);
    tranporter.sendMail({
        from:"cai.lema.francisco@gmail.com",
        to:"cawice7274@furnato.com",
        subject:"Prueba envio de mail",
        text:"esto es una prueba de envio de mails"
    })
}
*/

const nodemailer = require('nodemailer');

async function enviarMail(){
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'fflemaestevez@gmail.com',
        pass: 'wskx azmx rvoc fobl'
    }
});

let mailOptions = {
    from: 'fflemaestevez@gmail.com',
    to: 'franciscolemacr@gmail.com',
    subject: 'Prueba de correo desde Nodemailer',
    text: 'Hola, este es un correo de prueba.'
};

transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Correo enviado: ' + info.response);
    }
});
}
module.exports = {enviarMail}