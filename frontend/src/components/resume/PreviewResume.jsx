import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { FiArrowLeft, FiMinus, FiPlus } from "react-icons/fi";
import DownloadBt from "./DownloadBt";
import ATSTemplate from "./ATSTemplate";

const A4_WIDTH_PX = 794; // 210mm @ 96dpi
const GUTTER = 32; // breathing room on both sides

const PreviewResume = ({ data, onBack, user, setUser }) => {
  const resumeRef = useRef(null);
  const stageRef = useRef(null);

  const [fitScale, setFitScale] = useState(1); // scale that fits the viewport
  const [zoom, setZoom] = useState(1); // user zoom on top of fit
  const [sheetHeight, setSheetHeight] = useState(1123); // 297mm @ 96dpi

  const scale = fitScale * zoom;

  /* Fit the A4 sheet to whatever width the stage actually has, instead of
     guessing from window.innerWidth. Caps at 0.95 so it never looks blown up. */
  const measure = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const available = stage.clientWidth - GUTTER;
    setFitScale(Math.min(0.95, Math.max(0.3, available / A4_WIDTH_PX)));

    if (resumeRef.current) {
      setSheetHeight(resumeRef.current.offsetHeight);
    }
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure, data]);

  useEffect(() => {
    const stage = stageRef.current;
    const sheet = resumeRef.current;
    if (!stage || !sheet) return;

    /* ResizeObserver beats a window resize listener here: it also catches
       the sheet growing when the user adds another job, and sidebar toggles. */
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    ro.observe(sheet);

    return () => ro.disconnect();
  }, [measure]);

  const zoomOut = () => setZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(2)));
  const zoomIn = () => setZoom((z) => Math.min(1.8, +(z + 0.1).toFixed(2)));

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7f9] text-[#0a0a0a]">
      {/* ===================== HEADER ===================== */}
      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold sm:text-lg">Resume preview</h2>
            <p className="mt-0.5 text-[11px] text-black/45 sm:text-xs">
              Check it over, then download.
            </p>
          </div>

          <div className="flex items-center justify-between gap-2.5 sm:justify-end">
            <button
              type="button"
              onClick={onBack}
              className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-black/15 px-3 text-xs font-medium text-black/60 transition-colors duration-150 hover:border-black/35 hover:text-[#0a0a0a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/40"
            >
              <FiArrowLeft size={15} />
              <span className="hidden sm:inline">Back to edit</span>
            </button>

            {/* zoom controls — hidden on phones where fit-to-width is enough */}
            <div className="hidden items-center gap-1 rounded-lg border border-black/15 p-0.5 md:flex">
              <button
                type="button"
                onClick={zoomOut}
                aria-label="Zoom out"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-black/55 transition-colors duration-150 hover:bg-black/5 hover:text-black disabled:opacity-35"
                disabled={zoom <= 0.6}
              >
                <FiMinus size={14} />
              </button>
              <span className="w-11 select-none text-center text-[11px] tabular-nums text-black/55">
                {Math.round(scale * 100)}%
              </span>
              <button
                type="button"
                onClick={zoomIn}
                aria-label="Zoom in"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-black/55 transition-colors duration-150 hover:bg-black/5 hover:text-black disabled:opacity-35"
                disabled={zoom >= 1.8}
              >
                <FiPlus size={14} />
              </button>
            </div>

            <DownloadBt docRef={resumeRef} user={user} setUser={setUser} />
          </div>
        </div>
      </header>

      {/* ===================== STAGE ===================== */}
      <main ref={stageRef} className="flex-1 overflow-x-auto px-4 py-6 sm:px-6 sm:py-10">
        {/* This wrapper reserves the *scaled* size. transform: scale() doesn't
           change layout box, so without it you get a huge blank gap below. */}
        <div
          className="mx-auto transition-[width,height] duration-200 ease-out"
          style={{
            width: A4_WIDTH_PX * scale,
            height: sheetHeight * scale,
          }}
        >
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              width: A4_WIDTH_PX,
            }}
            className="transition-transform duration-200 ease-out"
          >
            <div
              ref={resumeRef}
              className="w-[210mm] overflow-hidden rounded-[3px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08),0_12px_40px_-12px_rgba(0,0,0,0.25)]"
            >
              <ATSTemplate data={data} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PreviewResume;