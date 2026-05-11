import rateLimit from "express-rate-limit";

// GLOBAL LIMITER
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 MIN

  max: 100,

  message: {
    message:
      "Too many requests. Please try again later.",
  },

  standardHeaders: true,

  legacyHeaders: false,
});

// AUTH LIMITER
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 10,

  message: {
    message:
      "Too many auth attempts. Try again later.",
  },

  standardHeaders: true,

  legacyHeaders: false,
});

// AI ANALYZE LIMITER
export const analyzeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 HOUR

  max: 20,

  message: {
    message:
      "AI analysis limit reached. Try again later.",
  },

  standardHeaders: true,

  legacyHeaders: false,
});