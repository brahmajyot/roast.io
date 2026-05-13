import nodemailer from "nodemailer";
import dns from "dns";

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER and EMAIL_PASS must be set");
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    dnsLookup: (hostname, options, callback) => {
      dns.lookup(hostname, { family: 4 }, callback);
    },
    connectionTimeout: 10000,
  });
};

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = createTransporter();
  }

  return transporter;
};

export const sendEmail = async (to, subject, html) => {
  try {
    const info = await getTransporter().sendMail({
      from: `"Roast.IO" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("Nodemailer Error:", error.message);
    throw new Error("Failed to send email");
  }
};
