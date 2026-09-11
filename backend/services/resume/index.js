import 'dotenv/config'
import express from 'express'
import { connectDB } from './config/db.js'
import resumeRouter from './routes/resume.route.js'



// ============================================================
const app = express()
app.use(express.json())


const port = process.env.PORT
// ==========================

app.use("/", resumeRouter)


// ============================================================
app.listen(port,()=>{
connectDB()
  console.log("RESUME Server runing on port",port)
})