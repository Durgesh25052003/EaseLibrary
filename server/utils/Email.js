import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Email {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD // App Password, not regular password
      }
    });
  }

  async sendMailWelcome(toEmail, subject, name, email, password, loginlink) {
    const emailTemplate = fs.readFileSync(path.join(__dirname, 'emailTemplate.html'), 'utf-8')
     console.log(loginlink)
    const content = emailTemplate.replace(/{name}/g, name)
      .replace(/{email}/g, email)
      .replace(/{login_link}/g, `${loginlink}`)
      .replace(/{password}/g, password)

    try {
      const info = await this.transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: toEmail,
        subject: subject,
        html: content
      });
      console.log('Welcome email sent successfully:', info.messageId);
    } catch (error) {
      console.error('Email error:', error);
    }
  }

  async sendMailForgetPassword(toEmail, subject,userName, reset_link) {
    const emailTemplateResetPass = fs.readFileSync(path.join(__dirname, 'forgetPasswordTemp.html'), 'utf-8')
    
    const content = emailTemplateResetPass.replace(/{username}/g, userName)
      .replace(/{resetLink}/g, reset_link)

      console.log(reset_link,"reset_link");

    try {
      const info = await this.transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: toEmail,
        subject: subject,
        html: content
      });
      console.log('Reset password email sent successfully:', info.messageId);
    } catch (error) {
      console.error('Email error:', error);
    }
  }

  async sendMailBookBorrowed(toEmail, subject, name, bookTitle, author, borrowDate, dueDate) {
    const emailTemplateBorrow = fs.readFileSync(path.join(__dirname, 'emailTemplateBorrow.html'), 'utf-8')
    
    const content = emailTemplateBorrow
      .replace(/{name}/g, name)
      .replace(/{bookTitle}/g, bookTitle)
      .replace(/{author}/g, author)
      .replace(/{borrowDate}/g, borrowDate)
      .replace(/{dueDate}/g, dueDate);

    try {
      const info = await this.transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: toEmail,
        subject: subject,
        html: content
      });
      console.log('Book borrow notification email sent successfully:', info.messageId);
    } catch (error) {
      console.error('Email error:', error);
    }
  }
}


export default Email;
