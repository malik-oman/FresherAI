import { resumeAgent } from "../agents/resume.agent.js";
import extractText from "../config/pdf.js";
import Resume from "./../models/resume.model.js";
import redis from "./../../../shared/redis/redis.js";
import fs from "fs";

export const uploadResume = async (req, res) => {
  let file;
  try {
    file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "Resume PDF is required" });
    }
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "user id is required" });
    }
    const resumeText = await extractText(file.path);
    const aiResponse = await resumeAgent(resumeText);

    const resumeData = JSON.parse(aiResponse);

    if (Array.isArray(resumeData.experience)) {
      resumeData.experience = resumeData.experience.map((job) => {
        if (typeof job === "string") return job;
        const resp = Array.isArray(job.responsibilities)
          ? job.responsibilities.join(" ")
          : job.responsibilities || "";
        const parts = [job.title, job.company].filter(Boolean).join(" at ");
        const meta = [job.location, job.dates].filter(Boolean).join(", ");
        return `${parts}${meta ? ` (${meta})` : ""}${resp ? `: ${resp}` : ""}`.trim();
      });
    }

    ["education", "projects"].forEach((field) => {
      if (Array.isArray(resumeData[field])) {
        resumeData[field] = resumeData[field].map((item) =>
          typeof item === "string" ? item : JSON.stringify(item),
        );
      }
    });

    let resume = await Resume.findOne({ userId });
    if (resume) {
      Object.assign(resume, {
        ...resumeData,
        extractedText: resumeText,
      });
      await resume.save();
    } else {
      resume = await Resume.create({
        userId,
        extractedText: resumeText,
        ...resumeData,
      });
    }

    await redis.set(`resume:${userId}`, JSON.stringify(resume));
    fs.unlinkSync(file.path);
    return res.status(200).json({
      success: true,
      message: "Resume Analyzed Successfully",
      data: resume,
    });
  } catch (error) {
    console.log(error);
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getResume = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    const cache = await redis.get(`resume:${userId}`);
    if (cache) {
      return res
        .status(200)
        .json({ success: true, source: "redis", data: JSON.parse(cache) });
    }
    const resume = await Resume.findOne({ userId });
    if (!resume) {
      return res
        .status(400)
        .json({ success: false, message: "resume not found" });
    }
    await redis.set(`resume:${userId}`, JSON.stringify(resume));
    return res
      .status(200)
      .json({ success: true, source: "mongoDB", data: resume });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
