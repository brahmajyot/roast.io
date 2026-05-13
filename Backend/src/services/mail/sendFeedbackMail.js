import { sendEmail } from "./mail.service.js";

export const sendFeedbackMail = async ({ name, message }) => {
  try {
    if (!process.env.ADMIN_EMAIL) {
      throw new Error("ADMIN_EMAIL must be set");
    }

    console.log("MAIL FUNCTION CALLED");

    const info = await sendEmail(
      process.env.ADMIN_EMAIL,
      "New Roast.IO Feedback",
      `
        <div style="font-family: Arial, sans-serif; background: #0a0a0a; color: white; padding: 30px; border-radius: 12px;">
          <h2 style="color: #ff6b00; margin-bottom: 20px;">New Feedback Received</h2>
          <p style="margin-bottom: 10px;"><strong>Name:</strong> ${name || "Anonymous"}</p>
          <p style="margin-bottom: 10px;"><strong>Message:</strong></p>
          <div style="background: #111; border: 1px solid #333; padding: 20px; border-radius: 8px; line-height: 1.7; color: #ddd;">
            ${message}
          </div>
          <p style="margin-top: 25px; color: #888; font-size: 13px;">Roast.IO Feedback System</p>
        </div>
      `
    );

    console.log("MAIL SENT:", info?.messageId || "sent");
    return info;
  } catch (error) {
    console.error("MAIL ERROR:", error.message);
  }
};
