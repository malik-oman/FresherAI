import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import proxy from 'express-http-proxy'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { isAuth } from './middleware/isAuth.js'
import { getCurrentUser } from './controller/user.controller.js'
import { proxyWithHeaders } from './utils/proxyWithHeaders.js'
// ==================================================================

const app = express()
const port = process.env.PORT
app.use(express.json())
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
app.use(morgan("dev"))
app.use(cookieParser())

// ==================================================================
app.use("/api/auth", proxy(process.env.AUTH_SERVICE_URL))
app.use("/api/resume", isAuth, proxyWithHeaders(process.env.RESUME_SERVICE_URL))
app.use("/api/interview", isAuth, proxyWithHeaders(process.env.INTERVIEW_SERVICE_URL))
app.get("/api/me", isAuth,getCurrentUser)

// =============================================================
app.listen(port,()=>{
  console.log("GATEWAY Server runing on port",port)
})