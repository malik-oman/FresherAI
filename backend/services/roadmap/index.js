import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import roadmapRouter from "./routes/roadmap.route.js";


// ============================================================
const app = express();
app.use(express.json());

const port = process.env.PORT;
// ==========================
app.use("/", roadmapRouter)

// ============================================================
app.listen(port, () => {
 connectDB()
  console.log("Roadmap  Server runing on port", port);
});
