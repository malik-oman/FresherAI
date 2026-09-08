import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    firebaseUid:{
      type:String,
      required:true,
      unique:true,
    },
    name:{
      type:String,
      required:true,
    },
    email:{
      type:String,
      require:true,
      unique:true,
    },
    interviewCoin:{
       type:String,
       default:150, 
    },
  
},{timestamps:true})

const User = mongoose.model("User", userSchema)
export default User