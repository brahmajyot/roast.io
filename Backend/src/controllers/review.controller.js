import Review from "../models/review.model.js";

// CREATE REVIEW
export const createReview = async (req, res) => {
  try {
    const { url, type, roastMode, tone } = req.body;

    // CREATE REVIEW
    const review = await Review.create({
      userId: req.user._id,
      url,
       type,
  roastMode,
  tone,
    });

    res.status(201).json({
      message: "Review created",
      review,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE REVIEW
export const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET USER REVIEWS
export const getReviewHistory = async (req, res) => {
  try {
    const reviews = await Review.find({
      userId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};