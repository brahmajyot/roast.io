import jwt from "jsonwebtoken";

import User from "../models/user.model.js";



const protect = async (
  req,
  res,
  next
) => {
  try {
    let token;

    // CHECK TOKEN
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith(
        "Bearer"
      )
    ) {
      token =
        req.headers.authorization.split(
          " "
        )[1];
    }

    console.log(
      "TOKEN:",
      token
    );

    // NO TOKEN
    if (!token) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    // VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log(
      "DECODED:",
      decoded
    );

    // FIND USER
    const user = await User.findById(
      decoded.id
    ).select("-password");

    console.log(
      "USER:",
      user
    );

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(
      "AUTH ERROR:",
      error
    );

    res.status(401).json({
      message: "Invalid token",
    });
  }
};

export default protect;