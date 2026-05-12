import nodemailer from "nodemailer";
import dns from "dns";

export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // THIS IS THE FIX: Forces IPv4 which avoids Render's timeout
      dnsLookup: (hostname, options, callback) => {
        dns.lookup(hostname, { family: 4 }, callback);
      },
      connectionTimeout: 10000, // 10 seconds
    });

    await transporter.sendMail({
      from: `"Roast.IO" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Nodemailer Error Details:", error.message);
    // Don't let a mail error crash your whole server
    return false; 
  }
};