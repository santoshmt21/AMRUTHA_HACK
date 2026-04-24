"use client";

import { motion } from "framer-motion";

export default function AuthCard({ title, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6"
      style={{
        background: "linear-gradient(160deg, #f0f7ff 0%, #e8f8f2 50%, #f5fbff 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl p-8"
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.9)",
          boxShadow: "0 32px 64px rgba(15,76,129,0.12)",
        }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-[#0a1f36]">
          {title}
        </h2>

        {children}
      </motion.div>
    </div>
  );
}