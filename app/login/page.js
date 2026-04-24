"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex flex-col justify-center lg:flex-row"
      style={{
        fontFamily: "'Sora', 'DM Sans', sans-serif",
        background: "linear-gradient(160deg, #f0f7ff 0%, #e8f8f2 50%, #f5fbff 100%)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .vd-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1.5px solid rgba(15, 76, 129, 0.15);
          background: rgba(255, 255, 255, 0.8);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          color: #0a1f36;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .vd-input::placeholder { color: #94afc8; }
        .vd-input:focus {
          border-color: rgba(15, 76, 129, 0.45);
          box-shadow: 0 0 0 3px rgba(15, 76, 129, 0.07);
        }

        .vd-btn-primary {
          width: 100%;
          padding: 0.78rem 1rem;
          border-radius: 0.75rem;
          border: none;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          font-weight: 600;
          font-size: 0.92rem;
          letter-spacing: 0.01em;
          color: #fff;
          background: linear-gradient(135deg, #0f4c81 0%, #1a7a5e 100%);
          box-shadow: 0 6px 20px rgba(15, 76, 129, 0.28);
          transition: opacity 0.2s, box-shadow 0.2s, transform 0.15s;
        }
        .vd-btn-primary:hover {
          opacity: 0.93;
          box-shadow: 0 8px 26px rgba(15, 76, 129, 0.36);
          transform: translateY(-1px);
        }
        .vd-btn-primary:active { transform: translateY(0); }

        .vd-divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #94afc8;
          font-size: 0.78rem;
          font-family: 'DM Sans', sans-serif;
        }
        .vd-divider::before,
        .vd-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(15, 76, 129, 0.1);
        }

        .vd-social-btn {
          width: 100%;
          padding: 0.72rem 1rem;
          border-radius: 0.75rem;
          border: 1.5px solid rgba(15, 76, 129, 0.13);
          background: rgba(255, 255, 255, 0.75);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 0.88rem;
          color: #1e3a5f;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          transition: background 0.18s, border-color 0.18s;
        }
        .vd-social-btn:hover {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(15, 76, 129, 0.25);
        }
      `}</style>

      {/* Left panel — branding (desktop only) */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 xl:p-16"
        style={{
          background: "linear-gradient(145deg, #0f4c81 0%, #1a7a5e 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            width: 420,
            height: 420,
            borderRadius: "50%",
            top: "-80px",
            right: "-120px",
            background: "rgba(255,255,255,0.04)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: "50%",
            bottom: "60px",
            left: "-80px",
            background: "rgba(255,255,255,0.04)",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <svg width="32" height="20" viewBox="0 0 120 60" fill="none">
            <path
              d="M0 38 L20 38 L28 10 L38 52 L48 24 L56 38 L68 38 L76 20 L84 44 L90 30 L100 30 L120 30"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700,
              fontSize: "1.2rem",
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            Vital<span style={{ fontWeight: 300, opacity: 0.8 }}>Decode</span>
          </span>
        </div>

        {/* Center quote */}
        <div className="relative z-10">
          <p
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1.6rem, 2.5vw, 2.1rem)",
              lineHeight: 1.2,
              color: "white",
              letterSpacing: "-0.02em",
              marginBottom: "1.2rem",
            }}
          >
            Your health data,
            <br />
            <span style={{ opacity: 0.65, fontWeight: 300 }}>decoded for you.</span>
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.65,
              maxWidth: 320,
            }}
          >
            Understand every line of your medical reports with AI clarity — no medical degree required.
          </p>
        </div>

        {/* Bottom trust badges */}
        <div className="relative z-10 flex gap-6">
          {["HIPAA Secure", "256-bit SSL", "SOC 2 Type II"].map((badge) => (
            <div key={badge} className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
                {badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form (mobile + desktop) */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-12 lg:py-0">
        <div className="w-full max-w-md lg:max-w-lg">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 sm:mb-10">
            <svg width="26" height="16" viewBox="0 0 120 60" fill="none">
              <path d="M0 38 L20 38 L28 10 L38 52 L48 24 L56 38 L68 38 L76 20 L84 44 L90 30 L100 30 L120 30" stroke="#0f4c81" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#0a1f36", letterSpacing: "-0.02em" }}>
              Vital<span style={{ fontWeight: 300, color: "#3d5a7a" }}>Decode</span>
            </span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: "2rem" }}>
            <h1
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 700,
                fontSize: "1.75rem",
                color: "#0a1f36",
                letterSpacing: "-0.025em",
                marginBottom: "0.4rem",
              }}
            >
              Welcome back
            </h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#5a7fa0" }}>
              Sign in to your VitalDecode account
            </p>
          </div>

          {/* Social login */}
          <button className="vd-social-btn" style={{ marginBottom: "1.2rem" }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="vd-divider" style={{ marginBottom: "1.2rem" }}>or</div>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.4rem" }}>
            <div>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 600, color: "#1e3a5f", display: "block", marginBottom: "0.4rem", letterSpacing: "0.02em" }}>
                Email address
              </label>
              <input type="email" placeholder="you@example.com" className="vd-input" />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 600, color: "#1e3a5f", letterSpacing: "0.02em" }}>
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "#0f4c81", textDecoration: "none", fontWeight: 500 }}
                >
                  Forgot password?
                </Link>
              </div>
              <input type="password" placeholder="••••••••" className="vd-input" />
            </div>
          </div>

          <button className="vd-btn-primary" style={{ marginBottom: "1.5rem" }}>
            Sign in
          </button>

          {/* Sign up link */}
          <p style={{ textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#5a7fa0" }}>
            Don't have an account?{" "}
            <Link
              href="/signup"
              style={{ color: "#0f4c81", fontWeight: 600, textDecoration: "none" }}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}