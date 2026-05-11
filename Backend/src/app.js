import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";





import {
  globalLimiter,
} from "./middleware/rateLimit.middleware.js";

const app = express();

app.use(express.json());


app.use(
  cors({
   origin: [
  "http://localhost:3000",
  "https://roast-io-alpha.vercel.app/",
],

    credentials: true,
  })
);

app.use(helmet());

app.use(morgan("dev"));

app.use(cookieParser());

// SANITIZE MONGO INPUT




app.use(globalLimiter);





//importing the exsiting routes

import authRoutes from "./routes/auth.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import testRoutes from "./routes/test.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";

app.use("/api/auth", authRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/test", testRoutes);

app.use(
  "/api/feedback",
  feedbackRoutes
);





export default app;