import nodemailer from "nodemailer";
import dns from "dns"; // Required for the IPv4 fix

export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // FIX: Force IPv4 to avoid Render's ENETUNREACH error
      dnsLookup: (hostname, options, callback) => {
        dns.lookup(hostname, { family: 4 }, callback);
      },
      // Increase timeouts so the server doesn't hang forever
      connectionTimeout: 10000, 
      greetingTimeout: 10000,
      socketTimeout: 10000,
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
    // We throw the error so the controller knows it failed, 
    // but the controller should handle it gracefully.
    throw new Error("Email sending failed");
  }
};