"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SplashScreen from "./components/Splashscreen.js";
import Hero from "./components/Hero.js";

export default function Page() {
  const [showSplash, setShowSplash] = useState(true);
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    // Splash stays for 2.8s, then fades out
    const timer = setTimeout(() => {
      setShowSplash(false);
      // Give the fade-out animation time to complete before mounting hero
      setTimeout(() => setHeroReady(true), 50);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>

      <AnimatePresence>
        {heroReady && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Hero />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}