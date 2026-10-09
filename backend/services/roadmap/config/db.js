import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("ROADMAP DB CONNECTED")
  } catch (error) {
    console.log("ROADMAP DB ERROR", error)
  }
}