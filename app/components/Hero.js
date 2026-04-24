"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

function MockUI() {
  const [currentReport, setCurrentReport] = useState(0);

  const reports = [
    {
      title: "Annual Blood Panel — Apr 2025",
      metrics: [
        { label: "Blood Glucose", value: "94 mg/dL", status: "normal", color: "#22c55e", icon: "🩸" },
        { label: "HbA1c", value: "5.4%", status: "optimal", color: "#06b6d4", icon: "📊" },
        { label: "LDL Cholesterol", value: "112 mg/dL", status: "borderline", color: "#f59e0b", icon: "❤️" },
      ],
      insight: "Your glucose and HbA1c are within healthy ranges. Monitor LDL — dietary adjustments may help.",
    },
    {
      title: "Vitamin Panel — Mar 2025",
      metrics: [
        { label: "Vitamin D", value: "38 ng/mL", status: "optimal", color: "#22c55e", icon: "☀️" },
        { label: "Vitamin B12", value: "425 pg/mL", status: "normal", color: "#06b6d4", icon: "💊" },
        { label: "Iron", value: "68 µg/dL", status: "low", color: "#ef4444", icon: "🔴" },
      ],
      insight: "Vitamin levels are mostly healthy. Consider iron supplementation and include more iron-rich foods.",
    },
    {
      title: "Thyroid Function — Feb 2025",
      metrics: [
        { label: "TSH", value: "2.1 mIU/L", status: "normal", color: "#22c55e", icon: "🦋" },
        { label: "Free T4", value: "1.3 ng/dL", status: "optimal", color: "#06b6d4", icon: "📈" },
        { label: "Free T3", value: "3.2 pg/mL", status: "normal", color: "#22c55e", icon: "✓" },
      ],
      insight: "Thyroid function is excellent. All markers are within optimal ranges. Continue current routine.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReport((prev) => (prev + 1) % reports.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const report = reports[currentReport];

  return (
    <motion.div
      className="relative w-full max-w-md mx-auto"
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: "1200px" }}
    >
      {/* Glow behind card */}
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(34,199,138,0.18) 0%, transparent 70%)",
          filter: "blur(30px)",
          transform: "scale(1.1)",
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentReport}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.9)",
            boxShadow: "0 32px 64px rgba(15,76,129,0.12), 0 0 0 1px rgba(255,255,255,0.6) inset",
            transformStyle: "preserve-3d",
          }}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: -90, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Card header */}
          <div
            className="px-6 pt-6 pb-4"
            style={{ borderBottom: "1px solid rgba(15,76,129,0.07)" }}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#0f4c81",
                  opacity: 0.5,
                }}
              >
                AI Analysis
              </span>
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: "rgba(34,199,138,0.12)", color: "#15803d" }}
              >
                ✓ Complete
              </span>
            </div>
            <h3
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 700,
                fontSize: "1.05rem",
                color: "#0f2d4a",
              }}
            >
              {report.title}
            </h3>
          </div>

          {/* Metrics */}
          <div className="px-6 py-4 flex flex-col gap-3">
            {report.metrics.map((m, i) => (
              <motion.div
                key={m.label}
                className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{ background: "rgba(15,76,129,0.035)" }}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{m.icon}</span>
                  <div>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.82rem",
                        color: "#1e3a5f",
                      }}
                    >
                      {m.label}
                    </p>
                    <p
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.72rem",
                        color: m.color,
                        fontWeight: 600,
                      }}
                    >
                      {m.value}
                    </p>
                  </div>
                </div>
                <span
                  className="px-2.5 py-0.5 rounded-full"
                  style={{
                    background: `${m.color}18`,
                    color: m.color,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    textTransform: "capitalize",
                  }}
                >
                  {m.status}
                </span>
              </motion.div>
            ))}
          </div>

          {/* AI Insight bar */}
          <motion.div
            className="mx-6 mb-6 rounded-2xl p-4"
            style={{
              background: "linear-gradient(135deg, rgba(15,76,129,0.07) 0%, rgba(34,199,138,0.07) 100%)",
              border: "1px solid rgba(34,199,138,0.2)",
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="flex items-start gap-3">
              <div
                className="rounded-lg p-1.5 flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #0f4c81, #22c78a)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.78rem",
                  lineHeight: 1.55,
                  color: "#2d4a6e",
                }}
              >
                <strong>VitalDecode AI:</strong> {report.insight}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Floating badge */}
      <motion.div
        className="absolute -top-3 -right-3 rounded-2xl px-3 py-2 flex items-center gap-2"
        style={{
          background: "linear-gradient(135deg, #0f4c81, #1a7a5e)",
          boxShadow: "0 8px 24px rgba(15,76,129,0.35)",
        }}
        initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 1.4, duration: 0.5, type: "spring", bounce: 0.4 }}
      >
        <span style={{ fontSize: "0.75rem" }}>⚡</span>
        <span
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "white",
            letterSpacing: "0.04em",
          }}
        >
          Instant AI
        </span>
      </motion.div>

      {/* Progress indicator dots */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {reports.map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: currentReport === i ? "#0f4c81" : "rgba(15,76,129,0.2)",
              transform: currentReport === i ? "scale(1.3)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function Hero() {

    const router = useRouter();
    
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #f0f7ff 0%, #e8f8f2 50%, #f5fbff 100%)",
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large soft gradient orb */}
        <div
          className="absolute rounded-full"
          style={{
            width: 700,
            height: 700,
            top: "-20%",
            right: "-15%",
            background: "radial-gradient(circle, rgba(34,199,138,0.1) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 500,
            height: 500,
            bottom: "-10%",
            left: "-10%",
            background: "radial-gradient(circle, rgba(15,76,129,0.08) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(15,76,129,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(15,76,129,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Google Fonts import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;600&display=swap');
      `}</style>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center min-h-screen lg:min-h-0 lg:py-32">

          {/* Left — Text content */}
          <div className="flex flex-col gap-6">
            {/* Pill badge */}
            <motion.div
              className="inline-flex self-start items-center gap-2 rounded-full px-4 py-2"
              style={{
                background: "rgba(15,76,129,0.07)",
                border: "1px solid rgba(15,76,129,0.12)",
              }}
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "#22c78a" }}
              />
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.78rem",
                  fontWeight: 500,
                  color: "#0f4c81",
                  letterSpacing: "0.05em",
                }}
              >
                Powered by Medical AI
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "#0a1f36",
              }}
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              Understand Your{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #0f4c81 0%, #22c78a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Health Reports
              </span>
              , Instantly.
            </motion.h1>

            {/* Subheading */}
            <motion.p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
                lineHeight: 1.7,
                color: "#3d5a7a",
                maxWidth: 480,
              }}
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              AI-powered insights that simplify complex medical data into clear, actionable explanations — so you can take charge of your health with confidence.
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="flex flex-wrap gap-4 mt-2"
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              {/* Primary CTA */}
              <motion.button
                onClick={() => router.push("/login")}
                className="relative px-7 py-3.5 rounded-xl font-semibold text-white overflow-hidden"
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "0.92rem",
                  background: "linear-gradient(135deg, #0f4c81 0%, #1a7a5e 100%)",
                  boxShadow: "0 8px 24px rgba(15,76,129,0.3), 0 1px 0 rgba(255,255,255,0.1) inset",
                  letterSpacing: "0.01em",
                }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 12px 32px rgba(15,76,129,0.4)",
                  y: -1,
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                Get Started →
              </motion.button>

              {/* Secondary CTA */}
              <motion.button
              onClick={() => router.push("/signup")}
                className="px-7 py-3.5 rounded-xl font-semibold"
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "0.92rem",
                  color: "#0f4c81",
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(12px)",
                  border: "1.5px solid rgba(15,76,129,0.15)",
                  boxShadow: "0 4px 16px rgba(15,76,129,0.06)",
                  letterSpacing: "0.01em",
                }}
                whileHover={{
                  scale: 1.03,
                  background: "rgba(255,255,255,0.95)",
                  borderColor: "rgba(15,76,129,0.3)",
                  y: -1,
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                Sign Up for free
              </motion.button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              className="flex items-center gap-4 mt-2"
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <div className="flex -space-x-2.5">
                {["#0f4c81", "#1a7a5e", "#06b6d4", "#22c78a"].map((c, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center"
                    style={{ background: `${c}cc`, fontSize: "0.65rem", color: "white", fontWeight: 700 }}
                  >
                    {["JD", "KL", "AM", "SR"][i]}
                  </div>
                ))}
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.8rem",
                  color: "#3d5a7a",
                }}
              >
                <strong style={{ color: "#0f4c81" }}>12,000+</strong> health reports decoded this month
              </p>
            </motion.div>
          </div>

          {/* Right — Mock UI */}
          <div className="flex justify-center lg:justify-end">
            <MockUI />
          </div>
        </div>
      </div>
    </section>
  );
}