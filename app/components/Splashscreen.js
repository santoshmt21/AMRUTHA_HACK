"use client";

import { motion } from "framer-motion";

export default function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #0f4c81 0%, #1a7a5e 50%, #22c78a 100%)",
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
    >
      {/* Ambient glow blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 500,
            height: 500,
            top: "-10%",
            left: "-5%",
            background: "radial-gradient(circle, rgba(34,199,138,0.25) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 400,
            height: 400,
            bottom: "-10%",
            right: "-5%",
            background: "radial-gradient(circle, rgba(15,76,129,0.4) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </div>

      {/* Logo lockup */}
      <motion.div
        className="relative flex flex-col items-center gap-5"
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ECG / waveform icon */}
        <motion.svg
          width="120"
          height="60"
          viewBox="0 0 120 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
        >
          <motion.path
            d="M0 38 L20 38 L28 10 L38 52 L48 24 L56 38 L68 38 L76 20 L84 44 L90 30 L100 30 L120 30"
            stroke="url(#ecgGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease: "easeInOut", delay: 0.3 }}
          />
          <defs>
            <linearGradient id="ecgGrad" x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
          </defs>
        </motion.svg>

        {/* Brand name */}
        <motion.div
          className="flex items-baseline gap-0"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <span
            style={{
              fontFamily: "'Sora', 'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 6vw, 3.2rem)",
              color: "#ffffff",
              letterSpacing: "-0.03em",
            }}
          >
            Vital
          </span>
          <span
            style={{
              fontFamily: "'Sora', 'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(2rem, 6vw, 3.2rem)",
              color: "rgba(255,255,255,0.75)",
              letterSpacing: "-0.02em",
            }}
          >
            Decode
          </span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.85rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            fontWeight: 400,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          AI Health Intelligence
        </motion.p>

        {/* Pulse loader bar */}
        <motion.div
          className="mt-4 rounded-full overflow-hidden"
          style={{ width: 120, height: 3, background: "rgba(255,255,255,0.15)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #67e8f9, #4ade80)" }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.6, delay: 1.1, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}