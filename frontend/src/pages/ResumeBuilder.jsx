import React, { useState } from "react";
import ResumeForm from "../components/resume/ResumeForm";
import initialData from "../components/resume/initialData";
import { motion } from "motion/react";
import { FiArrowLeft, FiArrowRight, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PreviewResume from "../components/resume/PreviewResume";

const STEPS = [
  {
    step: 1,
    title: "Personal Information",
    subtitle: "Your Basic Contact Details",
  },
  {
    step: 2,
    title: "Professional Summary",
    subtitle: "A Brief Overview Of Your Profile",
  },
  { step: 3, title: "Skills", subtitle: "Technologies And Tools You Know" },
  { step: 4, title: "Experience", subtitle: "Your Work History" },
  { step: 5, title: "Projects", subtitle: "Showcase Your Best Work" },
  { step: 6, title: "Education", subtitle: "Your Academic Background" },
];

const TOTAL_STEPS = STEPS.length;

const ResumeBuilder = ({ user, setuser }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [data, setData] = useState(initialData);
  const progressPct = (currentStep / TOTAL_STEPS) * 100;
  const activeStep = STEPS.find((s) => s.step === currentStep);
  const navigate = useNavigate();

  const goPrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const isLastStep = currentStep === STEPS.length;

  // ===================================RESUME PREVIEW========================
  if (showPreview) {
    return (
      <PreviewResume
        data={data}
        user={user}
        setUser={setuser}
        onBack={() => setShowPreview(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111111] flex flex-col">

      {/* ================================NAVBAR==================================== */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-20 border-b border-black/5 bg-white/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div
            onClick={() => navigate("/dashboard")}
            className="flex cursor-pointer items-center gap-2 group"
          >
            <span className="text-sm font-extrabold tracking-tight text-[#111111] transition-colors duration-300 group-hover:text-black">
              FresherAI
            </span>
            <span className="hidden rounded-full bg-black/5 px-2.5 py-1 text-[10px] font-medium text-black/60 transition-colors duration-300 group-hover:bg-black/10 sm:block">
              Resume Builder
            </span>
          </div>

          <button
            onClick={() => setShowPreview(true)}
            className="flex h-9 items-center justify-center gap-2 rounded-full border border-black/10 px-4 text-xs font-medium text-black/60 transition-all duration-300 hover:border-black/25 hover:bg-black/5 hover:text-[#111111] cursor-pointer"
          >
            <FiEye size={14} />
            <span className="hidden sm:block">Preview</span>
          </button>
        </div>
      </motion.nav>

      {/* ================================MAIN CONTAINER==================================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className="flex-1 px-4 py-6 sm:p-8"
      >
        <div className="mx-auto w-full max-w-2xl">

          {/* ================================STEP HEADER==================================== */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-black/50">
                Step {currentStep} of {TOTAL_STEPS}
              </p>
              <p className="hidden text-[11px] font-medium text-black/40 sm:block">
                {Math.round(progressPct)}% Completed
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#111111] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>

            {/* Step Title */}
            <div className="mt-5">
              <motion.h2
                key={currentStep}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-2xl font-bold tracking-tight text-[#111111] sm:text-3xl"
              >
                {activeStep.title}
              </motion.h2>
              <motion.p
                key={`sub-${currentStep}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
                className="mt-1.5 text-sm text-black/45"
              >
                {activeStep.subtitle}
              </motion.p>
            </div>
          </div>

          <div className="border-t border-black/5 mb-6" />

          {/* ================================FORM==================================== */}
          <ResumeForm step={currentStep} data={data} setData={setData} />

          <div className="border-t border-black/5 mt-8 mb-6" />

          {/* ============================NAVIGATION BUTTONS================================== */}
          <div className="flex items-center justify-between">

            {/* Previous */}
            <button
              onClick={goPrev}
              disabled={currentStep === 1}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-medium border transition-all duration-300 ${
                currentStep === 1
                  ? "border-black/5 text-black/25 cursor-not-allowed"
                  : "border-black/10 text-black/60 hover:border-black/30 hover:text-[#111111] hover:bg-black/5 cursor-pointer"
              }`}
            >
              <FiArrowLeft size={14} />
              <span className="hidden sm:block">Previous</span>
            </button>

            {/* Step Dots */}
            <div className="flex items-center gap-1.5">
              {STEPS.map((s) => (
                <button
                  onClick={() => setCurrentStep(s.step)}
                  key={s.step}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    s.step === currentStep
                      ? "w-5 h-1.5 bg-[#111111]"
                      : s.step < currentStep
                      ? "w-1.5 h-1.5 bg-black/35 hover:bg-black/50"
                      : "w-1.5 h-1.5 bg-black/10 hover:bg-black/25"
                  }`}
                />
              ))}
            </div>

            {/* Next / Preview */}
            {isLastStep ? (
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold bg-[#111111] text-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-300 hover:bg-black hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 cursor-pointer"
              >
                <FiEye size={13} />
                <span className="hidden sm:block">Preview Resume</span>
              </button>
            ) : (
              <button
                onClick={goNext}
                className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold bg-[#111111] text-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-300 hover:bg-black hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 cursor-pointer"
              >
                <span className="hidden sm:block">Next</span>
                <FiArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResumeBuilder;