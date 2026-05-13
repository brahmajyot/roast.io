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


// 1. CORS CONFIGURATION
const allowedOrigins = [
  'http://localhost:3000',               // Local development
  'https://roast-io-alpha.vercel.app'    // Your live Vercel frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// 2. MIDDLEWARE STACK
// Apply CORS first so it can handle preflight requests automatically
app.use(cors(corsOptions));

// This replaces the app.options('*') line that caused the crash
app.options(/(.*)/, cors(corsOptions));




app.set('trust proxy', 1);

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