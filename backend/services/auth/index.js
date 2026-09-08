import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import authRouter from './routes/auth.route.js'
import cookieParser from 'cookie-parser'
dotenv.config()

// ============================================================
const app = express()
app.use(express.json())
app.use(cookieParser())

const port = process.env.PORT
// ==========================
app.use("/",authRouter)



// ============================================================
app.listen(port,()=>{
  connectDB()
  console.log("AUTH Server runing on port",port)
})