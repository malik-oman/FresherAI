import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'

dotenv.config()

// ============================================================
const app = express()
app.use(express.json())


const port = process.env.PORT
// ==========================




// ============================================================
app.listen(port,()=>{
connectDB()
  console.log("RESUME Server runing on port",port)
})