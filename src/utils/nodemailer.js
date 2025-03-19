
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
  port: 465,
  secure: true,
    service: "gmail",  
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,  
    },
  });