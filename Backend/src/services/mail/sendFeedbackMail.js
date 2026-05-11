import nodemailer from "nodemailer";

const transporter =
  nodemailer.createTransport({
    service: "gmail",

    auth: {
      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,
    },
  });

export const sendFeedbackMail =
  async ({
    name,
    message,
  }) => {
    try {
      console.log(
        "MAIL FUNCTION CALLED"
      );

      const info =
        await transporter.sendMail({
          from:
            process.env.EMAIL_USER,

          to:
            process.env.ADMIN_EMAIL,

          subject:
            "New Roast.IO Feedback",

          html: `
            <div
              style="
                font-family: Arial, sans-serif;
                background: #0a0a0a;
                color: white;
                padding: 30px;
                border-radius: 12px;
              "
            >
              <h2
                style="
                  color: #ff6b00;
                  margin-bottom: 20px;
                "
              >
                🔥 New Feedback Received
              </h2>

              <p
                style="
                  margin-bottom: 10px;
                "
              >
                <strong>
                  Name:
                </strong>
                ${
                  name ||
                  "Anonymous"
                }
              </p>

              <p
                style="
                  margin-bottom: 10px;
                "
              >
                <strong>
                  Message:
                </strong>
              </p>

              <div
                style="
                  background: #111;
                  border: 1px solid #333;
                  padding: 20px;
                  border-radius: 8px;
                  line-height: 1.7;
                  color: #ddd;
                "
              >
                ${message}
              </div>

              <p
                style="
                  margin-top: 25px;
                  color: #888;
                  font-size: 13px;
                "
              >
                Roast.IO Feedback
                System
              </p>
            </div>
          `,
        });

      console.log(
        "MAIL SENT:",
        info.response
      );
    } catch (error) {
      console.log(
        "MAIL ERROR:",
        error
      );
    }
  };