import nodemailer from 'nodemailer';
import envConfig from './getEnvConfig';

export const transporter = nodemailer.createTransport({
    port: envConfig.SMTP_PORT,
    host: envConfig.HOST,
    secure: Boolean(envConfig.SMTP_SECURE), // true for 465, false for other ports
    auth: {
        user: envConfig.SMTP_USER, // generated ethereal user
        pass: envConfig.SMTP_PASSWORD, // generated ethereal password
    }
});

export const sendMail = async (toMail:string,subject:string,body:string)=>{
    try {
        await transporter.sendMail({
            from: envConfig.EMAIL_FROM,
            to: toMail,
            subject: subject,
            text: body
        });
    } catch (error) {
        throw new Error(`Failed to send email: ${error}`);
    }
};