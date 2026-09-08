import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
    },
    extractedText: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    education: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    projects: {
      type: [String],
      default: [],
    },
    experience: {
      type: [String],
      default: [],
    },
    strength: {
      type: [String],
      default: [],
    },
    weakness: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    suggestedRole: {
      type: String,
      default: "",
    },
    recommendation: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume
