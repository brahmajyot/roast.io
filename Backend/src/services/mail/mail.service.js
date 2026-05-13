import axios from "axios";

const BREVO_EMAIL_URL = "https://api.brevo.com/v3/smtp/email";

export const sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY must be set");
    }

    const senderEmail =
      process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER;

    if (!senderEmail) {
      throw new Error(
        "BREVO_SENDER_EMAIL or EMAIL_USER must be set"
      );
    }

    const response = await axios.post(
      BREVO_EMAIL_URL,
      {
        sender: {
          email: senderEmail,
          name: process.env.BREVO_SENDER_NAME || "Roast.IO",
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 30000,
      }
    );

    console.log(
      "Email sent successfully:",
      response.data?.messageId || response.status
    );

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.code ||
      error.message;

    console.error("Brevo Email Error:", message);

    throw new Error(`Failed to send email: ${message}`);
  }
};
