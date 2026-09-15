import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { useState } from "react";
import { useEffect } from "react";
import { getCurrentUser } from "./apis/user.api";
import Scorer from "./pages/Scorer";
import { getResume } from "./apis/resume.api";
import { useDispatch } from "react-redux";
import { setResume } from "./redux/resumeSlice";
import ResumeBuilder from "./pages/ResumeBuilder";

const App = () => {
  const [user, setuser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await getCurrentUser();
        setuser(data.user);
      } catch (error) {
        setuser(null);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const getResumeData = async () => {
      const result = await getResume();
      dispatch(setResume(result?.data));
    };
    getResumeData();
  }, []);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full z-[9999]">
        <div className="h-1 bg-black animate-pulse w-full" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Home setUser={setuser} />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} setUser={setuser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/scorer"
          element={
            user ? (
              <Scorer user={user} setUser={setuser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/resume"
          element={
            user ? (
              <ResumeBuilder user={user} setUser={setuser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </>
  );
};

export default App;
