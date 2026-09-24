import React, { useEffect, useRef, useState } from "react";
import maleVideo from "../../assets/male-ai.mp4";
import femaleVideo from "../../assets/female-ai.mp4";
import { AnimatePresence, motion } from "motion/react";
import {
  FiArrowRight,
  FiCamera,
  FiCameraOff,
  FiClock,
  FiCode,
  FiMessageSquare,
  FiMic,
  FiMicOff,
} from "react-icons/fi";
import CodeEditor from "./CodeEditor";
import Timer from "./Timer";
import { submitAnswer } from "../../apis/interview.api";
import { useNavigate } from "react-router-dom";

const Step2interview = ({ interviewData, user }) => {
  const navigate = useNavigate();

  const [question, setQuestion] = useState(interviewData.question);
  const [currentIndex, setCurrentIndex] = useState(
    interviewData.currentQuestion || 0,
  );
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(interviewData.question.timer || 60);
  const [timeActive, setTimeActive] = useState(true);

  const [micOn, setMicon] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);

  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [subtitle, setSubTitle] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voiceGender, setVoiceGender] = useState("female");
  const [introSpoken, setIntroSpoken] = useState(false);

  const aiVideoRef = useRef(null);
  const userVideoRef = useRef(null);
  const recognitionRef = useRef(null);
  const streamRef = useRef(null);

  const videoSource = voiceGender === "female" ? femaleVideo : maleVideo;
  const progress = ((currentIndex + 1) / interviewData.totalQuestions) * 100;
  const showMicon = micOn && !isAIPlaying;

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition is not supported in this browser.");
      return;
    }

    const rec = new SpeechRecognition();

    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = false;

    rec.onresult = (e) => {
      const t = e.results[e.results.length - 1][0].transcript;
      setAnswer((prev) => (prev ? prev + " " + t : t));
    };

    rec.onerror = (e) => {
      console.warn("Speech recognition error:", e.error);
    };

    recognitionRef.current = rec;

    return () => {
      try {
        rec.stop();
      } catch (error) {}

      recognitionRef.current = null;
    };
  }, []);

  const startMic = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    try {
      recognition.start();
    } catch (error) {}
  };

  const stopMic = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    try {
      recognition.stop();
    } catch (error) {}
  };

  const toggleMic = () => {
    if (micOn) {
      stopMic();
      setMicon(false);
    } else {
      startMic();
      setMicon(true);
    }
  };

  const toggleCamera = async () => {
    if (cameraOn) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setCameraOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current = stream;
        setCameraOn(true);
        setTimeout(() => {
          if (userVideoRef.current) {
            userVideoRef.current.srcObject = stream;
          }
        }, 100);
      } catch (error) {
        console.error("Camera error:", error);
        setCameraOn(false);
      }
    }
  };

  const handleSubmitCode = (code) => {
    setAnswer((prev) => {
      const separator = prev.trim() ? "\n\n--- Code ---\n" : "--- Code ---\n";
      return prev + separator + code;
    });
    setCodeOpen(false);
  };

  useEffect(() => {
    if (timeLeft <= 0 || !timeActive) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(t);
  }, [timeLeft, timeActive]);

  // Loads a TTS voice. Some browsers/OS never fire `onvoiceschanged` and
  // `getVoices()` keeps returning [] forever, so we retry for a few
  // seconds instead of giving up after one empty check.
  useEffect(() => {
    let attempts = 0;
    let retryId;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();

      if (!voices.length) {
        attempts += 1;
        if (attempts < 10) {
          retryId = setTimeout(loadVoices, 300);
        } else {
          console.warn(
            "No speech synthesis voices found on this browser/device. Subtitles and avatar video will still show, but there will be no audio.",
          );
        }
        return;
      }

      const female = voices.find((voice) =>
        /zira|samantha|female/i.test(voice.name),
      );
      const male = voices.find((voice) => /david|mark|male/i.test(voice.name));

      if (female) {
        setSelectedVoice(female);
        setVoiceGender("female");
      } else if (male) {
        setSelectedVoice(male);
        setVoiceGender("male");
      } else {
        setSelectedVoice(voices[0]);
        setVoiceGender("female");
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      clearTimeout(retryId);
    };
  }, []);

  // Speaks `text`. Subtitle + avatar "talking" video always show, even
  // if speech synthesis is unavailable or no voice loaded yet - only the
  // audio itself is skipped in that case, so the UI never looks dead.
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!text?.trim()) {
        resolve();
        return;
      }

      const canSpeak = !!window.speechSynthesis && !!selectedVoice;

      const finish = () => {
        aiVideoRef.current?.pause();
        setIsAIPlaying(false);
        if (micOn) startMic();
        setTimeout(() => {
          setSubTitle("");
          resolve();
        }, 300);
      };

      setSubTitle(text);
      setIsAIPlaying(true);
      stopMic();
      aiVideoRef.current?.play().catch(() => {});

      if (!canSpeak) {
        console.warn(
          "speakText: no voice available yet, showing subtitle/video without audio.",
        );
        const estimatedMs = Math.min(6000, Math.max(1500, text.length * 55));
        setTimeout(finish, estimatedMs);
        return;
      }

      window.speechSynthesis.cancel();

      setTimeout(() => {
        const utter = new SpeechSynthesisUtterance(
          text.replace(/,/g, ", ... ").replace(/\./g, ". ... "),
        );

        utter.voice = selectedVoice;
        utter.rate = 0.92;
        utter.pitch = 1.05;
        utter.volume = 1;

        utter.onend = finish;
        utter.onerror = finish;

        window.speechSynthesis.speak(utter);
      }, 150);
    });
  };

  useEffect(() => {
    if (!selectedVoice || introSpoken) return;

    const runIntro = async () => {
      setIntroSpoken(true);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const firstName = user?.name?.split(" ")[0] || "there";
      await speakText(`Welcome ${firstName}! Let's begin your interview.`);
      await new Promise((resolve) => setTimeout(resolve, 900));
      await speakText(interviewData?.question?.questions);
    };

    runIntro();
  }, [selectedVoice]);

  useEffect(() => {
    if (!selectedVoice || !introSpoken) return;

    if (question?.questions === interviewData?.question?.questions) {
      return;
    }

    const speakQuestion = async () => {
      await new Promise((resolve) => setTimeout(resolve, 900));
      await speakText(question?.questions);
    };

    speakQuestion();
  }, [question, selectedVoice, introSpoken]);

  useEffect(() => {
    setQuestion(interviewData?.question);
    setCurrentIndex(interviewData?.currentQuestion || 0);
    setTimeLeft(interviewData?.question?.timer || 60);
  }, [interviewData]);

  useEffect(() => {
    if (!question) return;
    setTimeLeft(question.timer || 60);
    setTimeActive(true);
  }, [question]);
  

  const submit = async () => {
    if (!answer.trim() || loading) return;

    setTimeActive(false);
    setLoading(true);

    try {
      const res = await submitAnswer({
        interviewId: interviewData.interviewId,
        answer,
      });

      if (res.completed) {
        setFeedback(res.feedback);
        await new Promise((resolve) => setTimeout(resolve, 700));
        await speakText(
          res.feedback?.feedback ||
            "Great job! Your interview is complete. Preparing your report now.",
        );
        navigate(`/interview/${interviewData.interviewId}/report`);
        return;
      }

      setFeedback(res.feedback);
      await new Promise((resolve) => setTimeout(resolve, 700));
      await speakText(
        res.feedback?.feedback || "Noted your answer. Let's move to the next question.",
      );
      setQuestion(res.question);
      setCurrentIndex(res.currentQuestion);
      setAnswer("");
      setFeedback(null);
    } catch (error) {
      console.error("Submit answer error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      try {
        recognitionRef.current?.stop();
      } catch (error) {}
      streamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-3 sm:p-5">
      {codeOpen && (
        <CodeEditor
          onClose={() => setCodeOpen(false)}
          onSubmitCode={handleSubmitCode}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl bg-[#0e1016] border border-white/10 rounded-2xl sm:rounded-[24px] overflow-hidden shadow-[0_0_60px_rgba(255,255,255,.03)] grid lg:grid-cols-[36%_64%]"
      >
        <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-white/8 p-4 sm:p-5 gap-3">
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
            <video
              key={videoSource}
              src={videoSource}
              ref={aiVideoRef}
              muted
              playsInline
              preload="auto"
              loop
              className="w-full h-full object-cover"
            />
            {isAIPlaying && (
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
                <div className="flex gap-0.5 items-end h-3">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      animate={{ height: ["4px", "12px", "4px"] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                      key={i}
                      className="w-0.5 bg-white rounded-full"
                    />
                  ))}
                </div>
                <span className="text-[10px] text-white/80">AI Speaking</span>
              </div>
            )}
          </div>

          <div className="min-h-[52px] flex items-center">
            <AnimatePresence>
              {subtitle && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full rounded-xl bg-white/5 border border-white/8 px-3 py-2"
                >
                  <p className="text-xs text-white/65 leading-relaxed text-center">
                    {subtitle}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative rounded-xl overflow-hidden bg-[#17181e] border border-white/8 aspect-video items-center flex justify-center">
            {cameraOn ? (
              <>
                <video
                  ref={userVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
                  <span className="text-[10px] text-white/70">You</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs text-white/35">
                  {user?.name?.split(" ")[0]}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-1.5 pt-1">
            <div className="flex items-center justify-center gap-3">
              <motion.button
                onClick={toggleMic}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${showMicon ? "bg-white/10 border-white/15 text-white" : "bg-red-500/20 border-red-500/30 text-red-400"}`}
              >
                {showMicon ? <FiMic size={15} /> : <FiMicOff size={15} />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                onClick={toggleCamera}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${cameraOn ? "bg-white/10 border-white/15 text-white" : "bg-white/5  border-white/10 text-white/45 hover:text-white/70"}`}
              >
                {cameraOn ? <FiCamera size={15} /> : <FiCameraOff size={15} />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => setCodeOpen(true)}
                className="w-10 h-10 rounded-xl flex items-center justify-center border bg-white/5 border-white/10 text-white/45 hover:text-white hover:border-white/20 transition-all"
              >
                <FiCode size={15} />
              </motion.button>
            </div>

            <div className="min-h-[14px] flex items-center justify-center">
              {micOn && isAIPlaying && (
                <span className="text-[10px] text-red-400/80">
                  Mic paused - AI is speaking
                </span>
              )}
            </div>

            <span className="text-[10px] text-white/35 text-center">
              Coding question? Use{" "}
              <FiCode size={9} className="inline -mt-0.5" /> to write &amp; add
              code
            </span>
          </div>
        </div>

        <div className="flex flex-col p-4 sm:p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-white">
                AI Interview
              </h2>
              <div className="flex items-center gap-2 text-zinc-500 text-xs mt-0.5">
                <FiClock size={11} />
                <span className="">{question.difficulty}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5 min-w-[110px]">
              <Timer timeLeft={timeLeft} totalTime={question.timer || 60} />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative overflow-hidden rounded-xl bg-[#17181e] border border-white/8 p-4 sm:p-5 mb-4"
          >
            <div className="absolute inset-0 bg-linear-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none" />
            <div className="relative flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center shrink-0">
                <FiMessageSquare size={14} />
              </div>
              <p className="text-xs text-zinc-500 ">
                Question {currentIndex + 1}
              </p>
            </div>

            <p className="relative text-white text-sm sm:text-base leading-7">
              {question.questions}
            </p>
          </motion.div>

          <div className="mb-3">
            <div className="flex justify-between text-[10px] text-white/35 mb-1">
              <span>Progress</span>
              <span>
                {currentIndex + 1}/{interviewData.totalQuestions}
              </span>
            </div>

            <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <label className="text-xs font-medium text-zinc-400 mb-1.5">
              Your Answer
            </label>
            <textarea
              onChange={(e) => setAnswer(e.target.value)}
              value={answer}
              placeholder="write your answer here.. or speak if mic is on"
              rows={5}
              onKeyDown={(e) => {
                if (e.ctrlKey && e.key === "Enter") submit();
              }}
              className="flex-1 w-full rounded-xl bg-[#17181e] border border-white/8 p-4 text-sm text-white outline-none resize-none focus:border-white/25 transition placeholder-white/20"
            />
          </div>

          <div className="mt-3 min-h-[0px]">
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 max-h-40 overflow-y-auto"
                >
                  <p className="text-xs uppercase tracking-widest text-green-400 mb-2">
                    AI Feedback
                  </p>
                  <p className="text-2xl text-zinc-300 leading-6">
                    {feedback.feedback}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/8">
            <span className="text-xs text-zinc-600 hidden sm:block">
              Press{" "}
              <span className="mx-1 rounded bg-white/10 px-1.5 py-0.5 text-white text-[10px]">
                Ctrl+Enter
              </span>
              To Submit
            </span>

            <motion.button
              onClick={submit}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="ml-auto h-10 min-w-[150px] justify-center px-5 rounded-xl bg-white text-black text-sm font-semibold flex items-center gap-2 disabled:opacity-40 transition"
              disabled={loading || !answer.trim()}
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  Submit Answer <FiArrowRight size={15} />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Step2interview;