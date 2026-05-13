import nodemailer from "nodemailer";
import dns from "dns/promises";

const resolveSmtpHost = async () => {
  const addresses = await dns.resolve4("smtp.gmail.com");

  if (!addresses.length) {
    throw new Error("Could not resolve smtp.gmail.com IPv4 address");
  }

  return addresses[0];
};

const createTransporter = async () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER and EMAIL_PASS must be set");
  }

  const smtpHost = await resolveSmtpHost();

  return nodemailer.createTransport({
    host: smtpHost,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      servername: "smtp.gmail.com",
    },
    connectionTimeout: 10000,
  });
};

let transporter;

const getTransporter = async () => {
  if (!transporter) {
    transporter = await createTransporter();
  }

  return transporter;
};

export const sendEmail = async (to, subject, html) => {
  try {
    const mailTransporter = await getTransporter();

    const info = await mailTransporter.sendMail({
      from: `"Roast.IO" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("Nodemailer Error:", error.message);
    throw new Error(
      `Failed to send email: ${error.message}`
    );
  }
};
