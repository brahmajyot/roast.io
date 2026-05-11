import Feedback from "../models/feedback.model.js";

import { sendFeedbackMail } from "../services/mail/sendFeedbackMail.js";

// CREATE FEEDBACK
export const createFeedback =
  async (req, res) => {
    try {
      const {
        name,
        message,
      } = req.body;

      // SAVE TO DB
      const feedback =
        await Feedback.create({
          name,
          message,
        });

      // SEND EMAIL
      await sendFeedbackMail({
        name,
        message,
      });

      res.status(201).json({
        message:
          "Feedback submitted",

        feedback,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// GET FEEDBACKS
export const getFeedbacks =
  async (req, res) => {
    try {
      const feedbacks =
        await Feedback.find()
          .sort({
            createdAt: -1,
          })
          .limit(20);

      res.status(200).json(
        feedbacks
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };