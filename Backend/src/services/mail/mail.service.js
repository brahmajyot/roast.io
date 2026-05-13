import nodemailer from "nodemailer";
import dns from "dns";

export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // 16-character App Password
      },
      // THIS FORCES IPV4 AND STOPS THE TIMEOUT
      dnsLookup: (hostname, options, callback) => {
        dns.lookup(hostname, { family: 4 }, callback);
      },
    });

    await transporter.sendMail({
      from: `"Roast.IO" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Nodemailer Error:", error.message);
    return false; // Prevents the server from crashing
  }
};