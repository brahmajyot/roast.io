import jwt from "jsonwebtoken";

// ACCESS TOKEN
export const generateAccessToken = (
  id
) => {
  return jwt.sign(
    { id },

    process.env.JWT_SECRET,

    {
      expiresIn: "15m",
    }
  );
};

// REFRESH TOKEN
export const generateRefreshToken = (
  id
) => {
  return jwt.sign(
    { id },

    process.env.JWT_SECRET,

    {
      expiresIn: "7d",
    }
  );
};