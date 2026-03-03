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

  async sendMailBookBorrowed(toEmail, subject, name, bookTitle, author, borrowDate, borrowCode, dueDate) {
    const emailTemplateBorrow = fs.readFileSync(path.join(__dirname, 'emailTemplateBorrow.html'), 'utf-8')
    
    const content = emailTemplateBorrow
      .replace(/{name}/g, name)
      .replace(/{bookTitle}/g, bookTitle)
      .replace(/{author}/g, author)
      .replace(/{borrowDate}/g, borrowDate)
      .replace(/{dueDate}/g, dueDate)
      .replace(/{borrowCode}/g, borrowCode.toString())

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

  async sendDailyRemainderEmail(toEmail,subject,book,user){
    const emailTemplateDailyRemainder=fs.readFileSync(path.join(__dirname,'emailTemplateDailyRemainder.html'),'utf-8')
    const content = emailTemplateDailyRemainder
    .replace(/{name}/g,user.name)
    .replace(/{bookTitle}/g,book.title)
    .replace(/{author}/g,book.author)
    .replace(/{borrowDate}/g,book.borrowDate)
    .replace(/{dueDate}/g,book.returnDate)

    try {
      const info = await this.transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: toEmail,
        subject: subject, 
        html: content
      })  
    }catch (error) {
      console.error('Email error:', error);
    }
  }

  async sendReturnRequestNotification(toEmail, subject, payload) {
    const { userName, userEmail, bookTitle, author, borrowCode, note } = payload;
    const content = `
      <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.6;color:#2c3e50">
        <h2 style="color:#2ecc71">New Return Request</h2>
        <p><strong>User:</strong> ${userName} (${userEmail})</p>
        <p><strong>Book:</strong> ${bookTitle} by ${author}</p>
        ${borrowCode ? `<p><strong>Borrow Code:</strong> ${borrowCode}</p>` : ""}
        ${note ? `<p><strong>Note:</strong> ${note}</p>` : ""}
        <p>Please review this request in the admin panel.</p>
      </div>
    `;
    try {
      await this.transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: toEmail,
        subject,
        html: content,
      });
    } catch (error) {
      console.error("Email error (sendReturnRequestNotification):", error);
    }
  }

  async sendReturnStatusUpdate(toEmail, subject, payload) {
    const { name, bookTitle, author, status, note } = payload;
    const color =
      status === "approved" ? "#2ecc71" : status === "rejected" ? "#e74c3c" : "#f39c12";
    const content = `
      <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.6;color:#2c3e50">
        <h2 style="color:${color}">Return ${status.charAt(0).toUpperCase() + status.slice(1)}</h2>
        <p>Hi ${name},</p>
        <p>Your return ${status} for <strong>${bookTitle}</strong> by ${author}.</p>
        ${note ? `<p><strong>Note:</strong> ${note}</p>` : ""}
        <p>Thank you for using our library.</p>
      </div>
    `;
    try {
      await this.transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: toEmail,
        subject,
        html: content,
      });
    } catch (error) {
      console.error("Email error (sendReturnStatusUpdate):", error);
    }
  }
}

export default Email;
