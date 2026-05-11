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


const allowedOrigins = [
  'http://localhost:3000', 
  'https://roast-io-alpha.vercel.app' 
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// 2. Apply CORS middleware
app.use(cors(corsOptions));

// 3. Explicitly handle Preflight requests for all routes
app.options('*', cors(corsOptions));

app.use(helmet());

app.use(morgan("dev"));

app.use(cookieParser());

// SANITIZE MONGO INPUT




app.use(globalLimiter);

// health check

app.get('/', (req, res) => {
  res.send('Roast.IO Backend is running successfully!');
});


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