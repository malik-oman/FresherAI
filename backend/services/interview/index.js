import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import interviewRouter from "./routes/interview.route.js";

// ============================================================
const app = express();
app.use(express.json());

const port = process.env.PORT;
// ==========================
app.use("/", interviewRouter);

// ============================================================
app.listen(port, () => {
  connectDB();
  console.log("Interview  Server runing on port", port);
});
