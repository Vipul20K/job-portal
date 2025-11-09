// import express from "express";
// import dbConnection  from "./database/dbConnection.js";
// import jobRouter from "./routes/jobRoutes.js";
// import userRouter from "./routes/userRoutes.js";
// import applicationRouter from "./routes/applicationRoutes.js";
// import { config } from "dotenv";
// import cors from "cors";
// import { errorMiddleware } from "./middlewares/error.js";
// import cookieParser from "cookie-parser";
// import fileUpload from "express-fileupload";

// const app = express();
// config({ path: "./config/config.env" });

// app.use(
//   cors({
//     origin: [process.env.FRONTEND_URL],
//     method: ["GET", "POST", "DELETE", "PUT"],
//     credentials: true,
//   })
// );

// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp/",
//   })
// );
// app.use("/api/v1/user", userRouter);
// app.use("/api/v1/job", jobRouter);
// app.use("/api/v1/application", applicationRouter);
// dbConnection();

// app.use(errorMiddleware);
// export default app;
import express from "express";
import dbConnection from "./database/dbConnection.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import { config } from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

const app = express();

// Load environment variables from server/.env (more common in this repo)
config({ path: "./.env" });

// ✅ CORS setup: dynamic origin echoing so Access-Control-Allow-Origin is not '*'
const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:5174"].filter(Boolean);

app.use(
  cors({
    origin: function (incomingOrigin, callback) {
      // allow non-browser tools or same-origin requests
      if (!incomingOrigin) return callback(null, true);
      if (allowedOrigins.indexOf(incomingOrigin) !== -1) return callback(null, true);
      return callback(new Error("CORS policy: Origin not allowed"), false);
    },
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// explicit preflight handler
app.options("*", cors({ origin: allowedOrigins, credentials: true }));

// ✅ Core middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// ✅ Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

// ✅ Database connection
dbConnection();

// ✅ Global error handler
app.use(errorMiddleware);

export default app;
