import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("AUTH DB CONNECTED")
  } catch (error) {
    console.log("AUTH DB ERROR", error)
  }
}