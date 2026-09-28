import React, { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { motion } from "motion/react";
import { FiPlus, FiSidebar } from "react-icons/fi";
import { getAllInterview } from "../apis/interview.api";
import Stats from "../components/Stats";
import InterviewGraph from "../components/InterviewGraph";

const EMPTY_STATS = {
  totalInterviews: 0,
  totalQuestions: 0,
  completed: 0,
  averageScore: 0,
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2";

/* ---------- Loading placeholder for the two radar cards ---------- */

function GraphSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4"
      aria-busy="true"
      aria-label="Loading interview history"
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/10 bg-[#07080b] p-4 md:p-5"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-3.5 w-36 animate-pulse rounded bg-white/10 motion-reduce:animate-none" />
              <div className="h-3 w-20 animate-pulse rounded bg-white/5 motion-reduce:animate-none" />
            </div>
            <div className="h-8 w-14 animate-pulse rounded bg-white/10 motion-reduce:animate-none" />
          </div>
          <div className="mx-auto my-6 h-[190px] w-[190px] animate-pulse rounded-full border border-white/10 bg-white/[0.04] motion-reduce:animate-none" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-[66px] animate-pulse rounded-xl bg-white/[0.04] motion-reduce:animate-none" />
            <div className="h-[66px] animate-pulse rounded-xl bg-white/[0.04] motion-reduce:animate-none" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Page ---------- */

const Dashboard = ({ user, setUser }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [stats, setStats] = useState(EMPTY_STATS);
  const [technicalData, setTechnicalData] = useState([]);
  const [hrData, setHrData] = useState([]);
  const [technicalCount, setTechnicalCount] = useState(0);
  const [hrCount, setHrCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await getAllInterview();
      setStats(response?.stats ?? EMPTY_STATS);
      setTechnicalData(response?.technicalData ?? []);
      setHrData(response?.hrData ?? []);
      setTechnicalCount(response?.technicalCount ?? 0);
      setHrCount(response?.hrCount ?? 0);
    } catch (err) {
      console.log(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const handleLogout = async () => {
    try {
      const response = await api.get("/api/auth/logout");
      if (response.data.success) {
        setUser(null);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { greeting, today } = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    return {
      greeting:
        hour < 12
          ? "Good morning"
          : hour < 18
            ? "Good afternoon"
            : "Good evening",
      today: now.toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    };
  }, []);

  const firstName = user?.name?.split(" ")[0];
  const dash = "—";

  return (
    <div className="flex min-h-screen bg-white font-sans text-[#0a0a0a]">
      <Sidebar
        user={user}
        onNewInterview={() => navigate("/interview")}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setMobileOpen={setMobileOpen}
        mobileOpen={mobileOpen}
      />

      <main
        className={`relative isolate min-h-screen flex-1 px-3 py-4 transition-all duration-300 sm:px-4 md:px-6 md:py-6 ${
          sidebarOpen ? "md:ml-[260px]" : "md:ml-[72px]"
        }`}
      >
        {/* soft glow behind the header, tinted with the two chart colours */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72"
          style={{
            background:
              "radial-gradient(60% 100% at 15% 0%, rgba(122,162,255,0.14), transparent 70%), radial-gradient(50% 90% at 85% 0%, rgba(255,178,122,0.14), transparent 70%)",
          }}
        />

        <div className="mx-auto w-full max-w-[1400px]">
          {/* ========================== TOP AREA ========================== */}
          <div className="mb-5 flex items-center justify-between gap-3 md:mb-6">
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setMobileOpen(true)}
                whileTap={{ scale: 0.95 }}
                aria-label="Open sidebar"
                className={`rounded-lg border border-black/10 bg-white/70 p-2 text-black/50 backdrop-blur transition-colors hover:text-[#0a0a0a] md:hidden ${focusRing}`}
              >
                <FiSidebar size={17} />
              </motion.button>

              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <p className="mb-0.5 text-[11px] font-medium text-black/45 md:text-xs">
                  {today}
                </p>
                <h2 className="text-xl font-bold tracking-tight md:text-2xl">
                  {greeting}
                  {firstName ? `, ${firstName}` : ""}
                </h2>
              </motion.div>
            </div>

            <motion.button
              onClick={() => navigate("/interview")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              whileTap={{ scale: 0.97 }}
              aria-label="New interview"
              className={`flex shrink-0 items-center gap-2 rounded-full bg-[#0a0a0a] px-3.5 py-2 text-sm font-medium text-white shadow-[0_6px_20px_rgba(0,0,0,0.18)] transition-colors hover:bg-black/80 sm:px-4 ${focusRing}`}
            >
              <FiPlus size={16} />
              <span className="hidden sm:inline">New interview</span>
            </motion.button>
          </div>

          <div
            className="mb-5 h-px md:mb-6"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.14), rgba(0,0,0,0.05) 60%, transparent)",
            }}
          />

          {/* ========================== ERROR ========================== */}
          {error && (
            <div
              role="alert"
              className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <span>
                Your interviews didn't load. Check your connection and try
                again.
              </span>
              <button
                onClick={fetchInterviews}
                className={`shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-red-700 ring-1 ring-red-200 transition-colors hover:bg-red-100 ${focusRing}`}
              >
                Try again
              </button>
            </div>
          )}

          {/* ========================== STATS ========================== */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:gap-3 xl:grid-cols-4">
            <Stats
              label="Total interviews"
              value={loading ? dash : stats?.totalInterviews}
              subHighlight="All time"
              sub="Interviews created"
              index={0}
            />
            <Stats
              label="Questions solved"
              value={loading ? dash : stats?.totalQuestions}
              subHighlight="Answered"
              sub="Across all interviews"
              index={1}
            />
            <Stats
              label="Completed"
              value={loading ? dash : stats?.completed}
              subHighlight={`${stats?.totalInterviews || 0} total`}
              sub="Interviews finished"
              index={2}
            />
            <Stats
              label="Average score"
              value={
                loading ? dash : `${Math.round(stats?.averageScore || 0)}/100`
              }
              subHighlight="Completed only"
              sub="Average performance"
              index={3}
            />
          </div>

          {/* ========================== HISTORY ========================== */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8 md:mt-10"
          >
            <div className="mb-4 md:mb-5">
              <h3 className="text-base font-semibold tracking-tight md:text-lg">
                Interview history
              </h3>
              <p className="mt-0.5 text-xs text-black/45 md:text-sm">
                Your average score for each skill, split by interview type.
              </p>
            </div>

            {loading ? (
              <GraphSkeleton />
            ) : (
              <InterviewGraph
                technicalData={technicalData}
                technicalCount={technicalCount}
                hrData={hrData}
                hrCount={hrCount}
              />
            )}
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;