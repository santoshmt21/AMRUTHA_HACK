"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext.js";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

const NavIcons = {
  home: (a) => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill={a?"white":"none"} stroke={a?"white":"rgba(255,255,255,0.6)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  heart: (a) => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill={a?"white":"none"} stroke={a?"white":"rgba(255,255,255,0.6)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  upload: (a) => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={a?"white":"rgba(255,255,255,0.6)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
    </svg>
  ),
  book: (a) => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={a?"white":"rgba(255,255,255,0.6)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  star: (a) => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill={a?"white":"none"} stroke={a?"white":"rgba(255,255,255,0.6)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  file: (a) => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={a?"white":"rgba(255,255,255,0.6)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  card: (a) => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={a?"white":"rgba(255,255,255,0.6)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  user: (a) => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={a?"white":"rgba(255,255,255,0.6)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
};

const navItems = [
  { id: "home",      icon: "home",   label: "Home" },
  { id: "health",    icon: "heart",  label: "Health" },
  { id: "upload",    icon: "upload", label: "Upload" },
  { id: "library",   icon: "book",   label: "Library" },
  { id: "bioage",    icon: "star",   label: "BioAge" },
  { id: "reports",   icon: "file",   label: "Reports" },
  { id: "insurance", icon: "card",   label: "Insurance" },
  { id: "profile",   icon: "user",   label: "Profile" },
];

const card = {
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 4px 24px rgba(15,76,129,0.08)",
  borderRadius: 18,
};

// ─── Mini Calendar ────────────────────────────────────────────────────────────
function MiniCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(today.getDate());

  const MONTHS = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];
  const DAYS = ["Mo","Tu","We","Th","Fr","Sa","Su"];

  const firstDay = () => { const d = new Date(year, month, 1).getDay(); return d === 0 ? 6 : d - 1; };
  const daysInMonth = () => new Date(year, month + 1, 0).getDate();
  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); setSelected(null); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); setSelected(null); };
  const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const cells = [];
  const offset = firstDay();
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth(); d++) cells.push(d);

  return (
    <div style={{ padding:"14px 12px 10px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
        <button onClick={prev} style={{ background:"none", border:"none", cursor:"pointer", width:24, height:24, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:6, color:"#3d5a7a" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.78rem", color:"#0a1f36", letterSpacing:"-0.01em" }}>
          {MONTHS[month]} {year}
        </span>
        <button onClick={next} style={{ background:"none", border:"none", cursor:"pointer", width:24, height:24, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:6, color:"#3d5a7a" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:4 }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign:"center", fontFamily:"'DM Sans',sans-serif", fontSize:"0.6rem", fontWeight:700, color:"#5a7fa0", padding:"2px 0", letterSpacing:"0.04em" }}>{d}</div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
        {cells.map((d, i) => (
          <button key={i} onClick={() => d && setSelected(d)} disabled={!d} style={{
            border:"none", cursor: d ? "pointer" : "default",
            padding:"5px 0", borderRadius:7, textAlign:"center",
            fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem",
            fontWeight: selected===d ? 700 : isToday(d) ? 600 : 400,
            color: !d ? "transparent" : selected===d ? "white" : isToday(d) ? "#0f4c81" : "#1e3a5f",
            background: !d ? "transparent" : selected===d ? "linear-gradient(135deg,#0f4c81,#1a7a5e)" : isToday(d) ? "rgba(15,76,129,0.09)" : "transparent",
            boxShadow: selected===d ? "0 2px 8px rgba(15,76,129,0.28)" : "none",
            transition:"all 0.15s",
          }}>{d || ""}</button>
        ))}
      </div>
    </div>
  );
}

// ─── RIGHT PANEL CONTENT ──────────────────────────────────────────────────────
function PanelHome() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.78rem", color:"#0a1f36" }}>Quick Stats</p>
      {[
        { label:"Reports decoded", value:"14", color:"#0f4c81" },
        { label:"Biomarkers tracked", value:"38", color:"#1a7a5e" },
        { label:"Streak", value:"7 days", color:"#22c78a" },
      ].map(s => (
        <div key={s.label} style={{ ...card, padding:"12px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.75rem", color:"#3d5a7a" }}>{s.label}</span>
          <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.85rem", color:s.color }}>{s.value}</span>
        </div>
      ))}
    </div>
  );
}

function PanelHealth() {
  const metrics = [
    { label:"Blood Glucose", value:"94 mg/dL", status:"normal",    statusColor:"#22c55e" },
    { label:"HbA1c",         value:"5.4%",      status:"optimal",   statusColor:"#06b6d4" },
    { label:"LDL",           value:"112 mg/dL", status:"borderline",statusColor:"#f59e0b" },
    { label:"Blood Pressure",value:"118/76",    status:"normal",    statusColor:"#22c55e" },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.78rem", color:"#0a1f36" }}>Latest Biomarkers</p>
      {metrics.map(m => (
        <div key={m.label} style={{ ...card, padding:"11px 14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.73rem", fontWeight:600, color:"#1e3a5f" }}>{m.label}</span>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", fontWeight:700, color:m.statusColor, background:`${m.statusColor}18`, padding:"2px 7px", borderRadius:99 }}>{m.status}</span>
          </div>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.78rem", fontWeight:600, color:m.statusColor }}>{m.value}</span>
        </div>
      ))}
    </div>
  );
}

function PanelUpload() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.78rem", color:"#0a1f36" }}>Upload Report</p>
      <div style={{ ...card, padding:"20px 14px", display:"flex", flexDirection:"column", alignItems:"center", gap:10, textAlign:"center", background:"linear-gradient(135deg,rgba(15,76,129,0.04),rgba(26,122,94,0.04))", border:"1.5px dashed rgba(15,76,129,0.2)" }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(15,76,129,0.4)" strokeWidth="1.5">
          <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
          <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
        </svg>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.75rem", color:"#5a7fa0", lineHeight:1.5 }}>Drag &amp; drop your PDF<br/>or blood panel image</p>
        <button style={{ padding:"7px 18px", borderRadius:9, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#0f4c81,#1a7a5e)", color:"white", fontFamily:"'Sora',sans-serif", fontWeight:600, fontSize:"0.75rem", boxShadow:"0 4px 14px rgba(15,76,129,0.25)" }}>Browse files</button>
      </div>
      <div style={{ ...card, padding:"10px 14px" }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", fontWeight:600, color:"#1e3a5f", marginBottom:6 }}>Recent uploads</p>
        {["Blood Panel Apr 2025.pdf","Thyroid Report Feb 2025.pdf"].map(f => (
          <div key={f} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0", borderBottom:"1px solid rgba(15,76,129,0.06)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0f4c81" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.68rem", color:"#3d5a7a", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PanelLibrary() {
  const articles = [
    { title:"Understanding HbA1c", tag:"Diabetes", color:"#0f4c81" },
    { title:"LDL vs HDL explained", tag:"Cardio", color:"#1a7a5e" },
    { title:"Iron deficiency signs", tag:"Nutrition", color:"#22c78a" },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.78rem", color:"#0a1f36" }}>Health Library</p>
      {articles.map(a => (
        <div key={a.title} style={{ ...card, padding:"12px 14px", cursor:"pointer" }}>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", fontWeight:700, color:a.color, background:`${a.color}12`, padding:"2px 7px", borderRadius:99, marginBottom:6, display:"inline-block" }}>{a.tag}</span>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", fontWeight:600, color:"#1e3a5f", marginTop:5 }}>{a.title}</p>
        </div>
      ))}
    </div>
  );
}

function PanelBioAge() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.78rem", color:"#0a1f36" }}>Your Biological Age</p>
      <div style={{ ...card, padding:"18px 14px", textAlign:"center" }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", color:"#5a7fa0", marginBottom:6 }}>Estimated BioAge</p>
        <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"2.2rem", color:"#0f4c81", letterSpacing:"-0.03em", lineHeight:1 }}>21</p>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.68rem", color:"#22c78a", fontWeight:600, marginTop:4 }}>2 years younger than chronological</p>
      </div>
      <div style={{ ...card, padding:"12px 14px" }}>
        {[{ label:"Metabolic score", pct:82 }, { label:"Inflammation", pct:68 }, { label:"Cardiovascular", pct:91 }].map(s => (
          <div key={s.label} style={{ marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", color:"#3d5a7a" }}>{s.label}</span>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.68rem", color:"#0f4c81", fontWeight:600 }}>{s.pct}%</span>
            </div>
            <div style={{ height:4, borderRadius:99, background:"rgba(15,76,129,0.08)" }}>
              <div style={{ height:"100%", borderRadius:99, width:`${s.pct}%`, background:"linear-gradient(90deg,#0f4c81,#22c78a)" }}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PanelReports() {
  const reports = [
    { name:"Annual Blood Panel", date:"Apr 2025", status:"Decoded" },
    { name:"Vitamin Panel", date:"Mar 2025", status:"Decoded" },
    { name:"Thyroid Function", date:"Feb 2025", status:"Decoded" },
    { name:"CBC Report", date:"Jan 2025", status:"Pending" },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.78rem", color:"#0a1f36" }}>My Reports</p>
      {reports.map(r => (
        <div key={r.name} style={{ ...card, padding:"11px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}>
          <div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.76rem", fontWeight:600, color:"#1e3a5f" }}>{r.name}</p>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", color:"#5a7fa0" }}>{r.date}</p>
          </div>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", fontWeight:700, color:r.status==="Decoded"?"#1a7a5e":"#f59e0b", background:r.status==="Decoded"?"rgba(26,122,94,0.1)":"rgba(245,158,11,0.1)", padding:"2px 8px", borderRadius:99 }}>{r.status}</span>
        </div>
      ))}
    </div>
  );
}

function PanelInsurance() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.78rem", color:"#0a1f36" }}>Insurance</p>
      <div style={{ ...card, padding:"12px 14px" }}>
        {[{ label:"Provider", value:"BlueCross" }, { label:"Plan", value:"Gold PPO" }, { label:"Member ID", value:"BC-28471" }, { label:"Group No.", value:"GRP-5541" }, { label:"Expires", value:"Dec 2026" }].map(f => (
          <div key={f.label} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid rgba(15,76,129,0.05)" }}>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.68rem", color:"#5a7fa0" }}>{f.label}</span>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", fontWeight:600, color:"#1e3a5f" }}>{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PanelProfile() {
  const { user } = useAuth();
  const profileFields = [
    { label:"Date of birth", value:user?.dob || "Jan 12, 2003" },
    { label:"Blood type", value:user?.bloodType || "A+" },
    { label:"Height", value:user?.height ? `${user.height} cm` : "175.5 cm" },
    { label:"Weight", value:user?.weight ? `${user.weight} kg` : "52 kg" },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.78rem", color:"#0a1f36" }}>Profile</p>
      {profileFields.map(f => (
        <div key={f.label} style={{ ...card, padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", color:"#5a7fa0" }}>{f.label}</span>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.76rem", fontWeight:600, color:"#1e3a5f" }}>{f.value}</span>
        </div>
      ))}
    </div>
  );
}

const rightPanelContent = {
  home: PanelHome,
  health: PanelHealth,
  upload: PanelUpload,
  library: PanelLibrary,
  bioage: PanelBioAge,
  reports: PanelReports,
  insurance: PanelInsurance,
  profile: PanelProfile,
};

// ─── CENTER CONTENT VIEWS ─────────────────────────────────────────────────────

function CenterHome({ setActiveNav }) {
  const { user } = useAuth();
  const displayName = user?.name || "Guest";
  const summaryFields = [
    { label:"Sex", value:user?.sex || "Male" },
    { label:"Age", value:user?.age ? `${user.age} y/o` : "23 y/o" },
    { label:"Height", value:user?.height ? `${user.height} cm` : "175.5 cm" },
    { label:"Weight", value:user?.weight ? `${user.weight} kg` : "52 kg" },
    { label:"Blood type", value:user?.bloodType || "A+" },
  ];

  return (
    <div style={{ padding:"20px 24px 28px" }}>
      {/* Patient header */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
        style={{ ...card, padding:"18px 22px", marginBottom:18, display:"flex", alignItems:"center", gap:18, flexWrap:"wrap", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:0, top:0, width:160, height:"100%", background:"linear-gradient(270deg,rgba(15,76,129,0.04),transparent)", borderRadius:"0 18px 18px 0" }}/>
        <div style={{ width:60, height:60, borderRadius:"50%", background:"linear-gradient(135deg,#0f4c81,#1a7a5e)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.3rem", color:"white" }}>{displayName.charAt(0).toUpperCase()}</span>
        </div>
        <div style={{ flex:1 }}>
          <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.96rem", color:"#0a1f36", marginBottom:8 }}>Hello, {displayName} 👋</p>
          <div style={{ display:"flex", gap:22, flexWrap:"wrap" }}>
            {summaryFields.map(s => (
              <div key={s.label}>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.6rem", color:"#5a7fa0", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:2 }}>{s.label}</p>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.82rem", color:"#1e3a5f", fontWeight:600 }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:12, marginBottom:18 }}>
        {[
          { icon:"💊", label:"Pills schedule", sub:"View your medications", nav:"health" },
          { icon:"📄", label:"My reports", sub:"View your files", nav:"reports" },
          { icon:"🩺", label:"My consultation", sub:"Past consultations", nav:"health" },
        ].map((qc, i) => (
          <motion.div key={qc.label} custom={i+1} variants={fadeUp} initial="hidden" animate="visible"
            whileHover={{ y:-3, boxShadow:"0 14px 32px rgba(15,76,129,0.13)" }}
            onClick={() => setActiveNav(qc.nav)}
            style={{ ...card, padding:"18px 16px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"flex-start", gap:10, minHeight:110 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,rgba(15,76,129,0.1),rgba(26,122,94,0.08))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem" }}>{qc.icon}</div>
            <div>
              <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.8rem", color:"#0a1f36", marginBottom:2 }}>{qc.label}</p>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", color:"#5a7fa0" }}>{qc.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom */}
      <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
          style={{ flex:"0 0 300px", minWidth:240, ...card, background:"linear-gradient(135deg,rgba(15,76,129,0.05),rgba(26,122,94,0.04))", border:"1px solid rgba(15,76,129,0.1)", padding:"22px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%", background:"radial-gradient(circle,rgba(34,199,138,0.1) 0%,transparent 70%)" }}/>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#1a7a5e" }}>COMMUNITY</span>
          <h3 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"1.05rem", color:"#0a1f36", marginTop:6, lineHeight:1.3 }}>Join our medicine volunteer</h3>
          <div style={{ display:"flex", gap:28, marginTop:14, flexWrap:"wrap" }}>
            {[{ head:"PLACE", dot:"#ef4444", val:"Monday" }, { head:"TIME", dot:"#0f4c81", val:"3 pm" }, { head:"GOALS", dot:"#f97316", val:"Help people" }, { head:"CONDITION", dot:"#22c55e", val:"Be available" }].map(i => (
              <div key={i.head}>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.6rem", fontWeight:700, color:"#5a7fa0", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>{i.head}</p>
                <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <span style={{ width:7, height:7, borderRadius:"50%", background:i.dot, display:"inline-block" }}/>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", color:"#1e3a5f", fontWeight:500 }}>{i.val}</span>
                </div>
              </div>
            ))}
          </div>
          <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} style={{ width:"100%", marginTop:18, padding:"11px", borderRadius:11, border:"none", background:"linear-gradient(135deg,#0f4c81,#1a7a5e)", color:"white", fontFamily:"'Sora',sans-serif", fontWeight:600, fontSize:"0.84rem", cursor:"pointer", boxShadow:"0 4px 14px rgba(15,76,129,0.28)" }}>Join</motion.button>
        </motion.div>

        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible"
          style={{ flex:1, minWidth:240, ...card, padding:"18px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.86rem", color:"#0a1f36" }}>Upcoming</span>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", color:"#0f4c81", cursor:"pointer", fontWeight:600 }}>View all →</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"28px 0", gap:10 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:"linear-gradient(135deg,rgba(15,76,129,0.07),rgba(26,122,94,0.07))", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(15,76,129,0.4)" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", color:"#5a7fa0", textAlign:"center" }}>No upcoming appointments</p>
            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              style={{ marginTop:6, padding:"8px 18px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#0f4c81,#1a7a5e)", color:"white", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:"0.76rem", cursor:"pointer", boxShadow:"0 4px 12px rgba(15,76,129,0.22)" }}>
              + Book Appointment
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── HEALTH DASHBOARD (Image 8) ───────────────────────────────────────────────
function CenterHealth() {
  const [period, setPeriod] = useState("7D");
  const [reportFile, setReportFile] = useState(null);
  const [isDraggingReport, setIsDraggingReport] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportLoadMessage, setReportLoadMessage] = useState("");
  const [reportError, setReportError] = useState("");
  const [reportResult, setReportResult] = useState(null);
  const [reportSearch, setReportSearch] = useState("");
  const [reportStatusFilter, setReportStatusFilter] = useState("All");
  const reportInputRef = useRef(null);
  const vitals = [
    { label:"Heart Rate", value:"74", unit:"bpm", status:"Normal", statusColor:"#22c55e", icon:"❤️", emoji:"💓" },
    { label:"Blood Pressure", value:"122/80", unit:"mmHg", status:"Stage 1 HTN", statusColor:"#f59e0b", icon:"🫀", emoji:"🫀" },
    { label:"Weight", value:"68.3", unit:"kg", status:"Underweight", statusColor:"#f59e0b", icon:"⚖️", emoji:"⚖️" },
    { label:"Oxygen Level", value:"98", unit:"%", status:"Excellent", statusColor:"#22c55e", icon:"💧", emoji:"🫁" },
  ];
  const bodyMetrics = [
    { label:"Height", value:"178 cm", pct:85, color:"#ef4444" },
    { label:"BMI", value:"23.7", pct:72, color:"#22c55e" },
    { label:"Body Fat", value:"18.5%", pct:60, color:"#f59e0b" },
    { label:"Muscle Mass", value:"62.0 kg", pct:78, color:"#8b5cf6" },
    { label:"Water %", value:"58.0%", pct:75, color:"#06b6d4" },
  ];

  // Simple sparkline path generator
  const sparkPath = (pts, w=120, h=32) => {
    const xs = pts.map((_, i) => (i/(pts.length-1))*w);
    const min = Math.min(...pts), max = Math.max(...pts);
    const ys = pts.map(p => h - ((p-min)/(max-min||1))*h);
    return xs.map((x,i) => `${i===0?"M":"L"}${x},${ys[i]}`).join(" ");
  };

  const handleReportFile = (file) => {
    setReportFile(file || null);
    setReportError("");
    setReportResult(null);
    setReportSearch("");
    setReportStatusFilter("All");
  };

  const analyzeHealthReport = async () => {
    if (!reportFile) {
      setReportError("Please upload a file first.");
      return;
    }

    setReportLoading(true);
    setReportError("");
    setReportResult(null);

    let step = 0;
    setReportLoadMessage(healthLoadMessages[0]);
    const interval = setInterval(() => {
      step = Math.min(step + 1, healthLoadMessages.length - 1);
      setReportLoadMessage(healthLoadMessages[step]);
    }, 1600);

    try {
      const base64 = await fileToBase64(reportFile);
      const isImage = reportFile.type.startsWith("image/");
      const isPdf = reportFile.type === "application/pdf";
      let messages;

      if (isImage) {
        messages = [{
          role: "user",
          content: [
            { type: "image_url", image_url: { url: `data:${reportFile.type};base64,${base64}` } },
            { type: "text", text: HEALTH_EXTRACT_PROMPT },
          ],
        }];
      } else if (isPdf) {
        messages = [{
          role: "user",
          content: [
            {
              type: "text",
              text: `${HEALTH_EXTRACT_PROMPT}\n\nThis is the raw base64 content of a PDF medical report. Decode and analyze it:\n${base64.substring(0, 8000)}`,
            },
          ],
        }];
      } else {
        const text = await reportFile.text().catch(() => "Could not read file as text.");
        messages = [{ role: "user", content: `${HEALTH_EXTRACT_PROMPT}\n\nDocument text:\n${text}` }];
      }

      const raw = await callOpenRouter(messages, 4000);
      const cleaned = String(raw || "").replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        const match = cleaned.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
        else throw new Error("Model returned non-JSON response. Try a clearer image or PDF.");
      }

      if (!Array.isArray(parsed?.parameters)) {
        parsed.parameters = [];
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Session expired. Please login again.");
      }

      const storeResponse = await fetch("/api/blood-det", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: parsed?.patientInfo?.date || new Date().toISOString(),
          parameters: (parsed.parameters || []).map((p) => ({
            name: p?.name,
            value: p?.value,
          })),
        }),
      });

      const storeData = await storeResponse.json();
      if (!storeResponse.ok) {
        throw new Error(storeData?.error || "Failed to store BLOOD_DET rows");
      }

      setReportResult(parsed);
    } catch (error) {
      setReportError(error?.message || "Unknown error while analyzing report.");
    } finally {
      clearInterval(interval);
      setReportLoading(false);
    }
  };

  const filteredHealthParameters = (reportResult?.parameters || []).filter((p) => {
    const name = String(p?.name || "").toLowerCase();
    const value = String(p?.value || "").toLowerCase();
    const query = reportSearch.toLowerCase();
    const matchSearch = name.includes(query) || value.includes(query);
    const matchStatus =
      reportStatusFilter === "All" ||
      String(p?.status || "").toLowerCase() === reportStatusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const healthStatusCounts = (reportResult?.parameters || []).reduce((acc, p) => {
    const status = String(p?.status || "Unknown");
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ padding:"20px 24px 28px" }}>
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
        style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <div>
          <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.3rem", color:"#0a1f36" }}>Health Dashboard</h2>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", color:"#5a7fa0" }}>Track your vital signs and health metrics</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {["7D","30D","90D"].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding:"6px 14px", borderRadius:8, border:"none", cursor:"pointer",
              background: period===p ? "linear-gradient(135deg,#0f4c81,#1a7a5e)" : "rgba(15,76,129,0.07)",
              color: period===p ? "white" : "#5a7fa0",
              fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:"0.75rem",
            }}>{p}</button>
          ))}
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} style={{ padding:"6px 14px", borderRadius:8, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#0f4c81,#1a7a5e)", color:"white", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:"0.75rem", boxShadow:"0 3px 10px rgba(15,76,129,0.25)" }}>
            + Add Reading
          </motion.button>
        </div>
      </motion.div>

      {/* Upload report card */}
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingReport(true);
        }}
        onDragLeave={() => setIsDraggingReport(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDraggingReport(false);
          handleReportFile(e.dataTransfer.files?.[0]);
        }}
        onClick={() => reportInputRef.current?.click()}
        style={{
          ...card,
          marginBottom:18,
          padding:"42px 20px",
          minHeight:220,
          display:"flex",
          flexDirection:"column",
          alignItems:"center",
          justifyContent:"center",
          gap:12,
          textAlign:"center",
          cursor:"pointer",
          border:`1.5px dashed ${isDraggingReport ? "#0f4c81" : "rgba(15,76,129,0.2)"}`,
          background:isDraggingReport ? "rgba(15,76,129,0.04)" : "rgba(255,255,255,0.72)",
        }}>
        <input
          ref={reportInputRef}
          type="file"
          accept="image/*,.pdf,.docx,.txt"
          style={{ display:"none" }}
          onChange={(e) => handleReportFile(e.target.files?.[0])}
        />
        <div style={{ width:64, height:64, borderRadius:999, background:"rgba(34,199,138,0.22)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1a7a5e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 16 12 12 8 16"/>
            <line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
          </svg>
        </div>
        <div>
          <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"1rem", color:"#0a1f36", marginBottom:4 }}>Drop your medical report here</p>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.75rem", color:"#5a7fa0" }}>Blood reports · MRI · X-ray · Pregnancy scans · ECG · Any medical document</p>
        </div>
      </motion.div>

      {reportFile && (
        <div style={{ ...card, marginBottom:18, padding:"12px 14px", display:"flex", alignItems:"center", gap:10, background:"rgba(34,197,94,0.07)", border:"1px solid rgba(34,197,94,0.25)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f4c81" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.75rem", color:"#1e3a5f", fontWeight:600, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {reportFile.name} ({(reportFile.size / 1024).toFixed(0)} KB)
          </span>
          <button onClick={(e) => { e.stopPropagation(); handleReportFile(null); }} style={{ border:"none", background:"none", cursor:"pointer", color:"#64748b", fontSize:"0.95rem" }}>x</button>
        </div>
      )}

      <button
        onClick={analyzeHealthReport}
        disabled={!reportFile || reportLoading}
        style={{
          width:"100%",
          marginBottom:18,
          padding:"13px 16px",
          borderRadius:14,
          border:"none",
          cursor: reportFile && !reportLoading ? "pointer" : "not-allowed",
          background: reportFile && !reportLoading ? "linear-gradient(135deg,#0f4c81,#1a7a5e)" : "#9ca3af",
          color:"white",
          fontFamily:"'Sora',sans-serif",
          fontWeight:700,
          fontSize:"0.88rem",
          boxShadow: reportFile && !reportLoading ? "0 4px 14px rgba(15,76,129,0.25)" : "none",
        }}
      >
        {reportLoading ? reportLoadMessage || "Analyzing..." : "Analyze Report"}
      </button>

      {reportError && (
        <div style={{ ...card, marginBottom:18, padding:"12px 14px", border:"1px solid rgba(239,68,68,0.3)", background:"rgba(254,226,226,0.75)" }}>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.74rem", color:"#b91c1c", fontWeight:600 }}>{reportError}</p>
        </div>
      )}

      {reportResult && (
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" style={{ ...card, marginBottom:18, padding:"16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, flexWrap:"wrap", marginBottom:10 }}>
            <div>
              <h3 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.95rem", color:"#0a1f36" }}>
                {reportResult.reportTitle || "Medical Report"}
              </h3>
              {reportResult.patientInfo && (
                <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginTop:4 }}>
                  {Object.entries(reportResult.patientInfo)
                    .filter(([, value]) => value)
                    .map(([key, value]) => (
                      <span key={key} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", color:"#64748b" }}>
                        <span style={{ textTransform:"capitalize", color:"#475569" }}>{key}:</span> {value}
                      </span>
                    ))}
                </div>
              )}
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {Object.entries(healthStatusCounts).map(([status, count]) => {
                const c = healthStatusColor(status);
                return (
                  <span key={status} style={{ background:c.bg, border:`1px solid ${c.border}`, borderRadius:999, padding:"4px 10px", fontFamily:"'DM Sans',sans-serif", fontSize:"0.67rem", fontWeight:700, color:c.text }}>
                    {status}: {count}
                  </span>
                );
              })}
            </div>
          </div>

          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:10 }}>
            <input
              value={reportSearch}
              onChange={(e) => setReportSearch(e.target.value)}
              placeholder="Search parameters"
              style={{ flex:1, minWidth:180, padding:"8px 10px", borderRadius:8, border:"1px solid rgba(15,76,129,0.2)", fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", color:"#1e3a5f", background:"rgba(255,255,255,0.9)", outline:"none" }}
            />
            {[
              "All",
              "Normal",
              "High",
              "Low",
              "Critical",
              "Unknown",
            ].map((status) => (
              <button
                key={status}
                onClick={() => setReportStatusFilter(status)}
                style={{
                  padding:"7px 10px",
                  borderRadius:8,
                  cursor:"pointer",
                  fontFamily:"'DM Sans',sans-serif",
                  fontSize:"0.68rem",
                  fontWeight:600,
                  border: reportStatusFilter === status ? "none" : "1px solid rgba(15,76,129,0.2)",
                  background: reportStatusFilter === status ? "linear-gradient(135deg,#0f4c81,#1a7a5e)" : "rgba(255,255,255,0.9)",
                  color: reportStatusFilter === status ? "white" : "#3d5a7a",
                }}
              >
                {status}
              </button>
            ))}
          </div>

          <div style={{ border:"1px solid rgba(15,76,129,0.12)", borderRadius:12, overflow:"hidden" }}>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:700 }}>
                <thead>
                  <tr style={{ background:"rgba(15,76,129,0.06)" }}>
                    {[
                      "Parameter",
                      "Value",
                      "Unit",
                      "Reference Range",
                      "Status",
                    ].map((heading) => (
                      <th key={heading} style={{ textAlign:"left", padding:"10px 12px", fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", textTransform:"uppercase", letterSpacing:"0.06em", color:"#5a7fa0" }}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredHealthParameters.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding:"18px", textAlign:"center", fontFamily:"'DM Sans',sans-serif", fontSize:"0.74rem", color:"#64748b" }}>
                        No parameters match your filter.
                      </td>
                    </tr>
                  ) : (
                    filteredHealthParameters.map((parameter, index) => {
                      const c = healthStatusColor(parameter?.status);
                      return (
                        <tr key={`${parameter?.name || "param"}-${index}`} style={{ borderTop:"1px solid rgba(15,76,129,0.08)", background:index % 2 === 0 ? "rgba(255,255,255,0.55)" : "rgba(248,250,252,0.92)" }}>
                          <td style={{ padding:"10px 12px", fontFamily:"'DM Sans',sans-serif", fontSize:"0.74rem", color:"#1e3a5f", fontWeight:600 }}>{parameter?.name || "-"}</td>
                          <td style={{ padding:"10px 12px", fontFamily:"'DM Mono',monospace", fontSize:"0.72rem", color:c.text, fontWeight:700 }}>{parameter?.value ?? "-"}</td>
                          <td style={{ padding:"10px 12px", fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", color:"#475569" }}>{parameter?.unit || "-"}</td>
                          <td style={{ padding:"10px 12px", fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", color:"#475569" }}>{parameter?.referenceRange || "-"}</td>
                          <td style={{ padding:"10px 12px" }}>
                            <span style={{ background:c.bg, border:`1px solid ${c.border}`, borderRadius:999, padding:"2px 8px", fontFamily:"'DM Sans',sans-serif", fontSize:"0.66rem", fontWeight:700, color:c.text, textTransform:"uppercase" }}>
                              {parameter?.status || "Unknown"}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Vitals row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12, marginBottom:18 }}>
        {vitals.map((v, i) => (
          <motion.div key={v.label} custom={i+1} variants={fadeUp} initial="hidden" animate="visible"
            style={{ ...card, padding:"16px 18px", position:"relative", overflow:"hidden" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", color:"#5a7fa0", fontWeight:500 }}>{v.label}</span>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", fontWeight:700, color:v.statusColor, background:`${v.statusColor}15`, padding:"2px 7px", borderRadius:99 }}>{v.status}</span>
            </div>
            <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:8 }}>
              <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.5rem", color:"#0a1f36" }}>{v.value}</span>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", color:"#5a7fa0" }}>{v.unit}</span>
            </div>
            <svg width="120" height="32" style={{ display:"block" }}>
              <path d={sparkPath([65,68,72,70,74,73,74])} fill="none" stroke={v.statusColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Aging trend + Body metrics */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:14, marginBottom:14 }}>
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible"
          style={{ ...card, padding:"18px 20px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
            <div>
              <h3 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.9rem", color:"#0a1f36" }}>Aging Trend (Chronological vs Biological)</h3>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.68rem", color:"#5a7fa0" }}>Last 7 days</p>
            </div>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", fontWeight:700, color:"#ef4444", background:"rgba(239,68,68,0.1)", padding:"3px 9px", borderRadius:99 }}>Declined 68.8%</span>
          </div>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", color:"#0f4c81", marginBottom:12 }}>Aging gap increased by 68.0% vs previous reading. Current condition needs attention.</p>

          {/* Simple chart */}
          <div style={{ height:100, position:"relative", marginBottom:10 }}>
            <svg width="100%" height="100" viewBox="0 0 500 100" preserveAspectRatio="none">
              <path d="M0,50 L83,49 L166,48 L249,47 L332,46 L415,45 L500,44" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M0,30 L83,34 L166,38 L249,50 L332,60 L415,68 L500,75" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round"/>
              {[0,83,166,249,332,415,500].map((x,i) => <circle key={i} cx={x} cy={50-i} r="4" fill="#3b82f6"/>)}
              {[0,83,166,249,332,415,500].map((x,i) => <circle key={i} cx={x} cy={30+i*7} r="4" fill="#f97316"/>)}
            </svg>
          </div>

          <div style={{ display:"flex", gap:16, marginBottom:12 }}>
            {[{ color:"#3b82f6", label:"Chronological Age" }, { color:"#f97316", label:"Biological Age" }].map(l => (
              <div key={l.label} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ width:10, height:10, borderRadius:"50%", background:l.color, display:"inline-block" }}/>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.68rem", color:"#5a7fa0" }}>{l.label}</span>
              </div>
            ))}
          </div>

          <div style={{ background:"rgba(15,76,129,0.04)", border:"1px solid rgba(15,76,129,0.08)", borderRadius:10, padding:"10px 14px" }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", color:"#0f4c81", fontStyle:"italic" }}>
              Trend Summary: Biological age increased by 16.9 years. This trend needs attention, but with consistent habits you can improve it.
            </p>
          </div>
        </motion.div>

        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible"
          style={{ ...card, padding:"18px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <h3 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.88rem", color:"#0a1f36" }}>Body Metrics</h3>
            <button style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", color:"#0f4c81", border:"1px solid rgba(15,76,129,0.2)", background:"none", borderRadius:7, padding:"4px 10px", cursor:"pointer", fontWeight:600 }}>View Full Report</button>
          </div>
          {bodyMetrics.map(m => (
            <div key={m.label} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", color:"#3d5a7a" }}>{m.label}</span>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.7rem", fontWeight:600, color:"#0a1f36" }}>{m.value}</span>
              </div>
              <div style={{ height:5, borderRadius:99, background:"rgba(15,76,129,0.08)" }}>
                <div style={{ height:"100%", borderRadius:99, width:`${m.pct}%`, background:m.color, transition:"width 0.6s ease" }}/>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Blood Pressure map */}
      <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible"
        style={{ ...card, padding:"18px 20px" }}>
        <h3 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.88rem", color:"#0a1f36", marginBottom:4 }}>Blood Pressure</h3>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.68rem", color:"#5a7fa0", marginBottom:14 }}>Weekly average</p>
        <div style={{ background:"rgba(15,76,129,0.02)", border:"1px solid rgba(15,76,129,0.06)", borderRadius:12, padding:"16px", position:"relative", height:140 }}>
          <div style={{ position:"absolute", top:10, left:10, fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", color:"#5a7fa0", fontWeight:600 }}>Blood Pressure Health Map</div>
          {/* Zones */}
          <div style={{ position:"absolute", top:30, left:60, right:20, bottom:20, borderRadius:8, background:"linear-gradient(135deg,rgba(34,197,94,0.08),rgba(34,197,94,0.04))", border:"1px solid rgba(34,197,94,0.15)" }}/>
          <div style={{ position:"absolute", top:30, right:20, width:"35%", bottom:20, borderRadius:8, background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.15)" }}/>
          <div style={{ position:"absolute", top:50, left:"40%", fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", color:"#ef4444", fontWeight:600 }}>HYPERTENSION</div>
          {/* Data points */}
          {[{ x:"30%", y:"65%", label:"" }, { x:"38%", y:"55%", label:"" }, { x:"45%", y:"45%", label:"STAGE" }].map((p,i) => (
            <div key={i} style={{ position:"absolute", left:p.x, top:p.y, width:10, height:10, borderRadius:"50%", background:"#ef4444", border:"2px solid white", boxShadow:"0 2px 6px rgba(239,68,68,0.4)" }}/>
          ))}
          <div style={{ position:"absolute", bottom:8, left:0, right:0, textAlign:"center", fontFamily:"'DM Sans',sans-serif", fontSize:"0.62rem", color:"#5a7fa0" }}>Diastolic (Bottom Number)</div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── APPOINTMENTS VIEW (Image 2) ──────────────────────────────────────────────
function CenterAppointments() {
  const [view, setView] = useState("Weekly");
  const appointments = [
    { day:"Fri 3", title:"Consultation", location:"New York Health Center", time:"18:00:00", doc:"Dr. Ann Curgy", color:"#fca5a5", textColor:"#991b1b" },
    { day:"Fri 3", title:"Consultation", location:"Mumbai Health Center", time:"13:00:00", doc:"Dr. Arjun Mehta", color:"#bfdbfe", textColor:"#1e40af" },
    { day:"Mon 6", title:"Consultation", location:"New York Health Center", time:"10:00:00", doc:"Dr. Ann Curgy", color:"#fef08a", textColor:"#854d0e" },
    { day:"Mon 6", title:"Consultation", location:"Los Angeles Health Center", time:"20:00:00", doc:"Dr. Alise Prensh", color:"#e9d5ff", textColor:"#6b21a8" },
  ];
  const dayGroups = ["Fri 3","Sat 4","Sun 5","Mon 6"];

  return (
    <div style={{ padding:"20px 24px 28px" }}>
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
        style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button style={{ background:"rgba(15,76,129,0.06)", border:"none", width:28, height:28, borderRadius:7, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3d5a7a" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"1rem", color:"#0a1f36" }}>April, 3 2026</span>
          <div style={{ width:24, height:24, borderRadius:6, border:"1.5px solid rgba(15,76,129,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#3d5a7a" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          {["Daily","Weekly","Monthly"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding:"6px 14px", borderRadius:8, border:"none", cursor:"pointer", background:view===v?"linear-gradient(135deg,#0f4c81,#1a7a5e)":"rgba(15,76,129,0.07)", color:view===v?"white":"#5a7fa0", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:"0.74rem" }}>{v}</button>
          ))}
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} style={{ padding:"6px 14px", borderRadius:8, border:"none", cursor:"pointer", background:"#ef4444", color:"white", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:"0.74rem", boxShadow:"0 3px 10px rgba(239,68,68,0.3)" }}>+ New Appointment</motion.button>
        </div>
      </motion.div>

      {/* Week grid */}
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
        style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {dayGroups.map(day => {
          const dayAppts = appointments.filter(a => a.day === day);
          return (
            <div key={day}>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.75rem", fontWeight:700, color:"#5a7fa0", marginBottom:8, textAlign:"center" }}>
                {day.split(" ")[0]}<br/>
                <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.3rem", color:"#0a1f36" }}>{day.split(" ")[1]}</span>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {dayAppts.length > 0 ? dayAppts.map((a, i) => (
                  <div key={i} style={{ background:a.color, borderRadius:14, padding:"14px", border:`1px solid ${a.color}` }}>
                    <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.82rem", color:a.textColor, marginBottom:3 }}>{a.title}</p>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", color:a.textColor, opacity:0.8, marginBottom:8 }}>{a.location}</p>
                    <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:6 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={a.textColor} strokeWidth="2" opacity="0.7"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.68rem", color:a.textColor, opacity:0.8 }}>{a.time}</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <div style={{ width:18, height:18, borderRadius:"50%", background:a.textColor, opacity:0.5, display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <span style={{ fontFamily:"'Sora',sans-serif", fontSize:"0.55rem", color:"white", fontWeight:700 }}>{a.doc[3]}</span>
                        </div>
                        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", color:a.textColor, fontWeight:600 }}>{a.doc}</span>
                      </div>
                      <span style={{ background:a.textColor, color:"white", fontFamily:"'DM Sans',sans-serif", fontSize:"0.6rem", fontWeight:700, padding:"2px 7px", borderRadius:99 }}>ONLINE</span>
                    </div>
                  </div>
                )) : (
                  <div style={{ height:80, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", color:"#94a3b8" }}>No appointments</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

// ─── UPLOAD / BIO-DATA INGESTION (Image 7) ───────────────────────────────────
const uploadTranslations = {
  en: {
    title: "Medical Report Agent",
    subtitle: "Upload your report | Get AI analysis | Ask questions by voice or text",
    uploadLabel: "Drop your medical report here",
    uploadSub: "Blood reports | MRI | X-ray | Pregnancy scans | ECG | Any medical document",
    analyzeBtn: "Analyze Report",
    analyzing: "Analyzing...",
    welcome: "Report analyzed! Ask me anything about your report.",
    micStart: "Listening... speak now",
    placeholder: "Type your question...",
    readAloud: "Read aloud",
    summaryTitle: "Report Summary",
    chatTitle: "Ask the Agent",
    fileRequired: "Please select a file first",
    thinking: "Thinking...",
  },
  kn: {
    title: "ವೈದ್ಯಕೀಯ ವರದಿ ಸಹಾಯಕ",
    subtitle: "ನಿಮ್ಮ ವರದಿ ಅಪ್ಲೋಡ್ ಮಾಡಿ | AI ವಿಶ್ಲೇಷಣೆ | ಧ್ವನಿ ಅಥವಾ ಪಠ್ಯದಲ್ಲಿ ಪ್ರಶ್ನೆ ಕೇಳಿ",
    uploadLabel: "ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ವರದಿಯನ್ನು ಇಲ್ಲಿ ಹಾಕಿ",
    uploadSub: "ರಕ್ತ ವರದಿ | MRI | X-ray | ಗರ್ಭಾವಸ್ಥೆ ಸ್ಕ್ಯಾನ್ | ECG | ಯಾವುದೇ ವೈದ್ಯಕೀಯ ದಾಖಲೆ",
    analyzeBtn: "ವರದಿ ವಿಶ್ಲೇಷಿಸಿ",
    analyzing: "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
    welcome: "ವರದಿ ವಿಶ್ಲೇಷಿಸಲಾಗಿದೆ! ಈಗ ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಕೇಳಿ.",
    micStart: "ಕೇಳುತ್ತಿದ್ದೇನೆ... ಮಾತನಾಡಿ",
    placeholder: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...",
    readAloud: "ಓದಿ ಕೇಳಿಸಿ",
    summaryTitle: "ವರದಿ ಸಾರಾಂಶ",
    chatTitle: "ಸಹಾಯಕನನ್ನು ಕೇಳಿ",
    fileRequired: "ದಯವಿಟ್ಟು ಮೊದಲು ಫೈಲ್ ಆಯ್ಕೆ ಮಾಡಿ",
    thinking: "ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ...",
  },
};

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function cleanTextForSpeech(text) {
  return String(text || "")
    .replace(/\*+/g, "")
    .replace(/#+/g, "")
    .replace(/_+/g, "")
    .replace(/`+/g, "")
    .replace(/\[|\]/g, "")
    .replace(/\(|\)/g, "")
    .replace(/\-{2,}/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function callOpenRouter(messages, maxTokens = 1200) {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new Error("Missing NEXT_PUBLIC_OPENROUTER_API_KEY in .env.local");
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "",
      "X-Title": "Medical Report Agent",
    },
    body: JSON.stringify({
      model: "openrouter/auto",
      messages,
      max_tokens: maxTokens,
      temperature: 0.3,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "OpenRouter request failed");
  return data?.choices?.[0]?.message?.content || "No response.";
}

function parseStructuredJson(raw) {
  const cleaned = String(raw || "").replace(/```json|```/gi, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const s = cleaned.indexOf("{");
    const e = cleaned.lastIndexOf("}");
    if (s !== -1 && e > s) return JSON.parse(cleaned.slice(s, e + 1));
    throw new Error("Could not parse JSON from model response");
  }
}

function buildExtractionPrompt(lang) {
  const langRule =
    lang === "kn"
      ? "Output language rule: JSON keys must remain in English. All text values must be in Kannada script (except numbers, units, and medical abbreviations)."
      : "Output language rule: Keep JSON keys in English and values in clear English.";

  return `You are an expert medical data extraction system. Extract ALL important structured information from ANY medical document (blood test, MRI, X-ray, ECG, ultrasound, etc.).\n\nReturn STRICT JSON only:\n{\n  "report_type": "",\n  "patient_info": { "name": "", "age": "", "gender": "", "date": "" },\n  "measurements": [{ "name": "", "value": "", "unit": "", "reference_range": "", "status": "" }],\n  "findings": [],\n  "impression": "",\n  "abnormalities": [],\n  "recommendations": []\n}\n\nRules: Extract ALL values. Set status as Low/Normal/High/Abnormal. Return null for missing fields. No extra text outside JSON.\n${langRule}`;
}

function buildStandardSummary(data, lang = "en") {
  const L =
    lang === "kn"
      ? {
          title: "ಪ್ರಮಾಣಿತ ವೈದ್ಯಕೀಯ ವರದಿ ಸಾರಾಂಶ",
          reportType: "ವರದಿ ಪ್ರಕಾರ",
          patientName: "ರೋಗಿಯ ಹೆಸರು",
          age: "ವಯಸ್ಸು",
          gender: "ಲಿಂಗ",
          date: "ದಿನಾಂಕ",
          measurements: "ಮಾಪನಗಳು",
          findings: "ಕಂಡುಬಂದ ಅಂಶಗಳು",
          impression: "ವೈದ್ಯಕೀಯ ಅಭಿಪ್ರಾಯ",
          abnormalities: "ಅಸಾಮಾನ್ಯತೆಗಳು",
          recommendations: "ಶಿಫಾರಸುಗಳು",
          range: "ಮಾನದಂಡ",
          status: "ಸ್ಥಿತಿ",
          missing: "ಲಭ್ಯವಿಲ್ಲ",
        }
      : {
          title: "STANDARD MEDICAL REPORT SUMMARY",
          reportType: "Report Type",
          patientName: "Patient Name",
          age: "Age",
          gender: "Gender",
          date: "Date",
          measurements: "Measurements",
          findings: "Findings",
          impression: "Impression",
          abnormalities: "Abnormalities",
          recommendations: "Recommendations",
          range: "Range",
          status: "Status",
          missing: "N/A",
        };

  const p = data?.patient_info || {};
  const ms = (data?.measurements || []).map(
    (m, i) =>
      `${i + 1}. ${m?.name ?? L.missing}: ${m?.value ?? L.missing} ${m?.unit ?? ""} | ${L.range}: ${m?.reference_range ?? L.missing} | ${L.status}: ${m?.status ?? L.missing}`
  );
  const fs = (data?.findings || []).map((f, i) => `${i + 1}. ${f}`);
  const ab = (data?.abnormalities || []).map((a, i) => `${i + 1}. ${a}`);
  const rc = (data?.recommendations || []).map((r, i) => `${i + 1}. ${r}`);

  return [
    L.title,
    "",
    `${L.reportType}: ${data?.report_type ?? L.missing}`,
    `${L.patientName}: ${p?.name ?? L.missing}`,
    `${L.age}: ${p?.age ?? L.missing}`,
    `${L.gender}: ${p?.gender ?? L.missing}`,
    `${L.date}: ${p?.date ?? L.missing}`,
    "",
    `${L.measurements}:`,
    ...(ms.length ? ms : [`1. ${L.missing}`]),
    "",
    `${L.findings}:`,
    ...(fs.length ? fs : [`1. ${L.missing}`]),
    "",
    `${L.impression}: ${data?.impression ?? L.missing}`,
    "",
    `${L.abnormalities}:`,
    ...(ab.length ? ab : [`1. ${L.missing}`]),
    "",
    `${L.recommendations}:`,
    ...(rc.length ? rc : [`1. ${L.missing}`]),
  ].join("\n");
}

const healthLoadMessages = [
  "Scanning document structure...",
  "Running OCR on medical data...",
  "Identifying test parameters...",
  "Normalizing units and ranges...",
  "Classifying result statuses...",
  "Building diagnostic table...",
];

const HEALTH_EXTRACT_PROMPT = `You are a medical report parser. Extract ALL medical test parameters from this document.

Return ONLY valid JSON (no markdown fences, no explanation) in this exact schema:
{
  "reportTitle": "<inferred report type, e.g. CBC, CMP, Lipid Panel, MRI, etc.>",
  "patientInfo": { "name": null, "age": null, "date": null, "gender": null },
  "parameters": [
    {
      "name": "<full parameter name>",
      "value": "<value>",
      "unit": "<unit or null>",
      "referenceRange": "<range string or null>",
      "status": "<Normal|High|Low|Critical|Unknown>"
    }
  ],
  "rawText": "<full extracted text>"
}

Rules:
- Expand abbreviations: Hb->Hemoglobin, WBC->White Blood Cells, RBC->Red Blood Cells, Plt->Platelets, Hct->Hematocrit, MCH->Mean Corpuscular Hemoglobin, MCHC->Mean Corpuscular Hemoglobin Concentration, MCV->Mean Corpuscular Volume, ESR->Erythrocyte Sedimentation Rate, CRP->C-Reactive Protein, TSH->Thyroid Stimulating Hormone, FT3->Free Triiodothyronine, FT4->Free Thyroxine, Na->Sodium, K->Potassium, Cl->Chloride, BUN->Blood Urea Nitrogen, Cr->Creatinine, eGFR->Estimated GFR, ALT->Alanine Aminotransferase, AST->Aspartate Aminotransferase, ALP->Alkaline Phosphatase, GGT->Gamma-Glutamyl Transferase, LDL->LDL Cholesterol, HDL->HDL Cholesterol, TG->Triglycerides, HbA1c->Glycated Hemoglobin, FBS->Fasting Blood Sugar, PPBS->Post-Prandial Blood Sugar, PT->Prothrombin Time, INR->International Normalized Ratio, aPTT->Activated Partial Thromboplastin Time
- Infer status from the reference range if not explicitly stated
- Ignore headers, patient demographics (put those in patientInfo), and non-parameter text
- If this is an imaging report (MRI/X-ray/ECG/Ultrasound), extract findings as parameters with name=finding, value=description, status based on whether it is normal/abnormal`;

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || "").split(",")[1] || "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function healthStatusColor(status) {
  switch (String(status || "").toLowerCase()) {
    case "high":
      return { bg: "rgba(239,68,68,0.1)", text: "#dc2626", border: "rgba(220,38,38,0.25)" };
    case "critical":
      return { bg: "rgba(239,68,68,0.14)", text: "#b91c1c", border: "rgba(185,28,28,0.3)" };
    case "low":
      return { bg: "rgba(59,130,246,0.1)", text: "#1d4ed8", border: "rgba(29,78,216,0.25)" };
    case "normal":
      return { bg: "rgba(34,197,94,0.1)", text: "#15803d", border: "rgba(21,128,61,0.25)" };
    default:
      return { bg: "rgba(100,116,139,0.1)", text: "#475569", border: "rgba(71,85,105,0.25)" };
  }
}

function CenterUpload() {
  const [lang, setLang] = useState("en");
  const [currentFile, setCurrentFile] = useState(null);
  const [reportSummary, setReportSummary] = useState("");
  const [structuredReport, setStructuredReport] = useState(null);
  const [analysisDone, setAnalysisDone] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [isVoiceModal, setIsVoiceModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const chatAreaRef = useRef(null);
  const finalTranscriptRef = useRef("");

  const t = uploadTranslations[lang];

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (structuredReport) {
      setReportSummary(buildStandardSummary(structuredReport, lang));
    }
  }, [lang, structuredReport]);

  const showAlert = (message, type = "warn") => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 5000);
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    if (file.type.startsWith("image/") || file.type === "application/pdf") {
      setCurrentFile(file);
      setAnalysisDone(false);
      setReportSummary("");
      setStructuredReport(null);
      setMessages([]);
      return;
    }
    showAlert("Only image or PDF files are supported", "warn");
  };

  const speak = (text, onEnd) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utt = new SpeechSynthesisUtterance(cleanTextForSpeech(text));
    utt.onstart = () => setIsSpeaking(true);
    utt.onend = () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    };
    utt.onerror = () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    };
    utt.lang = lang === "kn" ? "kn-IN" : "en-IN";
    utt.rate = 0.9;
    utt.pitch = 1;
    window.speechSynthesis.speak(utt);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const analyzeReport = async () => {
    if (!currentFile) {
      showAlert(t.fileRequired, "warn");
      return;
    }

    setIsAnalyzing(true);
    setProgress(5);
    const timer = setInterval(() => setProgress((p) => Math.min(p + 8, 88)), 500);

    try {
      const dataUrl = await fileToDataUrl(currentFile);
      const content = [{ type: "text", text: buildExtractionPrompt(lang) }];

      if (currentFile.type === "application/pdf") {
        content.push({ type: "file", file: { filename: currentFile.name, file_data: dataUrl } });
      } else {
        content.push({ type: "image_url", image_url: { url: dataUrl } });
      }

      const raw = await callOpenRouter([{ role: "user", content }], 2500);
      const extracted = parseStructuredJson(raw);

      clearInterval(timer);
      setProgress(100);
      setTimeout(() => setProgress(0), 600);

      setStructuredReport(extracted);
      setReportSummary(buildStandardSummary(extracted, lang));
      setAnalysisDone(true);
      setMessages([{ role: "system", text: t.welcome }]);
      showAlert("Analysis complete", "success");
    } catch (e) {
      clearInterval(timer);
      setProgress(0);
      showAlert("Error: " + e.message, "warn");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sendChat = async (override) => {
    const userMessage = override || chatInput.trim();
    if (!userMessage || !reportSummary || isChatLoading) return;

    setChatInput("");
    setMessages((p) => [...p, { role: "user", text: userMessage }]);
    setIsChatLoading(true);
    setMessages((p) => [...p, { role: "thinking", text: t.thinking }]);

    try {
      const prompt =
        lang === "en"
          ? `You are a compassionate medical AI assistant. Answer in simple English. Keep answers concise but useful. Do not use markdown. End with a reminder to consult a doctor.\n\nReport summary:\n${reportSummary}\n\nJSON data:\n${structuredReport ? JSON.stringify(structuredReport, null, 2) : "null"}\n\nQuestion:\n${userMessage}`
          : `ನೀವು ದಯೆಯುಳ್ಳ ವೈದ್ಯಕೀಯ AI ಸಹಾಯಕ. ಸರಳ ಕನ್ನಡದಲ್ಲಿ ಸ್ಪಷ್ಟ ಮತ್ತು ಉಪಯುಕ್ತ ಉತ್ತರ ನೀಡಿ. Markdown ಅಥವಾ ವಿಶೇಷ ಚಿಹ್ನೆಗಳನ್ನು ಬಳಸಬೇಡಿ. ಪ್ರತಿಯೊಂದು ಉತ್ತರದ ಅಂತ್ಯದಲ್ಲಿ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಲು ನೆನಪಿಸಿ.\n\nವರದಿ ಸಾರಾಂಶ:\n${reportSummary}\n\nJSON ಡೇಟಾ:\n${structuredReport ? JSON.stringify(structuredReport, null, 2) : "null"}\n\nಪ್ರಶ್ನೆ:\n${userMessage}`;

      const reply = await callOpenRouter([{ role: "user", content: [{ type: "text", text: prompt }] }], 700);
      const finalReply = typeof reply === "string" ? reply : JSON.stringify(reply, null, 2);
      setMessages((p) => p.filter((m) => m.role !== "thinking"));
      setMessages((p) => [...p, { role: "agent", text: finalReply }]);
      speak(finalReply, () => {
        if (isVoiceModal) setTimeout(toggleMic, 400);
      });
    } catch (e) {
      setMessages((p) => p.filter((m) => m.role !== "thinking"));
      setMessages((p) => [...p, { role: "agent", text: "Error: " + e.message }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const toggleMic = () => {
    if (!reportSummary) {
      showAlert("Please analyze a report first", "warn");
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      showAlert("Microphone not supported in this browser", "warn");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const rec = new SR();
    rec.lang = lang === "kn" ? "kn-IN" : "en-IN";
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (e) => {
      finalTranscriptRef.current = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join("");
    };
    rec.onend = () => {
      setIsListening(false);
      if (finalTranscriptRef.current) {
        sendChat(finalTranscriptRef.current);
        finalTranscriptRef.current = "";
      }
    };
    rec.onerror = () => setIsListening(false);
    rec.start();
    setIsListening(true);
    recognitionRef.current = rec;
  };

  return (
    <div style={{ padding: "20px 24px 28px" }}>
      <div style={{ maxWidth: 980 }}>
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
            <div style={{ width: 38, height: 38, borderRadius: 99, background: "rgba(26,122,94,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a7a5e" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "1.35rem", color: "#0a1f36" }}>{t.title}</h2>
          </div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", color: "#5a7fa0" }}>{t.subtitle}</p>
        </motion.div>

        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {["en", "kn"].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                padding: "7px 14px",
                borderRadius: 999,
                border: lang === l ? "none" : "1px solid rgba(15,76,129,0.2)",
                background: lang === l ? "linear-gradient(135deg,#0f4c81,#1a7a5e)" : "rgba(255,255,255,0.7)",
                color: lang === l ? "white" : "#3d5a7a",
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 600,
                fontSize: "0.74rem",
                cursor: "pointer",
              }}
            >
              {l === "en" ? "English" : "ಕನ್ನಡ"}
            </button>
          ))}
        </div>

        {alerts.map((a) => (
          <div key={a.id} style={{ ...card, marginBottom: 8, padding: "10px 12px", border: a.type === "warn" ? "1px solid rgba(245,158,11,0.3)" : "1px solid rgba(34,197,94,0.3)", background: a.type === "warn" ? "rgba(254,243,199,0.7)" : "rgba(220,252,231,0.7)" }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", color: a.type === "warn" ? "#92400e" : "#166534" }}>{a.message}</p>
          </div>
        ))}

        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileSelect(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          style={{
            ...card,
            border: `1.5px dashed ${isDragging ? "#1a7a5e" : "rgba(15,76,129,0.2)"}`,
            background: isDragging ? "rgba(34,199,138,0.08)" : "rgba(255,255,255,0.72)",
            padding: "36px 20px",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          <input ref={fileInputRef} type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={(e) => handleFileSelect(e.target.files?.[0])} />
          <div style={{ width: 54, height: 54, borderRadius: 99, background: "rgba(26,122,94,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a7a5e" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#0a1f36", marginBottom: 3 }}>{t.uploadLabel}</p>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", color: "#5a7fa0" }}>{t.uploadSub}</p>
        </motion.div>

        {currentFile && (
          <div style={{ ...card, marginTop: 10, padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.74rem", color: "#1e3a5f" }}>
              {currentFile.name} ({(currentFile.size / 1024).toFixed(0)} KB)
            </p>
            <button onClick={(e) => { e.stopPropagation(); setCurrentFile(null); }} style={{ border: "none", background: "none", cursor: "pointer", color: "#64748b", fontSize: "0.95rem" }}>x</button>
          </div>
        )}

        {progress > 0 && (
          <div style={{ height: 5, borderRadius: 99, background: "rgba(15,76,129,0.1)", marginTop: 10, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg,#22c78a,#0f4c81)", transition: "width 0.3s" }} />
          </div>
        )}

        <button
          onClick={analyzeReport}
          disabled={!currentFile || isAnalyzing}
          style={{
            width: "100%",
            marginTop: 12,
            padding: "11px 14px",
            borderRadius: 10,
            border: "none",
            cursor: !currentFile || isAnalyzing ? "not-allowed" : "pointer",
            color: "white",
            background: !currentFile || isAnalyzing ? "#9ca3af" : "linear-gradient(135deg,#0f4c81,#1a7a5e)",
            fontFamily: "'Sora',sans-serif",
            fontWeight: 600,
            fontSize: "0.82rem",
          }}
        >
          {isAnalyzing ? t.analyzing : t.analyzeBtn}
        </button>

        {analysisDone && (
          <>
            <div style={{ ...card, marginTop: 14, padding: "16px" }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.66rem", fontWeight: 700, color: "#5a7fa0", marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t.summaryTitle}</p>
              <p style={{ whiteSpace: "pre-wrap", fontFamily: "'DM Sans',sans-serif", fontSize: "0.74rem", color: "#1e3a5f", lineHeight: 1.7 }}>{reportSummary}</p>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button onClick={() => (isSpeaking ? stopSpeaking() : speak(reportSummary))} style={{ padding: "6px 12px", borderRadius: 99, border: "1px solid rgba(15,76,129,0.2)", background: "rgba(255,255,255,0.75)", cursor: "pointer", fontSize: "0.72rem", color: "#3d5a7a" }}>{isSpeaking ? "Stop" : t.readAloud}</button>
                <button onClick={() => setIsVoiceModal(true)} style={{ padding: "6px 12px", borderRadius: 99, border: "1px solid rgba(34,197,94,0.3)", background: "rgba(220,252,231,0.8)", cursor: "pointer", fontSize: "0.72rem", color: "#166534" }}>Start Voice Conversation</button>
              </div>
            </div>

            {isVoiceModal && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                <div style={{ ...card, width: "min(460px, 92vw)", padding: "20px" }}>
                  <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#0a1f36", marginBottom: 4 }}>Voice Conversation</h3>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.74rem", color: "#5a7fa0", marginBottom: 14 }}>Ask me anything about your report.</p>
                  <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                    <button onClick={toggleMic} style={{ width: 84, height: 84, borderRadius: 999, border: "none", cursor: "pointer", background: isListening ? "#f59e0b" : "#1a7a5e", color: "white", fontWeight: 700 }}>{isListening ? "LISTEN" : "MIC"}</button>
                    <button onClick={() => { setIsVoiceModal(false); if (isListening && recognitionRef.current) recognitionRef.current.stop(); }} style={{ width: 84, height: 84, borderRadius: 999, border: "none", cursor: "pointer", background: "#dc2626", color: "white", fontWeight: 700 }}>STOP</button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ ...card, marginTop: 14, padding: "16px" }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.66rem", fontWeight: 700, color: "#5a7fa0", marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t.chatTitle}</p>
              <div ref={chatAreaRef} style={{ maxHeight: 260, overflowY: "auto", marginBottom: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {messages.map((msg, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "85%",
                      padding: "8px 10px",
                      borderRadius: 10,
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: "0.74rem",
                      lineHeight: 1.5,
                      background:
                        msg.role === "user"
                          ? "linear-gradient(135deg,#0f4c81,#1a7a5e)"
                          : msg.role === "agent"
                          ? "rgba(15,76,129,0.06)"
                          : "transparent",
                      color: msg.role === "user" ? "white" : "#1e3a5f",
                    }}>
                      {msg.text}
                      {msg.role === "agent" && (
                        <div style={{ marginTop: 6 }}>
                          <button onClick={() => (isSpeaking ? stopSpeaking() : speak(msg.text))} style={{ padding: "4px 10px", borderRadius: 99, border: "1px solid rgba(15,76,129,0.2)", background: "white", cursor: "pointer", fontSize: "0.66rem", color: "#3d5a7a" }}>{isSpeaking ? "Stop" : t.readAloud}</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={toggleMic} style={{ width: 42, height: 42, borderRadius: 999, border: "none", cursor: "pointer", background: isListening ? "#f59e0b" : "#1a7a5e", color: "white" }}>M</button>
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendChat()}
                  placeholder={t.placeholder}
                  style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(15,76,129,0.2)", outline: "none", fontFamily: "'DM Sans',sans-serif", fontSize: "0.74rem" }}
                />
                <button
                  onClick={() => sendChat()}
                  disabled={!chatInput.trim() || isChatLoading}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "none",
                    cursor: !chatInput.trim() || isChatLoading ? "not-allowed" : "pointer",
                    background: !chatInput.trim() || isChatLoading ? "#9ca3af" : "linear-gradient(135deg,#0f4c81,#1a7a5e)",
                    color: "white",
                    fontFamily: "'DM Sans',sans-serif",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                  }}
                >
                  {isChatLoading ? "..." : "Send"}
                </button>
              </div>

              {isListening && (
                <p style={{ marginTop: 8, fontFamily: "'DM Sans',sans-serif", fontSize: "0.68rem", color: "#64748b", textAlign: "center" }}>{t.micStart}</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── LIBRARY (Resource Library - Image 6) ────────────────────────────────────
function CenterLibrary() {
  const { user } = useAuth();
  const userEmail = user?.email || "";
  const [formData, setFormData] = useState({ title:"", doctorName:"", hospitalName:"", date:"", subject:"", type:"" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ message: "", error: "" });
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;
    setSelectedFile(file);
  };

  const submitLibraryItem = async () => {
    if (!formData.title || !formData.doctorName || !formData.hospitalName || !formData.date) {
      setUploadStatus({ message: "", error: "Please fill in all required fields." });
      return;
    }

    if (!selectedFile) {
      setUploadStatus({ message: "", error: "Please choose a file to upload." });
      return;
    }

    if (!userEmail) {
      setUploadStatus({ message: "", error: "User email not available. Please login again." });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setUploadStatus({ message: "", error: "Session expired. Please login again." });
      return;
    }

    setIsUploading(true);
    setUploadStatus({ message: "", error: "" });

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('username', userEmail);
      payload.append('doctorName', formData.doctorName);
      payload.append('hospitalName', formData.hospitalName);
      payload.append('date', formData.date);
      payload.append('subject', formData.subject);
      payload.append('type', formData.type);
      payload.append('file', selectedFile);

      const response = await fetch('/api/resource-library', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Upload failed.');
      }

      setFormData({ title:"", doctorName:"", hospitalName:"", date:"", subject:"", type:"" });
      setSelectedFile(null);
      setUploadStatus({ message: data?.message || 'Report uploaded successfully.', error: "" });
    } catch (error) {
      setUploadStatus({ message: "", error: error?.message || 'Upload failed.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ padding:"20px 24px 28px" }}>
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" style={{ maxWidth:580, margin:"0 auto" }}>
        <div style={{ ...card, padding:"28px 32px" }}>
          <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.1rem", color:"#0a1f36", textAlign:"center", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:6 }}>Resource Library</h2>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.75rem", color:"#5a7fa0", textAlign:"center", marginBottom:22 }}>Upload reports directly to the library</p>

          {[
            { label:"Title *", key:"title", placeholder:"e.g. X_RAY_01" },
            { label:"Username *", key:"username", placeholder:"user@email.com", disabled:true, value:userEmail },
            { label:"Doctor Name *", key:"doctorName", placeholder:"e.g. Swathi" },
            { label:"Hospital Name *", key:"hospitalName", placeholder:"e.g. BGS" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom:14 }}>
              <label style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", fontWeight:600, color:"#3d5a7a", display:"block", marginBottom:5 }}>{f.label}</label>
              <input
                placeholder={f.placeholder}
                defaultValue={f.value}
                disabled={f.disabled}
                onChange={e => setFormData(p => ({ ...p, [f.key]:e.target.value }))}
                style={{ width:"100%", padding:"9px 12px", borderRadius:9, border:"1.5px solid rgba(15,76,129,0.15)", background:"rgba(255,255,255,0.8)", fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", color:"#1e3a5f", outline:"none", boxSizing:"border-box" }}
              />
              {f.disabled && <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", color:"#94a3b8", marginTop:3 }}>Automatically filled from logged in user</p>}
            </div>
          ))}

          <div style={{ marginBottom:14 }}>
            <label style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", fontWeight:600, color:"#3d5a7a", display:"block", marginBottom:5 }}>Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
              style={{ width:"100%", padding:"9px 12px", borderRadius:9, border:"1.5px solid rgba(15,76,129,0.15)", background:"rgba(255,255,255,0.8)", fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", color:"#1e3a5f", outline:"none", boxSizing:"border-box" }}
            />
          </div>

          {[
            { key: 'subject', label:"Subject", placeholder:"e.g. subject" },
            { key: 'type', label:"Type", placeholder:"e.g. type" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom:14 }}>
              <label style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", fontWeight:600, color:"#3d5a7a", display:"block", marginBottom:5 }}>{f.label}</label>
              <input
                placeholder={f.placeholder}
                value={formData[f.key]}
                onChange={(e) => setFormData((p) => ({ ...p, [f.key]: e.target.value }))}
                style={{ width:"100%", padding:"9px 12px", borderRadius:9, border:"1.5px solid rgba(15,76,129,0.15)", background:"rgba(255,255,255,0.8)", fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", color:"#1e3a5f", outline:"none", boxSizing:"border-box" }}
              />
            </div>
          ))}

          <div style={{ marginBottom:18 }}>
            <label style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", fontWeight:600, color:"#3d5a7a", display:"block", marginBottom:5 }}>File *</label>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{ padding:"7px 14px", borderRadius:8, border:"1.5px solid rgba(15,76,129,0.2)", background:"rgba(255,255,255,0.9)", color:"#3d5a7a", fontFamily:"'DM Sans',sans-serif", fontSize:"0.74rem", cursor:"pointer" }}
              >
                Choose file
              </button>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.74rem", color:"#94a3b8" }}>
                {selectedFile ? `${selectedFile.name} (${(selectedFile.size / 1024).toFixed(0)} KB)` : 'No file chosen'}
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              style={{ display: 'none' }}
              onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
            />
          </div>

          {uploadStatus.error && (
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", color:"#dc2626", marginBottom:10 }}>{uploadStatus.error}</p>
          )}
          {uploadStatus.message && (
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", color:"#16a34a", marginBottom:10 }}>{uploadStatus.message}</p>
          )}

          <motion.button whileHover={{ scale:1.02, boxShadow:"0 8px 24px rgba(15,76,129,0.3)" }} whileTap={{ scale:0.98 }}
            type="button"
            onClick={submitLibraryItem}
            disabled={isUploading}
            style={{
              width:"100%",
              padding:"12px",
              borderRadius:10,
              border:"none",
              background:isUploading ? "#94a3b8" : "#2563eb",
              color:"white",
              fontFamily:"'Sora',sans-serif",
              fontWeight:700,
              fontSize:"0.85rem",
              cursor:isUploading ? "not-allowed" : "pointer",
              boxShadow:"0 4px 14px rgba(37,99,235,0.3)",
            }}>
            {isUploading ? 'Uploading...' : 'Upload to Library'}
          </motion.button>

          <div style={{ marginTop:14, background:"rgba(15,76,129,0.03)", border:"1px solid rgba(15,76,129,0.08)", borderRadius:10, padding:"12px 14px" }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", fontWeight:700, color:"#0f4c81", marginBottom:6 }}>How to use:</p>
            {["Fill in all required fields (marked with *)", "Select a file to upload", "Click 'Upload to Library'", "Your report will be saved to your personal resource library"].map((step, i) => (
              <p key={i} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", color:"#3d5a7a", lineHeight:1.8 }}>{i+1}. {step}</p>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── BIOAGE (Image 4 & 5) ─────────────────────────────────────────────────────
const BIO_UNITS = {
  albumin: "g/dL",
  creatinine: "mg/dL",
  glucose_mgdl: "mg/dL",
  crp: "mg/L",
  lymphocyte_percent: "%",
  mean_cell_volume: "fL",
  red_cell_dist_width: "%",
  alkaline_phosphatase: "U/L",
  white_blood_cell_count: "10^3/uL",
};

const BIO_LABELS = {
  albumin: "Albumin",
  creatinine: "Creatinine",
  glucose_mgdl: "Glucose",
  crp: "CRP",
  lymphocyte_percent: "Lymphocyte %",
  mean_cell_volume: "MCV",
  red_cell_dist_width: "RDW",
  alkaline_phosphatase: "ALP",
  white_blood_cell_count: "WBC",
};

const BIO_RANGES = {
  albumin: { low: 3.5, high: 5.0, unit: "g/dL" },
  creatinine_m: { low: 0.74, high: 1.35, unit: "mg/dL" },
  creatinine_f: { low: 0.59, high: 1.04, unit: "mg/dL" },
  glucose: { low: 70, high: 100, unit: "mg/dL" },
  crp: { low: 0, high: 3, unit: "mg/L" },
  lymphocyte_pct: { low: 20, high: 40, unit: "%" },
  mcv: { low: 80, high: 100, unit: "fL" },
  rdw: { low: 11.5, high: 14.5, unit: "%" },
  alp: { low: 44, high: 147, unit: "U/L" },
  wbc: { low: 4.5, high: 11, unit: "10^3/uL" },
};

function clampBio(value, low, high) {
  return Math.max(low, Math.min(high, value));
}

function isMissingBio(value) {
  return value == null || Number.isNaN(Number(value));
}

function ageDefaults(age) {
  const a = Number(age);
  return {
    albumin: Number(clampBio(4.4 - 0.004 * (a - 20), 3.5, 4.8).toFixed(2)),
    creatinine: Number(clampBio(0.85 + 0.003 * (a - 40), 0.6, 1.2).toFixed(2)),
    glucose_mgdl: Number(clampBio(85 + 0.4 * (a - 20), 75, 115).toFixed(1)),
    crp: Number(clampBio(1 + 0.03 * (a - 20), 0.3, 5).toFixed(2)),
    lymphocyte_percent: Number(clampBio(34 - 0.18 * (a - 20), 16, 40).toFixed(1)),
    mean_cell_volume: Number(clampBio(88 + 0.06 * (a - 20), 80, 102).toFixed(1)),
    red_cell_dist_width: Number(clampBio(12.6 + 0.03 * (a - 20), 11.5, 15.5).toFixed(1)),
    alkaline_phosphatase: Number(clampBio(72 + 0.8 * (a - 20), 44, 160).toFixed(1)),
    white_blood_cell_count: Number(clampBio(6.8 - 0.01 * (a - 20), 4.5, 9.5).toFixed(1)),
  };
}

function imputeBiomarkers(age, biomarkers) {
  const defaults = ageDefaults(age);
  const filled = { ...biomarkers };
  const defaultsUsed = [];

  Object.entries(defaults).forEach(([field, defaultValue]) => {
    if (isMissingBio(filled[field])) {
      filled[field] = defaultValue;
      defaultsUsed.push({ field, value: defaultValue, unit: BIO_UNITS[field] || "" });
    }
  });

  return { filled, defaultsUsed };
}

function parseNumericValue(value) {
  let raw = String(value ?? "").trim();
  if (!raw) return null;

  // Handle locale-decimal values like 10,5 while still supporting 1,234.5.
  if (raw.includes(",") && !raw.includes(".")) {
    raw = raw.replace(/,/g, ".");
  } else {
    raw = raw.replace(/,/g, "");
  }

  const match = raw.match(/-?\d*\.?\d+/);
  if (!match) return null;
  const num = Number(match[0]);
  return Number.isFinite(num) ? num : null;
}

function normalizeBiomarkerValue(key, value) {
  let v = Number(value);
  if (!Number.isFinite(v)) return null;

  // Fix common OCR/locale scaling errors and unit alternatives.
  if (key === "glucose_mgdl") {
    if (v > 600 && v < 2000) v = v / 10;
    if (v > 0 && v < 20) v = v * 18.0182;
  }

  if (key === "creatinine") {
    if (v > 20) v = v / 88.4; // umol/L to mg/dL
  }

  if (key === "white_blood_cell_count") {
    if (v > 1000) v = v / 1000; // cells/uL to 10^3/uL
    else if (v > 50) v = v / 10; // decimal comma loss: 10,5 -> 105
  }

  if (key === "red_cell_dist_width" || key === "lymphocyte_percent") {
    if (v > 100) v = v / 10;
  }

  if (key === "mean_cell_volume" && v > 300) {
    v = v / 10;
  }

  if (key === "crp" && v > 100) {
    v = v / 10;
  }

  return Number(v.toFixed(3));
}

function normalizeBiomarkerName(name) {
  const n = String(name || "").toLowerCase().trim();

  if (n.includes("albumin")) return "albumin";
  if (n.includes("creatinine") || n === "cr") return "creatinine";
  if (n.includes("glucose") || n.includes("fbs") || n.includes("ppbs") || n.includes("blood sugar")) return "glucose_mgdl";
  if (n === "crp" || n.includes("c-reactive")) return "crp";
  if (n.includes("lymphocyte")) return "lymphocyte_percent";
  if (n.includes("mean cell volume") || n.includes("mcv")) return "mean_cell_volume";
  if (n.includes("red cell dist") || n.includes("rdw")) return "red_cell_dist_width";
  if (n.includes("alkaline phosphatase") || n === "alp") return "alkaline_phosphatase";
  if (n.includes("white blood") || n === "wbc") return "white_blood_cell_count";

  return null;
}

function collectBiomarkersFromRows(rows) {
  const latest = {};
  rows.forEach((row) => {
    const key = normalizeBiomarkerName(row?.name);
    if (!key || latest[key] != null) return;
    const parsed = parseNumericValue(row?.value);
    latest[key] = normalizeBiomarkerValue(key, parsed);
  });
  return latest;
}

function calculateBioAge(age, biomarkers) {
  const { filled, defaultsUsed } = imputeBiomarkers(age, biomarkers);

  const albumin = Number(filled.albumin);
  const creatinine = Number(filled.creatinine);
  const glucoseMgdl = Number(filled.glucose_mgdl);
  const crp = Number(filled.crp);
  const lymphocyte = Number(filled.lymphocyte_percent);
  const mcv = Number(filled.mean_cell_volume);
  const rdw = Number(filled.red_cell_dist_width);
  const alp = Number(filled.alkaline_phosphatase);
  const wbc = Number(filled.white_blood_cell_count);

  if (crp <= 0) {
    throw new Error("CRP must be greater than 0 for log calculation");
  }

  const glucose = glucoseMgdl / 18.0182;
  const xb =
    -19.907 -
    0.0336 * albumin +
    0.0095 * creatinine +
    0.1953 * glucose +
    0.0954 * Math.log(crp) -
    0.012 * lymphocyte +
    0.0268 * mcv +
    0.3306 * rdw +
    0.00188 * alp +
    0.0554 * wbc +
    0.0804 * Number(age);

  const gamma = 0.0076927;
  let m = 1 - Math.exp((-Math.exp(xb) * (Math.exp(120 * gamma) - 1)) / gamma);
  m = clampBio(m, 0.000001, 0.999999);
  const biologicalAge = 141.50225 + Math.log(-0.00553 * Math.log(1 - m)) / 0.090165;
  const diff = biologicalAge - Number(age);

  let interpretation = "Significantly older - Consult a healthcare provider.";
  if (diff <= -10) interpretation = "Significantly younger - Excellent!";
  else if (diff <= -5) interpretation = "Younger than chronological age - Good.";
  else if (diff <= 2) interpretation = "Close to chronological age - Normal.";
  else if (diff <= 5) interpretation = "Slightly older - Consider lifestyle improvements.";
  else if (diff <= 10) interpretation = "Older - Health improvements recommended.";

  return {
    chronologicalAge: Number(age),
    biologicalAge: Number(biologicalAge.toFixed(1)),
    ageDifference: Number(diff.toFixed(1)),
    mortalityScore: Number(m.toFixed(3)),
    interpretation,
    defaultsUsed,
    effectiveBiomarkers: filled,
  };
}

function riskLevel(score) {
  if (score < 25) return { label: "Low Risk", color: "#22c55e" };
  if (score < 50) return { label: "Moderate Risk", color: "#f59e0b" };
  if (score < 75) return { label: "High Risk", color: "#ef4444" };
  return { label: "Very High Risk", color: "#b91c1c" };
}

function scoreRisk(conditions) {
  const total = conditions.reduce((sum, item) => sum + item[1], 0);
  const earned = conditions.reduce((sum, item) => (item[0] ? sum + item[1] : sum), 0);
  if (!total) return 0;
  return Number(((earned / total) * 100).toFixed(1));
}

function classifyBiomarker(value, low, high) {
  if (value < low * 0.8) return "critical_low";
  if (value < low) return "low";
  if (value > high * 1.3) return "critical_high";
  if (value > high) return "high";
  return "normal";
}

function mapBiomarkerStatusColor(status) {
  if (status === "normal") return { label: "OK", color: "#22c55e", bar: "#22c55e" };
  if (status === "low" || status === "critical_low") return { label: "LOW", color: "#3b82f6", bar: "#3b82f6" };
  return { label: "HIGH", color: "#f59e0b", bar: "#ef4444" };
}

function buildBiomarkerStatuses(values, sex) {
  const creatRange = String(sex || "male").toLowerCase() === "female" ? BIO_RANGES.creatinine_f : BIO_RANGES.creatinine_m;
  const checks = [
    { key: "albumin", value: values.albumin, range: BIO_RANGES.albumin },
    { key: "creatinine", value: values.creatinine, range: creatRange },
    { key: "glucose_mgdl", value: values.glucose_mgdl, range: BIO_RANGES.glucose },
    { key: "crp", value: values.crp, range: BIO_RANGES.crp },
    { key: "lymphocyte_percent", value: values.lymphocyte_percent, range: BIO_RANGES.lymphocyte_pct },
    { key: "mean_cell_volume", value: values.mean_cell_volume, range: BIO_RANGES.mcv },
    { key: "red_cell_dist_width", value: values.red_cell_dist_width, range: BIO_RANGES.rdw },
    { key: "alkaline_phosphatase", value: values.alkaline_phosphatase, range: BIO_RANGES.alp },
    { key: "white_blood_cell_count", value: values.white_blood_cell_count, range: BIO_RANGES.wbc },
  ];

  return checks.map((item) => {
    const state = classifyBiomarker(item.value, item.range.low, item.range.high);
    const ui = mapBiomarkerStatusColor(state);
    return {
      key: item.key,
      label: BIO_LABELS[item.key],
      value: Number(item.value),
      status: ui.label,
      color: ui.color,
      bar: ui.bar,
      unit: BIO_UNITS[item.key],
    };
  });
}

function computeDiseaseRisks({ age, sex, phenoAge, values }) {
  const creatRange = String(sex || "male").toLowerCase() === "female" ? BIO_RANGES.creatinine_f : BIO_RANGES.creatinine_m;
  const albumin = Number(values.albumin);
  const creatinine = Number(values.creatinine);
  const glucose = Number(values.glucose_mgdl);
  const crp = Number(values.crp);
  const lymphocyte = Number(values.lymphocyte_percent);
  const mcv = Number(values.mean_cell_volume);
  const rdw = Number(values.red_cell_dist_width);
  const alp = Number(values.alkaline_phosphatase);
  const wbc = Number(values.white_blood_cell_count);

  const risks = [
    {
      name: "Cardiovascular Disease",
      pct: scoreRisk([
        [crp > 3, 25],
        [rdw > 14.5, 20],
        [creatinine > creatRange.high, 15],
        [glucose > 100, 15],
        [albumin < 3.5, 10],
        [wbc > 10, 10],
        [age > 50, 5],
      ]),
      actions: [
        "Reduce processed foods, sugar, and trans fats to lower inflammation",
        "Consider Omega-3 supplementation (fish oil 2g/day)",
      ],
    },
    {
      name: "Type 2 Diabetes",
      pct: scoreRisk([
        [glucose > 125, 30],
        [glucose > 100, 20],
        [crp > 3, 20],
        [albumin < 3.8, 15],
        [age > 45, 10],
        [wbc > 9, 5],
      ]),
      actions: [
        "Get HbA1c test done to confirm diabetes trend",
        "Adopt low glycemic index diet and regular activity",
      ],
    },
    {
      name: "Chronic Kidney Disease",
      pct: scoreRisk([
        [creatinine > creatRange.high * 1.3, 30],
        [creatinine > creatRange.high, 20],
        [albumin < 3.5, 20],
        [glucose > 125, 15],
        [wbc > 10, 10],
        [age > 60, 5],
      ]),
      actions: [
        "Increase water intake to 2.5 to 3 liters/day",
        "Avoid frequent NSAID painkillers",
      ],
    },
    {
      name: "Liver Disease",
      pct: scoreRisk([
        [alp > 147 * 1.3, 30],
        [alp > 147, 20],
        [albumin < 3.5, 25],
        [mcv > 100, 15],
        [wbc > 10, 10],
      ]),
      actions: [
        "Reduce alcohol and fatty foods",
        "Get ALT and AST panel for full liver picture",
      ],
    },
    {
      name: "Cancer / Immune Risk",
      pct: scoreRisk([
        [lymphocyte < 20, 25],
        [rdw > 14.5, 25],
        [crp > 5, 20],
        [wbc > 11, 15],
        [albumin < 3.5, 10],
        [age > 55, 5],
      ]),
      actions: [
        "Support immunity with sleep, Vitamin D, and zinc",
        "Repeat CBC and inflammation markers in 4 to 6 weeks",
      ],
    },
    {
      name: "Metabolic Syndrome",
      pct: scoreRisk([
        [glucose > 100, 25],
        [crp > 3, 25],
        [albumin < 3.8, 20],
        [rdw > 14, 15],
        [age > 40, 15],
      ]),
      actions: [
        "Mediterranean diet strongly recommended",
        "Target 150 min/week moderate aerobic activity",
      ],
    },
  ].map((risk) => {
    const info = riskLevel(risk.pct);
    return {
      ...risk,
      risk: info.label,
      riskColor: info.color,
    };
  });

  const ageGap = Number((phenoAge - age).toFixed(1));
  const avgRisk = risks.reduce((sum, risk) => sum + risk.pct, 0) / risks.length;
  const agePenalty = Math.max(0, ageGap * 1.5);
  const overallHealthScore = Number(clampBio(100 - avgRisk - agePenalty, 0, 100).toFixed(1));
  const topPriorityActions = [...new Set(risks.sort((a, b) => b.pct - a.pct).flatMap((risk) => risk.actions))].slice(0, 6);

  return {
    diseaseRisks: risks,
    overallHealthScore,
    topPriorityActions,
    biomarkerStatuses: buildBiomarkerStatuses(values, sex),
  };
}

function CenterBioAge() {
  const { user } = useAuth();
  const [mode, setMode] = useState("source");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [fetchedRows, setFetchedRows] = useState(0);

  const runBioAgeAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Session expired. Please login again.");
      }

      const response = await fetch("/api/blood-det", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to fetch BLOOD_DET data");
      }

      const rows = Array.isArray(data?.rows) ? data.rows : [];
      setFetchedRows(rows.length);
      if (rows.length === 0) {
        throw new Error("No BLOOD_DET rows found. Upload and analyze reports first.");
      }

      const age = Number(user?.age) > 0 ? Number(user.age) : 30;
      const sex = String(user?.sex || "male").toLowerCase();
      const rawBiomarkers = collectBiomarkersFromRows(rows);
      const bioAge = calculateBioAge(age, rawBiomarkers);
      const risk = computeDiseaseRisks({
        age,
        sex,
        phenoAge: bioAge.biologicalAge,
        values: bioAge.effectiveBiomarkers,
      });

      const trendResponse = await fetch("/api/biotrend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bioAge: bioAge.biologicalAge,
          chronologicalAge: bioAge.chronologicalAge,
          ageDifference: bioAge.ageDifference,
          date: new Date().toISOString(),
        }),
      });

      const trendData = await trendResponse.json();
      if (!trendResponse.ok) {
        throw new Error(trendData?.error || "Unable to save BIOTREND data");
      }

      setPrediction({
        ...bioAge,
        ...risk,
      });
      setMode("results");
    } catch (error) {
      setAnalysisError(error?.message || "Unable to run analysis");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (mode === "source") {
    return (
      <div style={{ padding:"20px 24px 28px" }}>
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" style={{ marginBottom:24 }}>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:"#1a7a5e" }}>BIOLOGICAL AGE ANALYSIS</span>
          <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"2rem", color:"#0a1f36", lineHeight:1.2, marginTop:6 }}>
            Predict your<br/><span style={{ color:"#0f4c81" }}>disease risk</span><br/>from blood work
          </h2>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.8rem", color:"#5a7fa0", marginTop:10, lineHeight:1.6 }}>
            This will fetch your latest BLOOD_DET biomarkers from Atlas, compute biological age, and generate risk scores.
          </p>
          <div style={{ display:"flex", gap:28, marginTop:16 }}>
            {[{ val:"9", label:"Biomarkers analysed" }, { val:"6", label:"Disease risks scored" }, { val:String(fetchedRows || "--"), label:"Rows loaded" }].map(s => (
              <div key={s.label}>
                <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.3rem", color:"#0a1f36" }}>{s.val}</p>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", color:"#5a7fa0" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {analysisError && (
          <div style={{ ...card, padding:"12px 14px", marginBottom:14, border:"1px solid rgba(239,68,68,0.3)", background:"rgba(254,226,226,0.75)" }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.74rem", fontWeight:600, color:"#b91c1c" }}>{analysisError}</p>
          </div>
        )}

        <motion.button custom={2} variants={fadeUp} initial="hidden" animate="visible"
          whileHover={{ scale:1.01, boxShadow:"0 8px 28px rgba(15,76,129,0.3)" }} whileTap={{ scale:0.98 }}
          onClick={runBioAgeAnalysis}
          disabled={isAnalyzing}
          style={{ display:"block", width:"100%", maxWidth:760, padding:"14px", borderRadius:12, border:"none", background:isAnalyzing ? "#94a3b8" : "linear-gradient(135deg,#38bdf8,#0f4c81)", color:"white", fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.88rem", cursor:isAnalyzing ? "not-allowed" : "pointer", boxShadow:isAnalyzing ? "none" : "0 4px 16px rgba(15,76,129,0.25)", marginTop:16 }}>
          {isAnalyzing ? "Analyzing BLOOD_DET biomarkers..." : "Analyze Biological Age & Disease Risk ->"}
        </motion.button>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div style={{ padding:"20px 24px 28px" }}>
        <button onClick={() => setMode("source")} style={{ padding:"6px 12px", borderRadius:8, border:"1px solid rgba(15,76,129,0.15)", background:"rgba(255,255,255,0.8)", color:"#3d5a7a", fontFamily:"'DM Sans',sans-serif", fontSize:"0.74rem", fontWeight:600, cursor:"pointer" }}>
          ← Back
        </button>
      </div>
    );
  }

  const topRiskNames = [...prediction.diseaseRisks]
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 2)
    .map((risk) => `${risk.name} (${risk.pct}%)`)
    .join(" and ");

  return (
    <div style={{ padding:"20px 24px 28px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
        <button onClick={() => setMode("source")} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:8, border:"1.5px solid rgba(15,76,129,0.15)", background:"rgba(255,255,255,0.8)", color:"#3d5a7a", fontFamily:"'DM Sans',sans-serif", fontSize:"0.74rem", fontWeight:600, cursor:"pointer" }}>
          ← Back
        </button>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.75rem", fontWeight:700, color:"#5a7fa0" }}>BioAge / Disease Risk Engine</span>
        <span style={{ marginLeft:"auto", fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", fontWeight:700, color:"#0f4c81", border:"1.5px solid rgba(15,76,129,0.2)", borderRadius:99, padding:"2px 10px" }}>BLOOD_DET</span>
      </div>

      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
        style={{ ...card, padding:"16px 18px", marginBottom:16, background:"rgba(240,249,255,0.8)", fontFamily:"'DM Mono',monospace", fontSize:"0.74rem", color:"#1e3a5f", lineHeight:2 }}>
        <span style={{ fontWeight:700, color:"#0f4c81" }}>AGE OUTPUT</span><br/>
        Chronological age &nbsp;: {prediction.chronologicalAge.toFixed(1)} years<br/>
        Biological age &nbsp;&nbsp;&nbsp;&nbsp;: <span style={{ color: prediction.ageDifference > 0 ? "#ef4444" : "#16a34a", fontWeight:700 }}>{prediction.biologicalAge.toFixed(1)} years</span><br/>
        Age difference &nbsp;&nbsp;&nbsp;: <span style={{ color: prediction.ageDifference > 0 ? "#ef4444" : "#16a34a" }}>{prediction.ageDifference > 0 ? "+" : ""}{prediction.ageDifference.toFixed(1)} years</span><br/>
        Mortality score &nbsp;&nbsp;: {prediction.mortalityScore}<br/>
        Interpretation &nbsp;&nbsp;&nbsp;: <span style={{ color: prediction.ageDifference > 0 ? "#ef4444" : "#0f4c81" }}>{prediction.interpretation}</span>
      </motion.div>

      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
        style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16 }}>
        {[
          { label:"CHRONOLOGICAL AGE", value:String(prediction.chronologicalAge), sub:"years old", color:"#0a1f36", highlight:false },
          { label:"BIOLOGICAL AGE", value:String(prediction.biologicalAge), sub:"phenotypic years", color:prediction.ageDifference > 0 ? "#ef4444" : "#16a34a", highlight:true },
          { label:"AGE GAP", value:`${prediction.ageDifference > 0 ? "+" : ""}${prediction.ageDifference}`, sub:"vs chronological", color:prediction.ageDifference > 0 ? "#ef4444" : "#16a34a", highlight:false },
          { label:"HEALTH SCORE", value:String(prediction.overallHealthScore), sub:"out of 100", color:prediction.overallHealthScore < 50 ? "#f59e0b" : "#22c55e", highlight:false },
        ].map(s => (
          <div key={s.label} style={{ ...card, padding:"14px 16px", border:s.highlight?"2px solid rgba(15,76,129,0.2)":"1px solid rgba(255,255,255,0.9)" }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.6rem", fontWeight:700, color:"#5a7fa0", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6 }}>{s.label}</p>
            <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.6rem", color:s.color, letterSpacing:"-0.03em" }}>{s.value}</p>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", color:"#94a3b8", marginTop:3 }}>{s.sub}</p>
          </div>
        ))}
      </motion.div>

      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" style={{ marginBottom:6 }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#5a7fa0", marginBottom:10 }}>BIOMARKERS &amp; DISEASE RISKS</p>
      </motion.div>
      <div style={{ display:"grid", gridTemplateColumns:"220px 1fr", gap:12, marginBottom:16 }}>
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
          style={{ ...card, padding:"12px 14px" }}>
          {prediction.biomarkerStatuses.map((marker) => (
            <div key={marker.key} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0", borderBottom:"1px solid rgba(15,76,129,0.04)" }}>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.68rem", color:"#3d5a7a", flex:1 }}>{marker.label}</span>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", color:"#0a1f36", minWidth:42, textAlign:"right" }}>{marker.value}</span>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.58rem", color:"#94a3b8", minWidth:40 }}>{marker.unit}</span>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.6rem", fontWeight:700, color:marker.color, minWidth:28 }}>{marker.status}</span>
            </div>
          ))}
        </motion.div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
          {prediction.diseaseRisks.map((risk, i) => (
            <motion.div key={risk.name} custom={i+4} variants={fadeUp} initial="hidden" animate="visible"
              style={{ ...card, padding:"12px 14px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.1rem", color:risk.riskColor }}>{risk.pct}%</span>
              </div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"0.76rem", color:"#0a1f36", marginBottom:3 }}>{risk.name}</p>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", color:risk.riskColor, fontWeight:600, marginBottom:8 }}>{risk.risk}</p>
              <div style={{ height:4, borderRadius:99, background:"rgba(15,76,129,0.08)" }}>
                <div style={{ height:"100%", borderRadius:99, width:`${risk.pct}%`, background:risk.riskColor, transition:"width 0.6s ease" }}/>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div custom={10} variants={fadeUp} initial="hidden" animate="visible">
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#5a7fa0", marginBottom:10 }}>PRIORITY ACTIONS</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:14 }}>
          {prediction.topPriorityActions.map((action, i) => (
            <div key={`${action}-${i}`} style={{ ...card, padding:"12px 14px", display:"flex", gap:10, alignItems:"flex-start" }}>
              <span style={{ width:22, height:22, borderRadius:7, background:"linear-gradient(135deg,#0f4c81,#1a7a5e)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"0.65rem", color:"white" }}>{i+1}</span>
              </span>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", color:"#3d5a7a", lineHeight:1.5 }}>{action}</p>
            </div>
          ))}
        </div>

        <div style={{ ...card, padding:"16px 18px", background:"rgba(240,249,255,0.8)", border:"1px solid rgba(15,76,129,0.1)" }}>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#0f4c81", marginBottom:8 }}>HEALTH SUMMARY</p>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", color:"#3d5a7a", lineHeight:1.7 }}>
            Biological age is {prediction.biologicalAge} years versus chronological age {prediction.chronologicalAge}, with an age gap of {prediction.ageDifference > 0 ? "+" : ""}{prediction.ageDifference}. Overall health score is {prediction.overallHealthScore}/100. Highest risk signals are {topRiskNames}. Priority action: {prediction.topPriorityActions[0] || "Follow doctor-guided preventive care plan"}. This is a decision-support estimate and not a diagnosis.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── REPORTS (Patient Profile view - Image 1) ─────────────────────────────────
function CenterReports() {
  const [activeTab, setActiveTab] = useState("Patient Profile");
  const tabs = ["Patient Profile", "Appointments", "Medications", "Documents"];
  const reports = [
    { name:"Annual Blood Panel", date:"Apr 2025", doctor:"Dr. Catherine", hospital:"BGS Hospital", type:"Blood Test", status:"Decoded" },
    { name:"Thyroid Function", date:"Feb 2025", doctor:"Dr. Arjun Mehta", hospital:"Mumbai Health", type:"Thyroid", status:"Decoded" },
    { name:"CBC Report", date:"Jan 2025", doctor:"Dr. Riya Sharma", hospital:"Apollo", type:"Complete Blood", status:"Pending" },
    { name:"Vitamin Panel", date:"Mar 2025", doctor:"Dr. Ann Curgy", hospital:"NY Health Center", type:"Vitamin", status:"Decoded" },
  ];

  return (
    <div style={{ padding:"20px 24px 28px" }}>
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
        style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.2rem", color:"#0a1f36" }}>My Reports</h2>
        <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} style={{ padding:"7px 16px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#0f4c81,#1a7a5e)", color:"white", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:"0.76rem", cursor:"pointer", boxShadow:"0 3px 10px rgba(15,76,129,0.25)" }}>
          + Upload Report
        </motion.button>
      </motion.div>

      {/* Report cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {reports.map((r, i) => (
          <motion.div key={r.name} custom={i+1} variants={fadeUp} initial="hidden" animate="visible"
            whileHover={{ y:-2, boxShadow:"0 12px 30px rgba(15,76,129,0.12)" }}
            style={{ ...card, padding:"16px 20px", display:"flex", alignItems:"center", gap:16, cursor:"pointer" }}>
            <div style={{ width:44, height:44, borderRadius:12, background:"linear-gradient(135deg,rgba(15,76,129,0.1),rgba(26,122,94,0.08))", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f4c81" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.88rem", color:"#0a1f36" }}>{r.name}</p>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", fontWeight:700, color:r.status==="Decoded"?"#1a7a5e":"#f59e0b", background:r.status==="Decoded"?"rgba(26,122,94,0.1)":"rgba(245,158,11,0.1)", padding:"2px 9px", borderRadius:99 }}>{r.status}</span>
              </div>
              <div style={{ display:"flex", gap:16 }}>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", color:"#5a7fa0" }}>{r.doctor}</span>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", color:"#5a7fa0" }}>{r.hospital}</span>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", color:"#5a7fa0" }}>{r.date}</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button style={{ padding:"6px 12px", borderRadius:8, border:"1px solid rgba(15,76,129,0.15)", background:"rgba(255,255,255,0.8)", color:"#0f4c81", fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", fontWeight:600, cursor:"pointer" }}>View</button>
              <button style={{ padding:"6px 12px", borderRadius:8, border:"none", background:"linear-gradient(135deg,#0f4c81,#1a7a5e)", color:"white", fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", fontWeight:600, cursor:"pointer" }}>Decode</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── INSURANCE ────────────────────────────────────────────────────────────────
function CenterInsurance() {
  const { user } = useAuth();
  const displayName = user?.name || "User";
  const userEmail = user?.email || "Not provided";
  return (
    <div style={{ padding:"20px 24px 28px" }}>
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" style={{ marginBottom:18 }}>
        <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.2rem", color:"#0a1f36" }}>Insurance</h2>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", color:"#5a7fa0" }}>Manage your health insurance details</p>
      </motion.div>

      {/* Insurance card visual */}
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
        style={{ background:"linear-gradient(135deg,#0f4c81,#1a7a5e)", borderRadius:20, padding:"28px 28px", marginBottom:18, position:"relative", overflow:"hidden", color:"white" }}>
        <div style={{ position:"absolute", top:-40, right:-40, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }}/>
        <div style={{ position:"absolute", bottom:-30, left:-20, width:140, height:140, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }}/>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:28 }}>
          <div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.6)", marginBottom:4 }}>PROVIDER</p>
            <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.1rem", color:"white" }}>BlueCross</p>
          </div>
          <div style={{ width:44, height:44, borderRadius:12, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
        </div>
        <div style={{ display:"flex", gap:32, flexWrap:"wrap" }}>
          {[{ label:"PLAN", value:"Gold PPO" }, { label:"MEMBER ID", value:"BC-28471" }, { label:"GROUP NO.", value:"GRP-5541" }, { label:"EXPIRES", value:"Dec 2026" }].map(f => (
            <div key={f.label}>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.55)", marginBottom:3 }}>{f.label}</p>
              <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.88rem", color:"white" }}>{f.value}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop:16 }}>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", color:"rgba(255,255,255,0.65)" }}>{displayName} • {userEmail}</p>
        </div>
      </motion.div>

      {/* Coverage details */}
      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
        style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {[
          { title:"Coverage", items:["Hospitalization", "Surgery", "Emergency Care", "Mental Health"] },
          { title:"Benefits", items:["$500 Deductible", "$5,000 Out-of-pocket Max", "80% Coinsurance", "Free Preventive Care"] },
        ].map(s => (
          <div key={s.title} style={{ ...card, padding:"16px 18px" }}>
            <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.82rem", color:"#0a1f36", marginBottom:10 }}>{s.title}</p>
            {s.items.map(item => (
              <div key={item} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0", borderBottom:"1px solid rgba(15,76,129,0.05)" }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:"#22c78a", display:"inline-block", flexShrink:0 }}/>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.73rem", color:"#3d5a7a" }}>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── PROFILE (Image 1 patient profile) ───────────────────────────────────────
function CenterProfile() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState("Info");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({
    phone: "",
    dob: "",
    age: "",
    bloodType: "",
    allergies: "",
    sex: "",
    height: "",
    weight: "",
    bloodPressure: "",
    heartRate: "",
    bloodSugar: "",
  });
  const tabs = ["Info", "Chat", "Doctor Page"];
  const displayName = user?.name || "User";
  const displayInitial = displayName.charAt(0).toUpperCase();
  const displayPatientId = user?._id ? `#${String(user._id).slice(-10).toUpperCase()}` : "Not assigned";
  const displayDob = user?.dob || "Not provided";
  const displayAge = user?.age ? ` (Age: ${user.age})` : "";

  useEffect(() => {
    setProfileDraft({
      phone: user?.phone || "",
      dob: user?.dob || "",
      age: user?.age?.toString() || "",
      bloodType: user?.bloodType || "",
      allergies: user?.allergies || "",
      sex: user?.sex || "",
      height: user?.height?.toString() || "",
      weight: user?.weight?.toString() || "",
      bloodPressure: user?.bloodPressure || "",
      heartRate: user?.heartRate?.toString() || "",
      bloodSugar: user?.bloodSugar || "",
    });
  }, [user]);

  const handleProfileDraftChange = (field, value) => {
    setProfileDraft((prev) => ({ ...prev, [field]: value }));
  };

  const saveProfileChanges = async () => {
    setIsSavingProfile(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...profileDraft,
          age: profileDraft.age ? Number(profileDraft.age) : null,
          height: profileDraft.height ? Number(profileDraft.height) : null,
          weight: profileDraft.weight ? Number(profileDraft.weight) : null,
          heartRate: profileDraft.heartRate ? Number(profileDraft.heartRate) : null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to save profile");
      }

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Profile save error:", error);
      alert(error.message || "Unable to save profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div style={{ padding:"20px 24px 28px" }}>
      {/* Profile header */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
        style={{ ...card, padding:"18px 22px", marginBottom:18, display:"flex", alignItems:"center", gap:18, flexWrap:"wrap" }}>
        <div style={{ width:68, height:68, borderRadius:"50%", background:"linear-gradient(135deg,#0f4c81,#1a7a5e)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.5rem", color:"white" }}>{displayInitial}</span>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.1rem", color:"#0a1f36" }}>{displayName}</h2>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", fontWeight:700, color:"#1a7a5e", background:"rgba(26,122,94,0.1)", padding:"2px 9px", borderRadius:99 }}>Verified</span>
          </div>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", color:"#5a7fa0" }}>Patient ID: {displayPatientId}</p>
        </div>
        <motion.button
          whileHover={{ scale:1.03 }}
          whileTap={{ scale:0.97 }}
          onClick={() => setIsEditingProfile((prev) => !prev)}
          style={{ padding:"7px 16px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#0f4c81,#1a7a5e)", color:"white", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:"0.76rem", cursor:"pointer" }}
        >
          {isEditingProfile ? "Cancel" : "Edit Profile"}
        </motion.button>
      </motion.div>

      {/* Tabs */}
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
        style={{ display:"flex", gap:0, marginBottom:18, borderBottom:"1.5px solid rgba(15,76,129,0.08)" }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding:"9px 16px", border:"none", background:"none", fontFamily:"'DM Sans',sans-serif", fontSize:"0.82rem", fontWeight:activeTab===tab?700:400, color:activeTab===tab?"#0f4c81":"#5a7fa0", cursor:"pointer", borderBottom:activeTab===tab?"2.5px solid #0f4c81":"2.5px solid transparent", marginBottom:-1.5, transition:"all 0.18s ease" }}>{tab}</button>
        ))}
      </motion.div>

      {activeTab === "Info" && (
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <div style={{ ...card, padding:"18px 20px" }}>
            <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.84rem", color:"#0a1f36", marginBottom:14 }}>Patient Information</p>
            {isEditingProfile ? (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div style={{ gridColumn:"1 / -1", display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div style={{ padding:"10px 12px", borderRadius:9, background:"rgba(15,76,129,0.03)", border:"1px solid rgba(15,76,129,0.06)" }}>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.62rem", color:"#94a3b8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:2 }}>Full Name</p>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", color:"#1e3a5f", fontWeight:600 }}>{user?.name || "Not provided"}</p>
                  </div>
                  <div style={{ padding:"10px 12px", borderRadius:9, background:"rgba(15,76,129,0.03)", border:"1px solid rgba(15,76,129,0.06)" }}>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.62rem", color:"#94a3b8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:2 }}>Email Address</p>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", color:"#1e3a5f", fontWeight:600 }}>{user?.email || "Not provided"}</p>
                  </div>
                </div>
                {[
                  { label:"Contact Number", key:"phone", type:"text" },
                  { label:"Date of Birth", key:"dob", type:"date" },
                  { label:"Age", key:"age", type:"number" },
                  { label:"Blood Type", key:"bloodType", type:"text" },
                  { label:"Sex", key:"sex", type:"text" },
                  { label:"Allergies", key:"allergies", type:"text" },
                  { label:"Height (cm)", key:"height", type:"number" },
                  { label:"Weight (kg)", key:"weight", type:"number" },
                  { label:"Blood Pressure", key:"bloodPressure", type:"text" },
                  { label:"Heart Rate", key:"heartRate", type:"number" },
                  { label:"Blood Sugar", key:"bloodSugar", type:"text" },
                ].map((field) => (
                  <label key={field.key} style={{ display:"flex", flexDirection:"column", gap:4 }}>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.62rem", color:"#94a3b8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>{field.label}</span>
                    <input
                      type={field.type}
                      value={profileDraft[field.key]}
                      onChange={(e) => handleProfileDraftChange(field.key, e.target.value)}
                      style={{ padding:"9px 10px", borderRadius:9, border:"1.5px solid rgba(15,76,129,0.15)", background:"rgba(255,255,255,0.95)", fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", color:"#1e3a5f", outline:"none" }}
                    />
                  </label>
                ))}
                <div style={{ gridColumn:"1 / -1", display:"flex", gap:10, justifyContent:"flex-end", marginTop:6 }}>
                  <button onClick={() => setIsEditingProfile(false)} style={{ padding:"8px 14px", borderRadius:9, border:"1px solid rgba(15,76,129,0.15)", background:"white", color:"#3d5a7a", fontFamily:"'DM Sans',sans-serif", fontWeight:600, cursor:"pointer" }}>
                    Cancel
                  </button>
                  <button onClick={saveProfileChanges} disabled={isSavingProfile} style={{ padding:"8px 14px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#0f4c81,#1a7a5e)", color:"white", fontFamily:"'DM Sans',sans-serif", fontWeight:600, cursor:"pointer", opacity:isSavingProfile ? 0.75 : 1 }}>
                    {isSavingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            ) : (
              [
                { label:"Full Name", value:user?.name || "Not provided", icon:"👤" },
                { label:"Email Address", value:user?.email || "Not provided", icon:"📧" },
                { label:"Contact Number", value:user?.phone || "Not provided", icon:"📞" },
                { label:"Date of Birth", value:`${displayDob}${displayAge}`, icon:"🗓️" },
                { label:"Blood Type", value:user?.bloodType || "Not provided", icon:"🩸" },
                { label:"Allergies", value:user?.allergies || "None", icon:"⚠️" },
              ].map(f => (
                <div key={f.label} style={{ padding:"8px 0", borderBottom:"1px solid rgba(15,76,129,0.05)" }}>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.62rem", color:"#94a3b8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:2 }}>{f.label}</p>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", color:"#1e3a5f", fontWeight:500 }}>{f.value}</p>
                </div>
              ))
            )}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {/* Vital signs */}
            <div style={{ ...card, padding:"16px 18px" }}>
              <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.82rem", color:"#0a1f36", marginBottom:12 }}>Vital Signs</p>
              {[
                { label:"Blood Pressure", value:user?.bloodPressure || "Not recorded", icon:"❤️", status:"Normal", statusColor:"#22c55e" },
                { label:"Heart Rate", value:user?.heartRate ? `${user.heartRate} bpm` : "Not recorded", icon:"💓", status:"Normal", statusColor:"#22c55e" },
                { label:"Blood Sugar", value:user?.bloodSugar || "Not recorded", icon:"💉", status:"Normal", statusColor:"#22c55e" },
                { label:"Weight", value:user?.weight ? `${user.weight} kg` : "Not recorded", icon:"⚖️", status:"Guide", statusColor:"#3b82f6" },
              ].map(v => (
                <div key={v.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid rgba(15,76,129,0.05)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:"0.9rem" }}>{v.icon}</span>
                    <div>
                      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", color:"#5a7fa0" }}>{v.label}</p>
                      <p style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.78rem", fontWeight:600, color:"#0a1f36" }}>{v.value}</p>
                    </div>
                  </div>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.62rem", fontWeight:700, color:v.statusColor, background:`${v.statusColor}15`, padding:"2px 8px", borderRadius:99 }}>{v.status}</span>
                </div>
              ))}
            </div>

            {/* Health alerts */}
            <div style={{ ...card, padding:"16px 18px" }}>
              <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.82rem", color:"#0a1f36", marginBottom:10 }}>🔔 Health Alerts</p>
              {[
                { title:"Medication Reminder", sub:"Lisinopril – Due in 2 hours", color:"#ef4444" },
                { title:"Upcoming Appointment", sub:"Cardiology – Apr 15, 10:00 AM", color:"#f59e0b" },
                { title:"Lab Results Available", sub:"Blood panel – View results", color:"#3b82f6" },
              ].map(a => (
                <div key={a.title} style={{ padding:"8px 0", borderBottom:"1px solid rgba(15,76,129,0.05)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                    <span style={{ width:7, height:7, borderRadius:"50%", background:a.color, display:"inline-block" }}/>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.74rem", fontWeight:600, color:"#1e3a5f" }}>{a.title}</p>
                  </div>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.66rem", color:"#5a7fa0", paddingLeft:13 }}>{a.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "Chat" && (
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
          style={{ ...card, padding:"18px", height:320, display:"flex", flexDirection:"column", gap:10 }}>
          <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.82rem", color:"#0a1f36" }}>Messages</p>
          {[
            { from:"Dr. Catherine", msg:"Your latest blood test results are ready. Please check the attached report.", time:"2 hours ago", color:"#0f4c81", initials:"DC" },
            { from:"Nurse Patricia", msg:"Reminder: Please take your medication before 9 PM today.", time:"3 hours ago", color:"#1a7a5e", initials:"NP", highlight:true },
            { from:"Pharmacy", msg:"Your prescription refill is ready for pickup at our main location.", time:"Yesterday", color:"#22c78a", initials:"PH" },
          ].map(m => (
            <div key={m.from} style={{ ...card, padding:"12px 14px", background:m.highlight?"#0a1f36":"rgba(255,255,255,0.72)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                <div style={{ width:32, height:32, borderRadius:10, background:m.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.68rem", color:"white" }}>{m.initials}</span>
                </div>
                <div>
                  <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.76rem", color:m.highlight?"white":"#0a1f36" }}>{m.from}</p>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.62rem", color:m.highlight?"rgba(255,255,255,0.5)":"#94a3b8" }}>{m.time}</p>
                </div>
              </div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.73rem", color:m.highlight?"rgba(255,255,255,0.8)":"#3d5a7a", lineHeight:1.5 }}>{m.msg}</p>
            </div>
          ))}
        </motion.div>
      )}

      {activeTab === "Doctor Page" && (
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
          style={{ ...card, padding:"18px", display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", color:"#5a7fa0", textAlign:"center", padding:"40px 0" }}>Doctor page coming soon…</p>
        </motion.div>
      )}
    </div>
  );
}

// ─── DOCTORS / FIND SPECIALIST (Image 3) ─────────────────────────────────────
function CenterDoctors() {
  const { user } = useAuth();
  const displayName = user?.name || "User";
  const [counselingType, setCounselingType] = useState("All types");
  const [city, setCity] = useState("All Cities");

  const doctors = [
    { name:"Dr. Ann Curgy", specialty:"Clinical Psychologist", rating:5.0, location:"New York, USA", exp:10, mode:"Both", tag:"Therapist", price:80, priceMode:"Both" },
    { name:"Dr. Alise Prensh", specialty:"Military Psychologist", rating:4.5, location:"Los Angeles, USA", exp:4, mode:"Online", tag:"Therapist", price:50, priceMode:"Online" },
    { name:"Dr. Andry Willon", specialty:"Child Psychologist", rating:5.0, location:"Chicago, USA", exp:20, mode:"Offline", tag:"Therapist", price:120, priceMode:"Offline" },
    { name:"Dr. Angela Braun", specialty:"Forensic Psychologist", rating:3.2, location:"Philadelphia, USA", exp:2, mode:"Offline", tag:"Therapist", price:40, priceMode:"Offline" },
    { name:"Dr. Dilan McCarter", specialty:"Industrial Psychologist", rating:5.0, location:"San Diego, USA", exp:8, mode:"Both", tag:"Therapist", price:75, priceMode:"Both" },
    { name:"Dr. Evan Peters", specialty:"Clinical Psychologist", rating:4.1, location:"Houston, USA", exp:3, mode:"Both", tag:"Therapist", price:50, priceMode:"Both" },
    { name:"Dr. Riya Sharma", specialty:"General Dentist", rating:4.6, location:"Bangalore, India", exp:6, mode:"Offline", tag:"Dentist", price:30, priceMode:"Offline" },
    { name:"Dr. Arjun Mehta", specialty:"Orthodontist", rating:4.3, location:"Mumbai, India", exp:12, mode:"Both", tag:"Dentist", price:60, priceMode:"Both" },
    { name:"Dr. Sneha Reddy", specialty:"Dermatologist", rating:4.8, location:"Hyderabad, India", exp:7, mode:"Both", tag:"Skin Specialist", price:45, priceMode:"Both" },
  ];

  const ratingColor = (r) => r >= 4.5 ? "#22c55e" : r >= 3.5 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ padding:"20px 24px 28px" }}>
      {/* Header */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" style={{ marginBottom:16 }}>
        <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.2rem", color:"#0a1f36" }}>Welcome, {displayName}!</h2>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", color:"#5a7fa0", marginTop:4 }}>Find the best specialist for yourself! Our specialists will help you find the best decisions for solving your problems!</p>
      </motion.div>

      {/* Search bar */}
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
        style={{ ...card, padding:"14px 18px", marginBottom:18, display:"flex", gap:12, flexWrap:"wrap", alignItems:"center" }}>
        {[
          { label:"TYPE OF COUNSELING", value:counselingType, opts:["All types","Therapy","Dental","Dermatology"] },
          { label:"CITY", value:city, opts:["All Cities","New York","Los Angeles","Chicago","Bangalore","Mumbai"] },
          { label:"EXPERIENCE", value:"Any Experience", opts:["Any Experience","0-5 years","5-10 years","10+ years"] },
          { label:"MODE", value:"Any Mode", opts:["Any Mode","Online","Offline","Both"] },
        ].map(f => (
          <div key={f.label} style={{ flex:1, minWidth:130 }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.58rem", fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>{f.label}</p>
            <select style={{ width:"100%", background:"none", border:"none", fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", color:"#1e3a5f", fontWeight:500, cursor:"pointer", outline:"none" }}>
              {f.opts.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <button style={{ width:36, height:36, borderRadius:9, border:"none", background:"linear-gradient(135deg,#0f4c81,#1a7a5e)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
      </motion.div>

      {/* Doctor list */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.88rem", color:"#0a1f36" }}>
          Best for you <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", fontWeight:600, color:"#0f4c81", background:"rgba(15,76,129,0.1)", borderRadius:99, padding:"2px 8px", marginLeft:6 }}>{doctors.length}</span>
        </span>
        <button style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", color:"#0f4c81", background:"rgba(15,76,129,0.06)", border:"1px solid rgba(15,76,129,0.15)", borderRadius:8, padding:"4px 12px", cursor:"pointer", fontWeight:600 }}>See all →</button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:14 }}>
        {doctors.map((d, i) => (
          <motion.div key={d.name} custom={i+2} variants={fadeUp} initial="hidden" animate="visible"
            whileHover={{ y:-3, boxShadow:"0 14px 32px rgba(15,76,129,0.13)" }}
            style={{ ...card, padding:"16px 18px", cursor:"pointer" }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:8 }}>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.84rem", color:"#0a1f36", marginBottom:2 }}>{d.name}</p>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.68rem", color:"#5a7fa0" }}>{d.specialty}</p>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.68rem", fontWeight:700, color:"white", background:ratingColor(d.rating), padding:"2px 7px", borderRadius:99 }}>⭐ {d.rating}</span>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.68rem", color:"#5a7fa0" }}>📍 {d.location}</span>
            </div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.68rem", color:"#5a7fa0", marginBottom:4 }}>{d.exp} yrs of exp.</p>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.68rem", color:"#5a7fa0", marginBottom:8 }}>Mode: {d.mode}</p>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", fontWeight:600, color:"#3d5a7a", background:"rgba(15,76,129,0.06)", border:"1px solid rgba(15,76,129,0.1)", borderRadius:99, padding:"2px 9px", display:"inline-block", marginBottom:10 }}>{d.tag}</span>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1rem", color:"#0a1f36" }}>${d.price}</span>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.6rem", color:"#94a3b8" }}>/hr</span>
                <br/>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", color:"#5a7fa0" }}>{d.priceMode}</span>
              </div>
              <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                style={{ padding:"7px 14px", borderRadius:99, border:"none", background:"linear-gradient(135deg,#0f4c81,#1a7a5e)", color:"white", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"0.72rem", cursor:"pointer", boxShadow:"0 3px 10px rgba(15,76,129,0.25)" }}>
                Book Consultation
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── CENTER CONTENT MAP ───────────────────────────────────────────────────────
const centerContent = {
  home:      (props) => <CenterHome {...props} />,
  health:    () => <CenterHealth />,
  upload:    () => <CenterUpload />,
  library:   () => <CenterLibrary />,
  bioage:    () => <CenterBioAge />,
  reports:   () => <CenterReports />,
  insurance: () => <CenterInsurance />,
  profile:   () => <CenterProfile />,
};

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const displayName = user?.name || "User";
  const [activeNav, setActiveNav] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const RightContent = rightPanelContent[activeNav] || PanelHome;
  const CenterView = centerContent[activeNav] || centerContent.home;

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", background:"linear-gradient(160deg,#f0f7ff 0%,#e8f8f2 50%,#f5fbff 100%)", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(15,76,129,0.15);border-radius:4px;}
        ::-webkit-scrollbar-thumb:hover{background:rgba(15,76,129,0.3);}
        .nav-btn{position:relative;}
        .nav-btn .tip{position:absolute;left:calc(100% + 10px);top:50%;transform:translateY(-50%);background:#0a1f36;color:white;padding:4px 10px;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:0.7rem;font-weight:600;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity 0.15s;z-index:999;}
        .nav-btn:hover .tip{opacity:1;}
        .sidebar-backdrop{display:none;}
        @media(max-width:767px){.sidebar-backdrop{display:block;position:fixed;inset:0;background:rgba(10,31,54,0.35);z-index:40;backdrop-filter:blur(2px);}.right-rail{display:none!important;}}
        @media(max-width:1023px){.right-rail{display:none!important;}}
        @media(min-width:1024px){.mobile-topbar-menu-btn{display:none!important;}}
        select{appearance:none;}
      `}</style>

      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)}/>}

      {/* Sidebar */}
      <motion.aside initial={{ x:-64, opacity:0 }} animate={{ x:0, opacity:1 }} transition={{ duration:0.55, ease:[0.22,1,0.36,1] }}
        style={{ width:60, background:"linear-gradient(180deg,#0f4c81 0%,#1a7a5e 100%)", display:"flex", flexDirection:"column", alignItems:"center", paddingTop:16, paddingBottom:16, gap:2, flexShrink:0, boxShadow:"4px 0 28px rgba(15,76,129,0.22)", zIndex:50, position:"relative" }}>
        <div style={{ marginBottom:12, padding:"4px 0" }}>
          <svg width="24" height="14" viewBox="0 0 120 60" fill="none">
            <path d="M0 38 L20 38 L28 10 L38 52 L48 24 L56 38 L68 38 L76 20 L84 44 L90 30 L100 30 L120 30" stroke="rgba(255,255,255,0.7)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
        {navItems.map((item, i) => (
          <motion.button key={item.id} className="nav-btn" onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }} title={item.label}
            whileHover={{ scale:1.08 }} whileTap={{ scale:0.94 }}
            initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.055+0.15, duration:0.35 }}
            style={{ width:42, height:42, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", background:activeNav===item.id?"rgba(255,255,255,0.2)":"transparent", border:activeNav===item.id?"1px solid rgba(255,255,255,0.28)":"1px solid transparent", boxShadow:activeNav===item.id?"0 3px 12px rgba(0,0,0,0.18)":"none", cursor:"pointer", transition:"all 0.18s ease" }}>
            {NavIcons[item.icon](activeNav===item.id)}
            <span className="tip">{item.label}</span>
          </motion.button>
        ))}
      </motion.aside>

      {/* Center + Right */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

        {/* Main content */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          {/* Top bar */}
          <motion.div initial={{ y:-36, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
            style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 20px", gap:10, background:"rgba(255,255,255,0.75)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(15,76,129,0.07)", flexShrink:0, zIndex:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.88rem", color:"#0a1f36" }}>{displayName}</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", color:"#5a7fa0", textTransform:"capitalize" }}>{activeNav}</span>
            </div>
            <div style={{ position:"relative", flex:1, maxWidth:340 }}>
              <svg style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input placeholder="Search…" style={{ width:"100%", padding:"8px 12px 8px 33px", background:"rgba(15,76,129,0.04)", border:"1.5px solid rgba(15,76,129,0.1)", borderRadius:10, fontSize:"0.82rem", color:"#1e3a5f", fontFamily:"'DM Sans',sans-serif", outline:"none" }}/>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", background:"linear-gradient(135deg,#0f4c81,#1a7a5e)", color:"white", border:"none", borderRadius:9, fontFamily:"'Sora',sans-serif", fontWeight:600, fontSize:"0.78rem", cursor:"pointer", boxShadow:"0 3px 12px rgba(15,76,129,0.25)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                New Encounter
              </motion.button>
              <button style={{ width:34, height:34, borderRadius:9, border:"1px solid rgba(15,76,129,0.1)", background:"rgba(255,255,255,0.7)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5a7fa0" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </button>
            </div>
          </motion.div>

          {/* Center scrollable body — changes per nav */}
          <div style={{ flex:1, overflowY:"auto" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNav}
                initial={{ opacity:0, y:16 }}
                animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-10 }}
                transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}
                style={{ minHeight:"100%" }}
              >
                <CenterView setActiveNav={setActiveNav} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right rail */}
        <AnimatePresence mode="wait">
          <motion.div key={activeNav} className="right-rail"
            initial={{ x:40, opacity:0 }} animate={{ x:0, opacity:1 }} exit={{ x:40, opacity:0 }} transition={{ duration:0.38, ease:[0.22,1,0.36,1] }}
            style={{ width:230, flexShrink:0, display:"flex", flexDirection:"column", background:"rgba(255,255,255,0.55)", backdropFilter:"blur(20px)", borderLeft:"1px solid rgba(15,76,129,0.08)", overflow:"hidden" }}>
            <div style={{ background:"rgba(255,255,255,0.75)", borderBottom:"1px solid rgba(15,76,129,0.07)", flexShrink:0 }}>
              <MiniCalendar />
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:"14px 12px 16px" }}>
              <AnimatePresence mode="wait">
                <motion.div key={activeNav} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.3, ease:"easeOut" }}>
                  <RightContent />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}