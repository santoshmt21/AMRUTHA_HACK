"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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
function CenterUpload() {
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  return (
    <div style={{ padding:"20px 24px 28px" }}>
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" style={{ marginBottom:18 }}>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:"#1a7a5e" }}>CORE INTERFACE</span>
        <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.5rem", color:"#0a1f36", marginTop:2 }}>
          Precision Bio-Data<br/><span style={{ color:"#1a7a5e" }}>Ingestion</span>
        </h2>
      </motion.div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:16 }}>
        <div>
          {/* Drop zone */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); setUploaded(true); }}
            style={{ ...card, padding:"48px 24px", display:"flex", flexDirection:"column", alignItems:"center", gap:14, textAlign:"center", marginBottom:16, border:`1.5px dashed ${dragging?"#0f4c81":"rgba(15,76,129,0.2)"}`, background: dragging?"rgba(15,76,129,0.04)":"rgba(255,255,255,0.72)", transition:"all 0.2s" }}>
            <div style={{ width:64, height:64, borderRadius:18, background:"linear-gradient(135deg,rgba(15,76,129,0.1),rgba(26,122,94,0.1))", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0f4c81" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
            </div>
            <h3 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"1.1rem", color:"#0a1f36" }}>Drop Medical Records</h3>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", color:"#5a7fa0", lineHeight:1.6 }}>Securely ingest image reports. Our clinical prism engine will<br/>automatically parse your biomarkers for analysis.</p>
            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              onClick={() => setUploaded(true)}
              style={{ padding:"8px 22px", borderRadius:10, border:"1.5px solid rgba(15,76,129,0.25)", background:"rgba(255,255,255,0.9)", color:"#0f4c81", fontFamily:"'Sora',sans-serif", fontWeight:600, fontSize:"0.8rem", cursor:"pointer" }}>
              Browse Files
            </motion.button>
          </motion.div>

          {/* Uploaded file */}
          <AnimatePresence>
            {uploaded && (
              <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                style={{ ...card, padding:"12px 16px", marginBottom:12, display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:34, height:34, borderRadius:8, background:"rgba(15,76,129,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f4c81" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", fontWeight:600, color:"#1e3a5f" }}>CRP.webp</p>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", color:"#5a7fa0" }}>173.27 KB</p>
                </div>
                <button onClick={() => setUploaded(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"#94a3b8" }}>✕</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Extracted text */}
          <AnimatePresence>
            {uploaded && (
              <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                style={{ ...card, padding:"14px 16px" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                  <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.82rem", color:"#0a1f36" }}>Extracted Text</span>
                  <div style={{ display:"flex", gap:8 }}>
                    {["Copy","Download"].map(b => (
                      <button key={b} style={{ padding:"4px 12px", borderRadius:7, border:"1px solid rgba(15,76,129,0.15)", background:b==="Download"?"linear-gradient(135deg,#0f4c81,#1a7a5e)":"rgba(255,255,255,0.8)", color:b==="Download"?"white":"#3d5a7a", fontFamily:"'DM Sans',sans-serif", fontSize:"0.68rem", fontWeight:600, cursor:"pointer" }}>{b}</button>
                    ))}
                  </div>
                </div>
                <div style={{ background:"rgba(15,76,129,0.02)", borderRadius:10, padding:"12px", height:140, overflowY:"auto", fontFamily:"'DM Mono',monospace", fontSize:"0.68rem", color:"#3d5a7a", lineHeight:1.7, border:"1px solid rgba(15,76,129,0.06)" }}>
                  DRLOGY PATHOLOGY LAB ⊕ 0122456789 | 09123456789<br/>
                  & Accurate | Caring | Instant drlogy@drlogy.com<br/>
                  105 –108, SMART VISION COMPLEX, HEALTHCARE ROAD, MUMBAI - 689578<br/>
                  Yashvi M. Patel | Sample Collected at ANAM<br/>
                  Age - 21 Years | Sample Collected By: Mr Suresh | Collected on: 03:11 PM 02 Dec<br/>
                  UHID - 556 1 | Ref. By: Dr. Hiren Shah | Reported on: 04:35 PM 02 Dec<br/><br/>
                  <strong>C-REACTIVE PROTEIN (CRP)</strong><br/>
                  C-REACTIVE PROTEIN (CRP) 3.50 Normal 0.00– 5.00 mg/dL<br/>
                  IMMUNOTURBIDIMETRY<br/>
                  Interpretation: Measurement of CRP is useful for the detection and evaluation of infection, tissue injury, inflammatory disorders and associated diseases.
                </div>
                <div style={{ marginTop:10 }}>
                  <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.78rem", color:"#0a1f36", marginBottom:6 }}>Medical Report Summary</p>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.7rem", color:"#3d5a7a", lineHeight:1.8 }}>
                    Age: 21<br/>CRP: 3.5
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right side */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
            style={{ background:"#0a1f36", borderRadius:18, padding:"20px 18px", color:"white" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <div style={{ width:30, height:30, borderRadius:8, background:"rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)" }}>ANALYSIS METRIC</span>
            </div>
            <h3 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.96rem", color:"white", marginBottom:8 }}>Biological Age Calculation</h3>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", color:"rgba(255,255,255,0.55)", lineHeight:1.6, marginBottom:12 }}>Cross-referencing biomarkers from your uploaded report to estimate your system's physiological age.</p>
            <div style={{ height:4, borderRadius:99, background:"rgba(255,255,255,0.1)" }}>
              <motion.div initial={{ width:0 }} animate={{ width: uploaded?"75%":"0%" }} transition={{ duration:1.2, ease:"easeOut" }} style={{ height:"100%", borderRadius:99, background:"linear-gradient(90deg,#22c78a,#0f4c81)" }}/>
            </div>
          </motion.div>

          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
            style={{ ...card, padding:"16px 18px", background:"rgba(255,247,200,0.6)", border:"1px solid rgba(234,179,8,0.2)" }}>
            <h4 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.82rem", color:"#854d0e", marginBottom:8 }}>Biological Age Rules</h4>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", color:"#92400e", lineHeight:1.6 }}>Blood marker values will be used to calculate your biological age. If some values are missing, average population values will be used as defaults.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── LIBRARY (Resource Library - Image 6) ────────────────────────────────────
function CenterLibrary() {
  const [formData, setFormData] = useState({ title:"", doctorName:"", hospitalName:"", date:"", subject:"", type:"" });

  return (
    <div style={{ padding:"20px 24px 28px" }}>
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" style={{ maxWidth:580, margin:"0 auto" }}>
        <div style={{ ...card, padding:"28px 32px" }}>
          <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.1rem", color:"#0a1f36", textAlign:"center", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:6 }}>Resource Library</h2>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.75rem", color:"#5a7fa0", textAlign:"center", marginBottom:22 }}>Upload reports directly to the library</p>

          {[
            { label:"Title *", key:"title", placeholder:"e.g. X_RAY_01" },
            { label:"Username *", key:"username", placeholder:"santosh@email.com", disabled:true, value:"santoshtalekattu@gmail.com" },
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
            <input type="date" style={{ width:"100%", padding:"9px 12px", borderRadius:9, border:"1.5px solid rgba(15,76,129,0.15)", background:"rgba(255,255,255,0.8)", fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", color:"#1e3a5f", outline:"none", boxSizing:"border-box" }}/>
          </div>

          {[{ label:"Subject", placeholder:"e.g. subject" }, { label:"Type", placeholder:"e.g. type" }].map(f => (
            <div key={f.label} style={{ marginBottom:14 }}>
              <label style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", fontWeight:600, color:"#3d5a7a", display:"block", marginBottom:5 }}>{f.label}</label>
              <input placeholder={f.placeholder} style={{ width:"100%", padding:"9px 12px", borderRadius:9, border:"1.5px solid rgba(15,76,129,0.15)", background:"rgba(255,255,255,0.8)", fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", color:"#1e3a5f", outline:"none", boxSizing:"border-box" }}/>
            </div>
          ))}

          <div style={{ marginBottom:18 }}>
            <label style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", fontWeight:600, color:"#3d5a7a", display:"block", marginBottom:5 }}>File *</label>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <button style={{ padding:"7px 14px", borderRadius:8, border:"1.5px solid rgba(15,76,129,0.2)", background:"rgba(255,255,255,0.9)", color:"#3d5a7a", fontFamily:"'DM Sans',sans-serif", fontSize:"0.74rem", cursor:"pointer" }}>Choose file</button>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.74rem", color:"#94a3b8" }}>No file chosen</span>
            </div>
          </div>

          <motion.button whileHover={{ scale:1.02, boxShadow:"0 8px 24px rgba(15,76,129,0.3)" }} whileTap={{ scale:0.98 }}
            style={{ width:"100%", padding:"12px", borderRadius:10, border:"none", background:"#2563eb", color:"white", fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.85rem", cursor:"pointer", boxShadow:"0 4px 14px rgba(37,99,235,0.3)" }}>
            Upload to Library
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
function CenterBioAge() {
  const [mode, setMode] = useState("source"); // source | results

  const biomarkers = [
    { label:"Albumin", value:3.8, status:"OK", color:"#22c55e" },
    { label:"Creatinine", value:1.3, status:"OK", color:"#22c55e" },
    { label:"Glucose", value:108, status:"HIGH", color:"#f59e0b" },
    { label:"CRP", value:3.5, status:"HIGH", color:"#f59e0b" },
    { label:"Lymphocyte %", value:18, status:"LOW", color:"#3b82f6" },
    { label:"MCV", value:102, status:"HIGH", color:"#f59e0b" },
    { label:"RDW", value:15.1, status:"HIGH", color:"#f59e0b" },
    { label:"ALP", value:160, status:"HIGH", color:"#f59e0b" },
    { label:"WBC", value:10.5, status:"OK", color:"#22c55e" },
  ];

  const diseases = [
    { name:"Cardiovascular Disease", pct:70, risk:"High Risk", riskColor:"#ef4444", icon:"❤️" },
    { name:"Type 2 Diabetes", pct:45, risk:"Moderate Risk", riskColor:"#f59e0b", icon:"💉" },
    { name:"Chronic Kidney Disease", pct:10, risk:"Low Risk", riskColor:"#22c55e", icon:"⚪" },
    { name:"Liver Disease", pct:45, risk:"Moderate Risk", riskColor:"#f59e0b", icon:"⚪" },
    { name:"Cancer / Immune Risk", pct:50, risk:"High Risk", riskColor:"#ef4444", icon:"⚪" },
    { name:"Metabolic Syndrome", pct:65, risk:"High Risk", riskColor:"#ef4444", icon:"⚪" },
  ];

  if (mode === "source") {
    return (
      <div style={{ padding:"20px 24px 28px" }}>
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" style={{ marginBottom:24 }}>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:"#1a7a5e" }}>BIOLOGICAL AGE ANALYSIS</span>
          <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"2rem", color:"#0a1f36", lineHeight:1.2, marginTop:6 }}>
            Predict your<br/><span style={{ color:"#0f4c81" }}>disease risk</span><br/>from blood work
          </h2>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.8rem", color:"#5a7fa0", marginTop:10, lineHeight:1.6 }}>
            Choose whether to use your latest biomarkers from database or enter values manually, then analyze biological age and disease risks.
          </p>
          <div style={{ display:"flex", gap:28, marginTop:16 }}>
            {[{ val:"9", label:"Biomarkers analysed" }, { val:"6", label:"Disease risks scored" }, { val:"100%", label:"Runs locally" }].map(s => (
              <div key={s.label}>
                <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.3rem", color:"#0a1f36" }}>{s.val}</p>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", color:"#5a7fa0" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Source selector */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
          style={{ ...card, padding:"16px 18px", marginBottom:16, display:"flex", gap:10, maxWidth:300, position:"absolute", top:80, right:24 }}>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.68rem", fontWeight:700, color:"#5a7fa0", textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:0, width:"100%" }}>MARKER DATA SOURCE</span>
          {["Use Latest From Database","Enter Manually"].map((b, i) => (
            <button key={b} style={{ padding:"7px 12px", borderRadius:8, border:`1.5px solid ${i===0?"rgba(15,76,129,0.2)":"rgba(15,76,129,0.08)"}`, background:i===0?"rgba(15,76,129,0.06)":"transparent", color:i===0?"#0f4c81":"#94a3b8", fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>{b}</button>
          ))}
        </motion.div>

        <motion.button custom={2} variants={fadeUp} initial="hidden" animate="visible"
          whileHover={{ scale:1.01, boxShadow:"0 8px 28px rgba(15,76,129,0.3)" }} whileTap={{ scale:0.98 }}
          onClick={() => setMode("results")}
          style={{ display:"block", width:"100%", maxWidth:640, padding:"14px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#38bdf8,#0f4c81)", color:"white", fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.88rem", cursor:"pointer", boxShadow:"0 4px 16px rgba(15,76,129,0.25)", marginTop:16 }}>
          Analyze Biological Age &amp; Disease Risk →
        </motion.button>
      </div>
    );
  }

  return (
    <div style={{ padding:"20px 24px 28px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
        <button onClick={() => setMode("source")} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:8, border:"1.5px solid rgba(15,76,129,0.15)", background:"rgba(255,255,255,0.8)", color:"#3d5a7a", fontFamily:"'DM Sans',sans-serif", fontSize:"0.74rem", fontWeight:600, cursor:"pointer" }}>
          ← Back
        </button>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.75rem", fontWeight:700, color:"#5a7fa0" }}>BioAge / Disease Risk Engine</span>
        <span style={{ marginLeft:"auto", fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", fontWeight:700, color:"#0f4c81", border:"1.5px solid rgba(15,76,129,0.2)", borderRadius:99, padding:"2px 10px" }}>v2.0 BETA</span>
      </div>

      {/* AGE.PY Output */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
        style={{ ...card, padding:"16px 18px", marginBottom:16, background:"rgba(240,249,255,0.8)", fontFamily:"'DM Mono',monospace", fontSize:"0.74rem", color:"#1e3a5f", lineHeight:2 }}>
        <span style={{ fontWeight:700, color:"#0f4c81" }}>AGE.PY OUTPUT</span><br/>
        Chronological age &nbsp;: 21.0 years<br/>
        Biological age &nbsp;&nbsp;&nbsp;&nbsp;: <span style={{ color:"#ef4444", fontWeight:700 }}>46.5 years</span><br/>
        Age difference &nbsp;&nbsp;&nbsp;: <span style={{ color:"#ef4444" }}>+25.5 years</span><br/>
        Mortality score &nbsp;&nbsp;: 0.034<br/>
        Interpretation &nbsp;&nbsp;&nbsp;: <span style={{ color:"#ef4444" }}>Significantly older – Consult a healthcare provider.</span>
      </motion.div>

      {/* Summary cards */}
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
        style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16 }}>
        {[
          { label:"CHRONOLOGICAL AGE", value:"21", sub:"years old", color:"#0a1f36", highlight:false },
          { label:"BIOLOGICAL AGE", value:"46.5", sub:"phenotypic years", color:"#ef4444", highlight:true },
          { label:"AGE GAP", value:"+25.5", sub:"± Normal Aging", color:"#ef4444", highlight:false },
          { label:"HEALTH SCORE", value:"14.2", sub:"out of 100", color:"#f59e0b", highlight:false },
        ].map(s => (
          <div key={s.label} style={{ ...card, padding:"14px 16px", border:s.highlight?"2px solid rgba(15,76,129,0.2)":"1px solid rgba(255,255,255,0.9)" }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.6rem", fontWeight:700, color:"#5a7fa0", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6 }}>{s.label}</p>
            <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.6rem", color:s.color, letterSpacing:"-0.03em" }}>{s.value}</p>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", color:"#94a3b8", marginTop:3 }}>{s.sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Biomarkers & diseases */}
      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" style={{ marginBottom:6 }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#5a7fa0", marginBottom:10 }}>BIOMARKERS &amp; DISEASE RISKS</p>
      </motion.div>
      <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:12, marginBottom:16 }}>
        {/* Biomarker list */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
          style={{ ...card, padding:"12px 14px" }}>
          {biomarkers.map(b => (
            <div key={b.label} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0", borderBottom:"1px solid rgba(15,76,129,0.04)" }}>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.68rem", color:"#3d5a7a", flex:1 }}>{b.label}</span>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", color:"#0a1f36", minWidth:32, textAlign:"right" }}>{b.value}</span>
              <div style={{ width:48, height:4, borderRadius:99, background:"rgba(15,76,129,0.08)" }}>
                <div style={{ height:"100%", borderRadius:99, width:"60%", background:b.color }}/>
              </div>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.6rem", fontWeight:700, color:b.color, minWidth:26 }}>{b.status}</span>
            </div>
          ))}
        </motion.div>

        {/* Disease risks */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
          {diseases.map((d, i) => (
            <motion.div key={d.name} custom={i+4} variants={fadeUp} initial="hidden" animate="visible"
              style={{ ...card, padding:"12px 14px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.1rem", color:d.riskColor }}>{d.pct}%</span>
              </div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"0.76rem", color:"#0a1f36", marginBottom:3 }}>{d.name}</p>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", color:d.riskColor, fontWeight:600, marginBottom:8 }}>{d.risk}</p>
              <div style={{ height:4, borderRadius:99, background:"rgba(15,76,129,0.08)" }}>
                <div style={{ height:"100%", borderRadius:99, width:`${d.pct}%`, background:d.riskColor, transition:"width 0.6s ease" }}/>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Priority actions */}
      <motion.div custom={10} variants={fadeUp} initial="hidden" animate="visible">
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#5a7fa0", marginBottom:10 }}>PRIORITY ACTIONS</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:14 }}>
          {[
            "Reduce processed foods, sugar, and trans fats to lower inflammation",
            "Consider Omega-3 supplementation (fish oil 2g/day)",
            "Get iron, B12, and folate levels checked",
            "Limit refined carbohydrates; walk 30 min after meals",
            "Mediterranean diet strongly recommended",
            "Target 150 min/week moderate aerobic activity",
          ].map((action, i) => (
            <div key={i} style={{ ...card, padding:"12px 14px", display:"flex", gap:10, alignItems:"flex-start" }}>
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
            Biological age is 46.5 years versus chronological age 21, with an age gap of +25.5. Overall health score is 14.2/100, which indicates a low current health profile. Highest risk signals are Cardiovascular Disease (70%) and Metabolic Syndrome (65%). Most deviated biomarkers are CRP (high), Lymphocyte % (low), ALP (high). Priority action: Reduce processed foods, sugar, and trans fats to lower inflammation. Prediction indicates elevated near-term risk progression, so early clinical consultation and aggressive risk-factor management are strongly advised.
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
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", color:"rgba(255,255,255,0.65)" }}>Santosh • santoshtalekattu@gmail.com</p>
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
  const [activeTab, setActiveTab] = useState("Info");
  const tabs = ["Info", "Chat", "Doctor Page"];

  return (
    <div style={{ padding:"20px 24px 28px" }}>
      {/* Profile header */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
        style={{ ...card, padding:"18px 22px", marginBottom:18, display:"flex", alignItems:"center", gap:18, flexWrap:"wrap" }}>
        <div style={{ width:68, height:68, borderRadius:"50%", background:"linear-gradient(135deg,#0f4c81,#1a7a5e)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.5rem", color:"white" }}>S</span>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.1rem", color:"#0a1f36" }}>Santosh</h2>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", fontWeight:700, color:"#1a7a5e", background:"rgba(26,122,94,0.1)", padding:"2px 9px", borderRadius:99 }}>Verified</span>
          </div>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", color:"#5a7fa0" }}>Patient ID: #BGS310120261</p>
        </div>
        <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} style={{ padding:"7px 16px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#0f4c81,#1a7a5e)", color:"white", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:"0.76rem", cursor:"pointer" }}>Edit Profile</motion.button>
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
            {[
              { label:"Full Name", value:"Santosh", icon:"👤" },
              { label:"Email Address", value:"santoshtalekattu@gmail.com", icon:"📧" },
              { label:"Contact Number", value:"9880736838", icon:"📞" },
              { label:"Date of Birth", value:"2004-01-31 (Age: 23)", icon:"🗓️" },
              { label:"Blood Type", value:"A+", icon:"🩸" },
              { label:"Allergies", value:"None", icon:"⚠️" },
            ].map(f => (
              <div key={f.label} style={{ padding:"8px 0", borderBottom:"1px solid rgba(15,76,129,0.05)" }}>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.62rem", color:"#94a3b8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:2 }}>{f.label}</p>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", color:"#1e3a5f", fontWeight:500 }}>{f.value}</p>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {/* Vital signs */}
            <div style={{ ...card, padding:"16px 18px" }}>
              <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.82rem", color:"#0a1f36", marginBottom:12 }}>Vital Signs</p>
              {[
                { label:"Blood Pressure", value:"120/80 mmHg", icon:"❤️", status:"Normal", statusColor:"#22c55e" },
                { label:"Heart Rate", value:"72 bpm", icon:"💓", status:"Normal", statusColor:"#22c55e" },
                { label:"Blood Sugar", value:"95 mg/dL", icon:"💉", status:"Normal", statusColor:"#22c55e" },
                { label:"Weight", value:"165 lbs", icon:"⚖️", status:"Guide", statusColor:"#3b82f6" },
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
        <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.2rem", color:"#0a1f36" }}>Welcome, Santosh!</h2>
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
              <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"0.88rem", color:"#0a1f36" }}>Santosh</span>
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