import nodemailer from "nodemailer";
import dns from "dns";

// Create the transporter once
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // CRITICAL FIX: Force IPv4 for Render networking
  dnsLookup: (hostname, options, callback) => {
    dns.lookup(hostname, { family: 4 }, callback);
  },
  connectionTimeout: 10000, // 10 seconds
});

export const sendFeedbackMail = async ({ name, message }) => {
  try {
    console.log("MAIL FUNCTION CALLED");

    const info = await transporter.sendMail({
      from: `"Roast.IO Feedback" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "🔥 New Roast.IO Feedback",
      html: `
        <div style="font-family: Arial, sans-serif; background: #0a0a0a; color: white; padding: 30px; border-radius: 12px;">
          <h2 style="color: #ff6b00; margin-bottom: 20px;">🔥 New Feedback Received</h2>
          <p style="margin-bottom: 10px;"><strong>Name:</strong> ${name || "Anonymous"}</p>
          <p style="margin-bottom: 10px;"><strong>Message:</strong></p>
          <div style="background: #111; border: 1px solid #333; padding: 20px; border-radius: 8px; line-height: 1.7; color: #ddd;">
            ${message}
          </div>
          <p style="margin-top: 25px; color: #888; font-size: 13px;">Roast.IO Feedback System</p>
        </div>
      `,
    });

    console.log("MAIL SENT:", info.response);
    return info;
  } catch (error) {
    console.error("MAIL ERROR:", error.message);
    // Don't re-throw if you want the API to finish even if mail fails
  }
};