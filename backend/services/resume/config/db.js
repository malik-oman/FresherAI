import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("RESUME DB CONNECTED")
  } catch (error) {
    console.log("RESUME DB ERROR", error)
  }
}