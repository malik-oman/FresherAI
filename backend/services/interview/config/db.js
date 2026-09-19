import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("INTERVIEW DB CONNECTED")
  } catch (error) {
    console.log("INTERVIEW DB ERROR", error)
  }
}