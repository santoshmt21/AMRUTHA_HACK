"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SignupPage() {

  console.log('Environment check:', {
  hasMongoURI: !!process.env.MONGODB_URI,
  hasJWTSecret: !!process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV,
});

  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Name cannot exceed 100 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least 1 uppercase letter";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least 1 lowercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least 1 number";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 || response.status === 409) {
          setErrors({ general: data.error });
        } else {
          setErrors({ general: "Something went wrong. Please try again." });
        }
        setIsLoading(false);
        return;
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to dashboard
      router.push("/dashboard");

    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ general: "Network error. Please check your connection." });
      setIsLoading(false);
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{
        background: "linear-gradient(160deg, #f0f7ff 0%, #e8f8f2 50%, #f5fbff 100%)",
      }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 600,
            height: 600,
            top: "-15%",
            right: "-10%",
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
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
      `}</style>

      <motion.div
        className="relative w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Card */}
        <div
          className="rounded-3xl p-8 md:p-10"
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.9)",
            boxShadow: "0 32px 64px rgba(15,76,129,0.12)",
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{
                background: "linear-gradient(135deg, #0f4c81 0%, #22c78a 100%)",
                boxShadow: "0 8px 24px rgba(15,76,129,0.25)",
              }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.6, type: "spring", bounce: 0.4 }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>

            <h1
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 800,
                fontSize: "1.95rem",
                color: "#0a1f36",
                marginBottom: "0.5rem",
              }}
            >
              Create Account
            </h1>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.95rem",
                color: "#3d5a7a",
              }}
            >
              Join VitalDecode to decode your health reports
            </p>
          </div>

          {/* Error message */}
          {errors.general && (
            <motion.div
              className="mb-6 p-4 rounded-xl"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.85rem",
                  color: "#dc2626",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>⚠️</span> {errors.general}
              </p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name field */}
            <div>
              <label
                htmlFor="name"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#1e3a5f",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.95rem",
                  background: errors.name ? "rgba(239,68,68,0.04)" : "rgba(15,76,129,0.04)",
                  border: errors.name ? "1.5px solid rgba(239,68,68,0.3)" : "1.5px solid rgba(15,76,129,0.1)",
                  color: "#0a1f36",
                }}
                onFocus={(e) => {
                  if (!errors.name) {
                    e.target.style.background = "rgba(255,255,255,0.9)";
                    e.target.style.borderColor = "#0f4c81";
                  }
                  e.target.style.boxShadow = "0 0 0 3px rgba(15,76,129,0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "none";
                  if (!errors.name) {
                    e.target.style.background = "rgba(15,76,129,0.04)";
                    e.target.style.borderColor = "rgba(15,76,129,0.1)";
                  }
                }}
              />
              {errors.name && (
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#dc2626", marginTop: "0.5rem" }}>
                  ⚠️ {errors.name}
                </p>
              )}
            </div>

            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#1e3a5f",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.95rem",
                  background: errors.email ? "rgba(239,68,68,0.04)" : "rgba(15,76,129,0.04)",
                  border: errors.email ? "1.5px solid rgba(239,68,68,0.3)" : "1.5px solid rgba(15,76,129,0.1)",
                  color: "#0a1f36",
                }}
                onFocus={(e) => {
                  if (!errors.email) {
                    e.target.style.background = "rgba(255,255,255,0.9)";
                    e.target.style.borderColor = "#0f4c81";
                  }
                  e.target.style.boxShadow = "0 0 0 3px rgba(15,76,129,0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "none";
                  if (!errors.email) {
                    e.target.style.background = "rgba(15,76,129,0.04)";
                    e.target.style.borderColor = "rgba(15,76,129,0.1)";
                  }
                }}
              />
              {errors.email && (
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#dc2626", marginTop: "0.5rem" }}>
                  ⚠️ {errors.email}
                </p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#1e3a5f",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl outline-none transition-all duration-200"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.95rem",
                    background: errors.password ? "rgba(239,68,68,0.04)" : "rgba(15,76,129,0.04)",
                    border: errors.password ? "1.5px solid rgba(239,68,68,0.3)" : "1.5px solid rgba(15,76,129,0.1)",
                    color: "#0a1f36",
                  }}
                  onFocus={(e) => {
                    if (!errors.password) {
                      e.target.style.background = "rgba(255,255,255,0.9)";
                      e.target.style.borderColor = "#0f4c81";
                    }
                    e.target.style.boxShadow = "0 0 0 3px rgba(15,76,129,0.08)";
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = "none";
                    if (!errors.password) {
                      e.target.style.background = "rgba(15,76,129,0.04)";
                      e.target.style.borderColor = "rgba(15,76,129,0.1)";
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  style={{ fontSize: "1.2rem" }}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.password ? (
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#dc2626", marginTop: "0.5rem" }}>
                  ⚠️ {errors.password}
                </p>
              ) : (
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.75rem",
                    color: "#64748b",
                    marginTop: "0.5rem",
                  }}
                >
                  Min 8 characters, 1 uppercase, 1 lowercase, 1 number
                </p>
              )}
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-semibold text-white mt-2"
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: "0.95rem",
                background: isLoading
                  ? "rgba(15,76,129,0.5)"
                  : "linear-gradient(135deg, #0f4c81 0%, #1a7a5e 100%)",
                boxShadow: isLoading
                  ? "none"
                  : "0 8px 24px rgba(15,76,129,0.3)",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
              whileHover={!isLoading ? { scale: 1.02, y: -1 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                  />
                  Creating account...
                </span>
              ) : (
                "Sign Up"
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div
              className="absolute inset-0 flex items-center"
            >
              <div
                className="w-full border-t"
                style={{ borderColor: "rgba(15,76,129,0.1)" }}
              />
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className="px-4"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background: "rgba(255,255,255,0.85)",
                  color: "#64748b",
                }}
              >
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login link */}
          <Link href="/login">
            <motion.button
              className="w-full py-3.5 rounded-xl font-semibold"
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: "0.95rem",
                color: "#0f4c81",
                background: "rgba(15,76,129,0.06)",
                border: "1.5px solid rgba(15,76,129,0.15)",
              }}
              whileHover={{
                background: "rgba(15,76,129,0.1)",
                borderColor: "rgba(15,76,129,0.3)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              Log In Instead
            </motion.button>
          </Link>
        </div>

        {/* Back to home */}
        <Link href="/">
          <motion.p
            className="text-center mt-6"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.85rem",
              color: "#64748b",
            }}
            whileHover={{ color: "#0f4c81" }}
          >
            ← Back to Home
          </motion.p>
        </Link>
      </motion.div>
    </section>
  );
}