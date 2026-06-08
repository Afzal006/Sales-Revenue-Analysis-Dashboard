import { useState, useEffect, useRef, useCallback } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

// ─── Synthetic Dataset ────────────────────────────────────────────────────────
const RAW_DATA = [
  { id:1,  date:"2024-01-05", product:"CloudSync Pro",   category:"Software",   region:"North", units:42,  price:299, rep:"Alex M." },
  { id:2,  date:"2024-01-08", product:"DataVault",       category:"Storage",    region:"South", units:18,  price:149, rep:"Sara K." },
  { id:3,  date:"2024-01-12", product:"NexCore Suite",   category:"Software",   region:"East",  units:31,  price:499, rep:"James T." },
  { id:4,  date:"2024-01-15", product:"CloudSync Pro",   category:"Software",   region:"West",  units:27,  price:299, rep:"Lena W." },
  { id:5,  date:"2024-01-19", product:"SmartShield",     category:"Security",   region:"North", units:55,  price:199, rep:"Alex M." },
  { id:6,  date:"2024-01-22", product:"DataVault",       category:"Storage",    region:"East",  units:22,  price:149, rep:"James T." },
  { id:7,  date:"2024-02-03", product:"NexCore Suite",   category:"Software",   region:"South", units:38,  price:499, rep:"Sara K." },
  { id:8,  date:"2024-02-07", product:"SmartShield",     category:"Security",   region:"West",  units:61,  price:199, rep:"Lena W." },
  { id:9,  date:"2024-02-11", product:"CloudSync Pro",   category:"Software",   region:"North", units:49,  price:299, rep:"Alex M." },
  { id:10, date:"2024-02-14", product:"AnalyticsEdge",   category:"Analytics",  region:"East",  units:14,  price:799, rep:"James T." },
  { id:11, date:"2024-02-18", product:"DataVault",       category:"Storage",    region:"West",  units:33,  price:149, rep:"Lena W." },
  { id:12, date:"2024-02-22", product:"NexCore Suite",   category:"Software",   region:"North", units:25,  price:499, rep:"Alex M." },
  { id:13, date:"2024-03-01", product:"SmartShield",     category:"Security",   region:"South", units:72,  price:199, rep:"Sara K." },
  { id:14, date:"2024-03-05", product:"AnalyticsEdge",   category:"Analytics",  region:"West",  units:19,  price:799, rep:"Lena W." },
  { id:15, date:"2024-03-09", product:"CloudSync Pro",   category:"Software",   region:"East",  units:58,  price:299, rep:"James T." },
  { id:16, date:"2024-03-13", product:"DataVault",       category:"Storage",    region:"North", units:41,  price:149, rep:"Alex M." },
  { id:17, date:"2024-03-17", product:"NexCore Suite",   category:"Software",   region:"South", units:34,  price:499, rep:"Sara K." },
  { id:18, date:"2024-03-21", product:"SmartShield",     category:"Security",   region:"East",  units:80,  price:199, rep:"James T." },
  { id:19, date:"2024-03-25", product:"AnalyticsEdge",   category:"Analytics",  region:"West",  units:22,  price:799, rep:"Lena W." },
  { id:20, date:"2024-04-02", product:"CloudSync Pro",   category:"Software",   region:"North", units:63,  price:299, rep:"Alex M." },
  { id:21, date:"2024-04-06", product:"DataVault",       category:"Storage",    region:"South", units:29,  price:149, rep:"Sara K." },
  { id:22, date:"2024-04-10", product:"NexCore Suite",   category:"Software",   region:"East",  units:45,  price:499, rep:"James T." },
  { id:23, date:"2024-04-14", product:"SmartShield",     category:"Security",   region:"West",  units:67,  price:199, rep:"Lena W." },
  { id:24, date:"2024-04-18", product:"AnalyticsEdge",   category:"Analytics",  region:"North", units:31,  price:799, rep:"Alex M." },
  { id:25, date:"2024-04-22", product:"CloudSync Pro",   category:"Software",   region:"South", units:51,  price:299, rep:"Sara K." },
  { id:26, date:"2024-05-02", product:"DataVault",       category:"Storage",    region:"East",  units:38,  price:149, rep:"James T." },
  { id:27, date:"2024-05-06", product:"NexCore Suite",   category:"Software",   region:"West",  units:52,  price:499, rep:"Lena W." },
  { id:28, date:"2024-05-10", product:"SmartShield",     category:"Security",   region:"North", units:91,  price:199, rep:"Alex M." },
  { id:29, date:"2024-05-14", product:"AnalyticsEdge",   category:"Analytics",  region:"South", units:28,  price:799, rep:"Sara K." },
  { id:30, date:"2024-05-18", product:"CloudSync Pro",   category:"Software",   region:"East",  units:74,  price:299, rep:"James T." },
  { id:31, date:"2024-06-01", product:"DataVault",       category:"Storage",    region:"West",  units:45,  price:149, rep:"Lena W." },
  { id:32, date:"2024-06-05", product:"NexCore Suite",   category:"Software",   region:"North", units:61,  price:499, rep:"Alex M." },
  { id:33, date:"2024-06-09", product:"SmartShield",     category:"Security",   region:"South", units:83,  price:199, rep:"Sara K." },
  { id:34, date:"2024-06-13", product:"AnalyticsEdge",   category:"Analytics",  region:"East",  units:37,  price:799, rep:"James T." },
  { id:35, date:"2024-06-17", product:"CloudSync Pro",   category:"Software",   region:"West",  units:88,  price:299, rep:"Lena W." },
];

RAW_DATA.forEach(d => { d.revenue = d.units * d.price; });

const fmt = (n) => n >= 1000000 ? `$${(n/1000000).toFixed(1)}M` : n >= 1000 ? `$${(n/1000).toFixed(1)}K` : `$${n}`;
const fmtNum = (n) => n >= 1000 ? `${(n/1000).toFixed(1)}K` : n;

const COLORS = {
  accent:  "#00E5A0",
  accent2: "#FF6B6B",
  accent3: "#FFD93D",
  accent4: "#6C63FF",
  accent5: "#00B4D8",
  bg:      "#0A0F1E",
  card:    "#111827",
  card2:   "#1A2235",
  border:  "#1E2D45",
  text:    "#E8EDF5",
  muted:   "#6B7FA3",
};

const PIE_COLORS = ["#00E5A0","#6C63FF","#FF6B6B","#FFD93D","#00B4D8"];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: COLORS.card2, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 16px", fontSize: 12, color: COLORS.text }}>
      <p style={{ color: COLORS.muted, marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || COLORS.accent }}>
          {p.name}: {typeof p.value === "number" && p.name?.toLowerCase().includes("rev") ? fmt(p.value) : p.value?.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────
const KPICard = ({ label, value, sub, color, icon, trend }) => (
  <div style={{
    background: `linear-gradient(135deg, ${COLORS.card} 60%, ${color}18)`,
    border: `1px solid ${color}33`,
    borderRadius: 16,
    padding: "20px 22px",
    display: "flex", flexDirection: "column", gap: 6,
    position: "relative", overflow: "hidden",
    boxShadow: `0 4px 24px ${color}11`
  }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      {trend !== undefined && (
        <span style={{ fontSize: 11, color: trend >= 0 ? COLORS.accent : COLORS.accent2, background: trend >= 0 ? "#00E5A015" : "#FF6B6B15", borderRadius: 20, padding: "2px 8px" }}>
          {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.text, fontFamily: "'Bebas Neue', cursive", letterSpacing: 1 }}>{value}</div>
    <div style={{ fontSize: 12, color: COLORS.muted }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: color, marginTop: 2 }}>{sub}</div>}
    <div style={{ position: "absolute", right: -18, bottom: -18, width: 70, height: 70, borderRadius: "50%", background: `${color}15`, pointerEvents: "none" }} />
  </div>
);

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ title, sub }) => (
  <div style={{ marginBottom: 14 }}>
    <h3 style={{ color: COLORS.text, fontSize: 14, fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: 2 }}>{title}</h3>
    {sub && <p style={{ color: COLORS.muted, fontSize: 11, margin: "4px 0 0" }}>{sub}</p>}
  </div>
);

// ─── Pill Filter ──────────────────────────────────────────────────────────────
const Pill = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    background: active ? COLORS.accent : "transparent",
    color: active ? COLORS.bg : COLORS.muted,
    border: `1px solid ${active ? COLORS.accent : COLORS.border}`,
    borderRadius: 20, padding: "5px 14px", fontSize: 12,
    cursor: "pointer", fontWeight: active ? 700 : 400, transition: "all .2s"
  }}>{label}</button>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [regionFilter, setRegionFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [repFilter, setRepFilter] = useState("All");
  const [csvText, setCsvText] = useState("");
  const [data, setData] = useState(RAW_DATA);
  const [importMsg, setImportMsg] = useState("");
  const fileRef = useRef();

  const regions    = ["All", ...new Set(RAW_DATA.map(d => d.region))];
  const categories = ["All", ...new Set(RAW_DATA.map(d => d.category))];
  const reps       = ["All", ...new Set(RAW_DATA.map(d => d.rep))];

  const filtered = data.filter(d =>
    (regionFilter   === "All" || d.region   === regionFilter) &&
    (categoryFilter === "All" || d.category === categoryFilter) &&
    (repFilter      === "All" || d.rep      === repFilter)
  );

  // KPIs
  const totalRevenue  = filtered.reduce((s, d) => s + d.revenue, 0);
  const totalUnits    = filtered.reduce((s, d) => s + d.units, 0);
  const avgDeal       = filtered.length ? Math.round(totalRevenue / filtered.length) : 0;
  const totalTxns     = filtered.length;

  // Monthly trend
  const months = ["Jan","Feb","Mar","Apr","May","Jun"];
  const monthlyData = months.map((m, i) => {
    const mo = filtered.filter(d => new Date(d.date).getMonth() === i);
    return { month: m, revenue: mo.reduce((s,d)=>s+d.revenue,0), units: mo.reduce((s,d)=>s+d.units,0), deals: mo.length };
  });

  // Top products
  const productMap = {};
  filtered.forEach(d => { productMap[d.product] = (productMap[d.product]||0) + d.revenue; });
  const topProducts = Object.entries(productMap).sort((a,b)=>b[1]-a[1]).map(([name,rev])=>({ name, rev }));

  // Category pie
  const catMap = {};
  filtered.forEach(d => { catMap[d.category] = (catMap[d.category]||0) + d.revenue; });
  const catPie = Object.entries(catMap).map(([name,value])=>({ name, value }));

  // Rep leaderboard
  const repMap = {};
  filtered.forEach(d => { repMap[d.rep] = (repMap[d.rep]||0) + d.revenue; });
  const repBoard = Object.entries(repMap).sort((a,b)=>b[1]-a[1]);
  const repMax = repBoard[0]?.[1] || 1;

  // CSV import
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const lines = ev.target.result.split("\n").filter(Boolean);
        const headers = lines[0].split(",").map(h=>h.trim().toLowerCase());
        const rows = lines.slice(1).map((line, idx) => {
          const vals = line.split(",");
          const obj = {};
          headers.forEach((h,i) => obj[h] = vals[i]?.trim());
          return {
            id: 1000+idx,
            date: obj.date || "2024-01-01",
            product: obj.product || "Imported",
            category: obj.category || "Other",
            region: obj.region || "Other",
            units: parseInt(obj.units)||0,
            price: parseFloat(obj.price)||0,
            rep: obj.rep || "Unknown",
            revenue: (parseInt(obj.units)||0)*(parseFloat(obj.price)||0),
          };
        });
        setData([...RAW_DATA, ...rows]);
        setImportMsg(`✅ Imported ${rows.length} rows from ${file.name}`);
      } catch { setImportMsg("❌ Could not parse file. Expected: date,product,category,region,units,price,rep"); }
    };
    reader.readAsText(file);
  };

  const globalStyle = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
    ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius:4px; }
  `;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: COLORS.bg, minHeight: "100vh", color: COLORS.text, padding: "24px 20px" }}>
      <style>{globalStyle}</style>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 36, letterSpacing: 3, color: COLORS.accent, lineHeight: 1 }}>
            REVENUE COMMAND
          </h1>
          <p style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}>Sales & Performance Intelligence · FY 2024</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => fileRef.current.click()}
            style={{
              background: `linear-gradient(135deg, ${COLORS.accent}, #00B37A)`,
              color: COLORS.bg, border: "none", borderRadius: 10,
              padding: "9px 18px", fontWeight: 700, fontSize: 12,
              cursor: "pointer", letterSpacing: 1, display: "flex", alignItems: "center", gap: 6
            }}>
            ⬆ IMPORT CSV / EXCEL
          </button>
          <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" style={{ display:"none" }} onChange={handleFile} />
          {importMsg && <span style={{ fontSize: 11, color: COLORS.accent, background: "#00E5A010", borderRadius: 8, padding: "6px 12px", border:`1px solid ${COLORS.accent}33` }}>{importMsg}</span>}
        </div>
      </div>

      {/* ── Filters ── */}
      <div style={{ display: "flex", gap: 24, marginBottom: 24, flexWrap: "wrap" }}>
        <div>
          <p style={{ fontSize: 10, color: COLORS.muted, marginBottom: 6, textTransform:"uppercase", letterSpacing:1 }}>Region</p>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {regions.map(r => <Pill key={r} label={r} active={regionFilter===r} onClick={()=>setRegionFilter(r)} />)}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 10, color: COLORS.muted, marginBottom: 6, textTransform:"uppercase", letterSpacing:1 }}>Category</p>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {categories.map(c => <Pill key={c} label={c} active={categoryFilter===c} onClick={()=>setCategoryFilter(c)} />)}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 10, color: COLORS.muted, marginBottom: 6, textTransform:"uppercase", letterSpacing:1 }}>Sales Rep</p>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {reps.map(r => <Pill key={r} label={r} active={repFilter===r} onClick={()=>setRepFilter(r)} />)}
          </div>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:14, marginBottom:24 }}>
        <KPICard label="Total Revenue" value={fmt(totalRevenue)} icon="💰" color={COLORS.accent}  trend={14} sub="YTD across all segments" />
        <KPICard label="Units Sold"    value={fmtNum(totalUnits)} icon="📦" color={COLORS.accent4} trend={8}  sub="All product lines" />
        <KPICard label="Avg Deal Size" value={fmt(avgDeal)}      icon="🎯" color={COLORS.accent3} trend={-3} sub="Per transaction" />
        <KPICard label="Transactions"  value={totalTxns}         icon="📋" color={COLORS.accent5} trend={22} sub="Completed deals" />
      </div>

      {/* ── Revenue Trend + Category Pie ── */}
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16, marginBottom:16 }}>
        <div style={{ background: COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:16, padding:20 }}>
          <SectionHeader title="Revenue Trend" sub="Monthly performance over the year" />
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.25}/>
                  <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="month" tick={{fill:COLORS.muted, fontSize:11}} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v=>fmt(v)} tick={{fill:COLORS.muted, fontSize:10}} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke={COLORS.accent} strokeWidth={2.5} fill="url(#revGrad)" dot={{ fill: COLORS.accent, r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:16, padding:20 }}>
          <SectionHeader title="Revenue by Category" />
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={catPie} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {catPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: COLORS.card2, border:`1px solid ${COLORS.border}`, borderRadius:8, fontSize:12, color: COLORS.text }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:11, color: COLORS.muted }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Top Products + Units Bar ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <div style={{ background: COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:16, padding:20 }}>
          <SectionHeader title="Top Products by Revenue" />
          {topProducts.map((p, i) => {
            const pct = Math.round((p.rev / (topProducts[0]?.rev||1)) * 100);
            return (
              <div key={p.name} style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:12, color: COLORS.text, display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ color: PIE_COLORS[i % PIE_COLORS.length], fontWeight:800 }}>#{i+1}</span> {p.name}
                  </span>
                  <span style={{ fontSize:12, color: COLORS.accent, fontWeight:700 }}>{fmt(p.rev)}</span>
                </div>
                <div style={{ background: COLORS.border, borderRadius:4, height:5 }}>
                  <div style={{ width:`${pct}%`, height:"100%", borderRadius:4, background:`linear-gradient(90deg, ${PIE_COLORS[i%PIE_COLORS.length]}, ${PIE_COLORS[i%PIE_COLORS.length]}88)`, transition:"width .6s" }} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background: COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:16, padding:20 }}>
          <SectionHeader title="Monthly Units Sold" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} barSize={26}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
              <XAxis dataKey="month" tick={{fill:COLORS.muted, fontSize:11}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill:COLORS.muted, fontSize:10}} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="units" name="Units" fill={COLORS.accent4} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Sales Rep Leaderboard ── */}
      <div style={{ background: COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:16, padding:20, marginBottom:16 }}>
        <SectionHeader title="Sales Rep Leaderboard" sub="Revenue contribution per representative" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:12 }}>
          {repBoard.map(([rep, rev], i) => (
            <div key={rep} style={{ background: COLORS.card2, borderRadius:12, padding:"14px 16px", border:`1px solid ${i===0 ? COLORS.accent+"44" : COLORS.border}`, position:"relative" }}>
              {i===0 && <span style={{ position:"absolute", top:10, right:12, fontSize:16 }}>🏆</span>}
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg, ${PIE_COLORS[i%PIE_COLORS.length]}, ${PIE_COLORS[i%PIE_COLORS.length]}66)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color: COLORS.bg }}>
                  {rep.split(" ").map(n=>n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color: COLORS.text }}>{rep}</div>
                  <div style={{ fontSize:11, color: COLORS.muted }}>Rank #{i+1}</div>
                </div>
              </div>
              <div style={{ fontSize:20, fontWeight:800, color: PIE_COLORS[i%PIE_COLORS.length], fontFamily:"'Bebas Neue', cursive", letterSpacing:1 }}>{fmt(rev)}</div>
              <div style={{ background: COLORS.border, borderRadius:4, height:4, marginTop:8 }}>
                <div style={{ width:`${Math.round(rev/repMax*100)}%`, height:"100%", borderRadius:4, background: PIE_COLORS[i%PIE_COLORS.length] }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Transactions Table ── */}
      <div style={{ background: COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:16, padding:20 }}>
        <SectionHeader title="Recent Transactions" sub={`Showing ${Math.min(filtered.length, 10)} of ${filtered.length} records`} />
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${COLORS.border}` }}>
                {["Date","Product","Category","Region","Rep","Units","Price","Revenue"].map(h=>(
                  <th key={h} style={{ textAlign:"left", padding:"8px 12px", color:COLORS.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:1, fontSize:10, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0,10).map((row, i) => (
                <tr key={row.id} style={{ borderBottom:`1px solid ${COLORS.border}22`, background: i%2===0 ? "transparent" : COLORS.card2+"44" }}>
                  <td style={{ padding:"9px 12px", color: COLORS.muted }}>{row.date}</td>
                  <td style={{ padding:"9px 12px", color: COLORS.text, fontWeight:600 }}>{row.product}</td>
                  <td style={{ padding:"9px 12px" }}><span style={{ background:`${COLORS.accent4}22`, color:COLORS.accent4, borderRadius:20, padding:"2px 10px" }}>{row.category}</span></td>
                  <td style={{ padding:"9px 12px", color: COLORS.muted }}>{row.region}</td>
                  <td style={{ padding:"9px 12px", color: COLORS.text }}>{row.rep}</td>
                  <td style={{ padding:"9px 12px", color: COLORS.accent3 }}>{row.units}</td>
                  <td style={{ padding:"9px 12px", color: COLORS.muted }}>${row.price}</td>
                  <td style={{ padding:"9px 12px", color: COLORS.accent, fontWeight:700 }}>{fmt(row.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign:"center", marginTop:24, color: COLORS.muted, fontSize:11, letterSpacing:1 }}>
        REVENUE COMMAND DASHBOARD · SALES INTELLIGENCE PLATFORM · {new Date().getFullYear()}
      </div>
    </div>
  );
}
