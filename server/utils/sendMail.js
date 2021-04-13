import nodemailer from 'nodemailer';

import dotenv from 'dotenv';

dotenv.config();

export default async function(email, token){

    let transporter = nodemailer.createTransport({
        service: process.env.NODE_MAILER_SERVICE,
        auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASSWORD,
        },
    });

    let result = await transporter.sendMail({
    from: '"Project-manager"',
    to: email,
    subject: 'Подтверждение почтового ящика для регистрации на сайте Project-manager',
    text: 'This message was sent from Project-manager.',
    html:
        `Перейдите по <a href='${process.env.REG_TOKEN_URL}/${token}'>этой</a> ссылке, для завершения регистрации.`,
    });

    console.log(result);
};