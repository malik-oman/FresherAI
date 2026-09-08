import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { GiArtificialHive } from "react-icons/gi";
import { FiLogOut, FiPlus, FiSidebar } from "react-icons/fi";
import {
  FaFileAlt,
  FaRoute,
  FaChartLine,
  FaCoins,
  FaPlusCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  {
    name: "Resume Builder",
    path: "/resume",
    icon: <FaFileAlt />,
  },
  {
    name: "Roadmap Builder",
    path: "/roadmap",
    icon: <FaRoute />,
  },
  {
    name: "Resume Scorer",
    path: "/scorer",
    icon: <FaChartLine />,
  },
];

const Sidebar = ({
  user,
  onNewInterview,
  onLogout,
  sidebarOpen,
  setSidebarOpen,
  mobileOpen,
  setMobileOpen,
}) => {
  const navigate = useNavigate();
  const avatar = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  // ===================================================================
  const inner = (
    <div className="flex flex-col h-full">
      <div
        className={`px-3 h-[52px] border-b border-black/8 shrink-0 flex items-center ${sidebarOpen ? "justify-between" : "justify-center"}`}
      >
        {sidebarOpen && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#000000] flex items-center justify-center shrink-0 shadow-[0_4px_14px_rgba(0,0,0,0.25)]">
              <GiArtificialHive size={19} color="white" />
            </div>
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className="font-extrabold text-sm tracking-tight text-[#0a0a0a] whitespace-nowrap"
            >
              FresherAI
            </motion.span>
          </div>
        )}

        <div className="flex items-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex cursor-pointer text-black/30 hover:text-[#0a0a0a] transition-colors shrink-0"
          >
            <FiSidebar size={17} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className=" md:hidden text-black/30 hover:text-[#0a0a0a] transition-colors shrink-0"
          >
            <FiSidebar size={16} />
          </motion.button>
        </div>
      </div>

      <div className="px-2.5 pt-3 pb-1.5 shrink-0">
        <motion.button
          onClick={onNewInterview}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`w-full flex items-center gap-2 bg-[#000000] text-white font-semibold rounded-lg py-2 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:bg-[#1a1a1a] ${sidebarOpen ? "px-2.5" : "justify-center px-0"}`}
        >
          <FiPlus size={14} className="shrink-0" />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ opacity: 0.13 }}
                className="text-xs whitespace-nowrap cursor-pointer"
              >
                Create Interview
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: 0.13 }}
            className="px-3 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-widest text-black/60"
          >
            Agents
          </motion.p>
        )}
      </AnimatePresence>

      <nav className="flex flex-col gap-0.5 px-2.5 flex-1">
        {NAV_ITEMS.map((nav, i) => (
          <motion.button
            key={i}
            onClick={() => {
              navigate(nav.path);
              setMobileOpen(false);
            }}
            whileHover={{ x: sidebarOpen ? 3 : 0 }}
            transition={{ duration: 0.13 }}
            className={`flex items-center gap-2.5 rounded-lg py-2 transition-all text-xs font-medium
              text-black/55 hover:text-[#0a0a0a] cursor-pointer ${sidebarOpen ? "px-2.5" : "justify-center px-0"}`}
          >
            <span className="shrink-0">{nav.icon}</span>
            {sidebarOpen && (
              <span className="whitespace-nowrap">{nav.name}</span>
            )}
          </motion.button>
        ))}
      </nav>

      {/* ===================COINS================================ */}
      <div className="border-t border-black/8 p-2.5 shrink-0">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: 0.13 }}
              onClick={() => navigate("/pricing")}
              className="group flex cursor-pointer items-center justify-between gap-2.5 rounded-lg border border-white/10 bg-[#000000]/90 backdrop-blur-2xl px-2.5 py-1.5 mb-2.5 transition-all hover:border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
            >
              <div className="flex items-center gap-1.5">
                <FaCoins size={15} className="text-yellow-500 shrink-0" />

                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-wider text-white/40 font-medium">
                    Interview Coins
                  </span>
                  <span className="text-xs font-bold text-white">
                    {user?.interviewCoin}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <FaPlusCircle
                  size={16}
                  className="text-white/70 transition-transform duration-200 group-hover:scale-110"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={`flex items-center gap-2 ${sidebarOpen ? "" : "justify-center"}`}
        >
          <div className="w-7 h-7 rounded-full bg-[#000000] flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-[10px]">{avatar}</span>
          </div>

          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-[#0a0a0a] text-[11px] font-semibold truncate">
                  {user?.name ?? "User"}
                </p>
                <p className="text-black/55 text-[11px] truncate">
                  {user?.email ?? "user@gmail.com"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {sidebarOpen && (
              <motion.button
              
                onClick={onLogout}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.15 }}
                className="text-black/50 hover:text-[#0a0a0a] transition-colors ml-auto"
              >
                <FiLogOut />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
  // ====================================================================
  return (
    <>
      <motion.aside
        animate={{ width: sidebarOpen ? 260 : 72 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden md:flex fixed top-0 left-0 h-screen bg-white border-r border-black/8 flex-col z-40 overflow-hidden"
      >
        {inner}
      </motion.aside>

      <AnimatePresence>
      {mobileOpen && (
        <motion.div
        initial={{opacity:0}}
        animate={{opacity:1}}
        exit={{opacity:0}}
        onClick={()=>setMobileOpen(false)}
        className="fixed inset-0 bg-black/30 z-40 md:hidden backdrop-blur-sm"/>

      
      )}
      </AnimatePresence>

           <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
            />
            <motion.aside
              key="mobile-sidebar"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: "backInOut" }}
              className="fixed top-0 left-0 h-screen w-[280px] max-w-[85vw] bg-white border-r border-black/8 flex flex-col z-50 md:hidden overflow-hidden"
            >
              {inner}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

       

    </>
  );
};

export default Sidebar;
