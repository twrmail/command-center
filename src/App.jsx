import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// PIN Protection
const CORRECT_PIN = '8667';
function PinScreen({ onUnlock }) {
  const [entry, setEntry] = useState('');
  const [error, setError] = useState(false);
  const press = (v) => {
    if (v === 'C') { setEntry(''); return; }
    if (v === 'D') { setEntry(p => p.slice(0,-1)); return; }
    if (entry.length >= 4) return;
    const next = entry + v;
    setEntry(next);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === CORRECT_PIN) { onUnlock(); }
        else { setError(true); setEntry(''); setTimeout(() => setError(false), 1500); }
      }, 150);
    }
  };
  return (
    <div style={{ minHeight:'100vh', background:'#0f0f0f', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24 }}>
      <div style={{ fontSize:14, letterSpacing:3, textTransform:'uppercase', color:COLORS.accent }}>CommCon</div>
      <div style={{ display:'flex', gap:16 }}>
        {[0,1,2,3].map(i => <div key={i} style={{ width:14, height:14, borderRadius:'50%', border:`2px solid ${COLORS.accent}`, background: i < entry.length ? COLORS.accent : 'transparent' }}/>)}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 64px)', gap:10 }}>
        {[1,2,3,4,5,6,7,8,9,'C',0,'D'].map(v => (
          <button key={v} onClick={() => press(v)} style={{ width:64, height:64, borderRadius:'50%', border:`1.5px solid ${COLORS.border}`, background:COLORS.card, color:COLORS.text, fontSize:20, cursor:'pointer', fontFamily:'inherit' }}>{v}</button>
        ))}
      </div>
      {error && <div style={{ color:COLORS.red, fontSize:13 }}>Incorrect PIN</div>}
    </div>
  );
}
// Keep Supabase alive — pings every 4 days
setInterval(async () => {
  await supabase.from("tasks").select("id").limit(1);
}, 1000 * 60 * 60 * 24 * 4);

const COLORS = {
  bg: "#0f0f0f", surface: "#161616", card: "#1c1c1c", border: "#2a2a2a",
  accent: "#c8a96e", accentDim: "#8a7048", green: "#4caf7d", red: "#e05c5c",
  blue: "#5b9bd5", purple: "#9b7fe8", text: "#e8e2d9", muted: "#6b6560", dim: "#3a3530",
};

const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);
const today = () => new Date().toISOString().split("T")[0];

const Icon = ({ d, size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const icons = {
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  finance: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  idea: "M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7 7 7 0 0 1-3.5 6.06V17H8.5v-1.94A7 7 0 0 1 5 9a7 7 0 0 1 7-7z",
  daughters: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  daily: "M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  plus: "M12 5v14M5 12h14",
  trash: "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  check: "M20 6L9 17l-5-5",
};

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20, ...style }}>
    {children}
  </div>
);

const Badge = ({ label, color = COLORS.accent }) => (
  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color, background: color + "22", padding: "3px 8px", borderRadius: 20 }}>
    {label}
  </span>
);

const Btn = ({ children, onClick, variant = "primary", small = false, style = {} }) => {
  const base = { border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: small ? 12 : 14, padding: small ? "6px 12px" : "10px 18px", transition: "all 0.15s", ...style };
  const variants = {
    primary: { background: COLORS.accent, color: "#0f0f0f" },
    ghost: { background: "transparent", color: COLORS.muted, border: `1px solid ${COLORS.border}` },
    danger: { background: COLORS.red + "22", color: COLORS.red, border: `1px solid ${COLORS.red}44` },
    success: { background: COLORS.green + "22", color: COLORS.green, border: `1px solid ${COLORS.green}44` },
  };
  return <button onClick={onClick} style={{ ...base, ...variants[variant] }}>{children}</button>;
};

const Input = ({ value, onChange, placeholder, type = "text", style = {} }) => (
  <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontFamily: "inherit", fontSize: 14, padding: "9px 12px", outline: "none", width: "100%", boxSizing: "border-box", ...style }} />
);

const Select = ({ value, onChange, options, style = {} }) => (
  <select value={value} onChange={e => onChange(e.target.value)}
    style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontFamily: "inherit", fontSize: 14, padding: "9px 12px", outline: "none", cursor: "pointer", ...style }}>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const Label = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: COLORS.muted, marginBottom: 6 }}>{children}</div>
);

function DailyTab() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("high");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    const { data } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
    setTasks(data || []);
    setLoading(false);
  };

  const add = async () => {
    if (!input.trim()) return;
    const { data } = await supabase.from("tasks").insert([{ text: input.trim(), priority, done: false, date: today() }]).select();
    if (data) setTasks(prev => [...data, ...prev]);
    setInput("");
  };

  const toggle = async (id, done) => {
    await supabase.from("tasks").update({ done: !done }).eq("id", id);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !done } : t));
  };

  const remove = async (id) => {
    await supabase.from("tasks").delete().eq("id", id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const todayTasks = tasks.filter(t => t.date === today());
  const pastTasks = tasks.filter(t => t.date !== today() && !t.done).slice(0, 5);
  const pColor = { high: COLORS.red, medium: COLORS.accent, low: COLORS.green };
  const pLabel = { high: "HIGH", medium: "MED", low: "LOW" };

  const TaskRow = ({ task }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}`, opacity: task.done ? 0.4 : 1 }}>
      <div onClick={() => toggle(task.id, task.done)} style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${task.done ? COLORS.green : COLORS.border}`, background: task.done ? COLORS.green + "33" : "transparent", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {task.done && <Icon d={icons.check} size={12} color={COLORS.green} />}
      </div>
      <Badge label={pLabel[task.priority]} color={pColor[task.priority]} />
      <span style={{ flex: 1, fontSize: 14, color: COLORS.text, textDecoration: task.done ? "line-through" : "none" }}>{task.text}</span>
      <button onClick={() => remove(task.id)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.muted, padding: 4 }}>
        <Icon d={icons.trash} size={14} />
      </button>
    </div>
  );

  if (loading) return <div style={{ color: COLORS.muted, textAlign: "center", padding: 40 }}>Loading...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {[
          { label: "Today's Tasks", val: todayTasks.length, color: COLORS.blue },
          { label: "High Priority", val: todayTasks.filter(t => t.priority === "high" && !t.done).length, color: COLORS.red },
          { label: "Completed", val: todayTasks.filter(t => t.done).length, color: COLORS.green },
        ].map(s => (
          <Card key={s.label} style={{ textAlign: "center", padding: 16 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4, letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</div>
          </Card>
        ))}
      </div>
      <Card>
        <Label>Add Today's Task</Label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Input value={input} onChange={setInput} placeholder="What moves the needle today?" style={{ flex: 1, minWidth: 200 }} />
          <Select value={priority} onChange={setPriority} options={[{ value: "high", label: "🔴 High" }, { value: "medium", label: "🟡 Medium" }, { value: "low", label: "🟢 Low" }]} style={{ width: 130 }} />
          <Btn onClick={add}>Add Task</Btn>
        </div>
      </Card>
      <Card>
        <Label>Today — {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</Label>
        {todayTasks.length === 0 ? <div style={{ color: COLORS.muted, fontSize: 14, textAlign: "center", padding: "20px 0" }}>No tasks yet today.</div>
          : [...todayTasks].sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority])).map(t => <TaskRow key={t.id} task={t} />)}
      </Card>
      {pastTasks.length > 0 && (
        <Card>
          <Label>Carried Over</Label>
          {pastTasks.map(t => <TaskRow key={t.id} task={t} />)}
        </Card>
      )}
    </div>
  );
}

function FinanceTab() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ label: "", amount: "", type: "income", category: "Job", date: today() });
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchEntries(); }, []);

  const fetchEntries = async () => {
    const { data } = await supabase.from("transactions").select("*").order("created_at", { ascending: false });
    setEntries(data || []);
    setLoading(false);
  };

  const add = async () => {
    if (!form.label.trim() || !form.amount) return;
    const { data } = await supabase.from("transactions").insert([{ ...form, amount: parseFloat(form.amount) }]).select();
    if (data) setEntries(prev => [...data, ...prev]);
    setForm(prev => ({ ...prev, label: "", amount: "" }));
  };

  const remove = async (id) => {
    await supabase.from("transactions").delete().eq("id", id);
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const income = entries.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
  const expenses = entries.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);
  const net = income - expenses;
  const filtered = filter === "all" ? entries : entries.filter(e => e.type === filter);
  const incomeCategories = ["Job", "Freelance", "Side Project", "Investment", "Other Income"];
  const expenseCategories = ["Housing", "Food", "Transport", "Utilities", "Daughters", "Business", "Subscriptions", "Other"];
  const incomeSources = {};
  entries.filter(e => e.type === "income").forEach(e => { incomeSources[e.category] = (incomeSources[e.category] || 0) + e.amount; });

  if (loading) return <div style={{ color: COLORS.muted, textAlign: "center", padding: 40 }}>Loading...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {[{ label: "Total Income", val: fmt(income), color: COLORS.green }, { label: "Total Expenses", val: fmt(expenses), color: COLORS.red }, { label: "Net Position", val: fmt(net), color: net >= 0 ? COLORS.green : COLORS.red }].map(s => (
          <Card key={s.label} style={{ textAlign: "center", padding: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4, letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</div>
          </Card>
        ))}
      </div>
      {Object.keys(incomeSources).length > 0 && (
        <Card>
          <Label>Income Streams</Label>
          {Object.entries(incomeSources).map(([cat, amt]) => (
            <div key={cat} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <span style={{ fontSize: 13, color: COLORS.text }}>{cat}</span>
              <span style={{ fontSize: 13, color: COLORS.green, fontWeight: 700 }}>{fmt(amt)}</span>
            </div>
          ))}
          {Object.keys(incomeSources).length === 1 && (
            <div style={{ marginTop: 10, padding: "8px 12px", background: COLORS.accent + "11", borderRadius: 8, fontSize: 12, color: COLORS.accent }}>⚠️ Single income stream — add a second source for resilience.</div>
          )}
        </Card>
      )}
      <Card>
        <Label>Log Transaction</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
          <div><Label>Type</Label><Select value={form.type} onChange={v => setForm(p => ({ ...p, type: v, category: v === "income" ? "Job" : "Housing" }))} options={[{ value: "income", label: "💰 Income" }, { value: "expense", label: "💸 Expense" }]} style={{ width: "100%" }} /></div>
          <div><Label>Category</Label><Select value={form.category} onChange={v => setForm(p => ({ ...p, category: v }))} options={(form.type === "income" ? incomeCategories : expenseCategories).map(c => ({ value: c, label: c }))} style={{ width: "100%" }} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
          <div><Label>Description</Label><Input value={form.label} onChange={v => setForm(p => ({ ...p, label: v }))} placeholder="e.g. Freelance project" /></div>
          <div><Label>Amount ($)</Label><Input value={form.amount} onChange={v => setForm(p => ({ ...p, amount: v }))} placeholder="0.00" type="number" /></div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}><Label>Date</Label><Input value={form.date} onChange={v => setForm(p => ({ ...p, date: v }))} type="date" /></div>
          <Btn onClick={add}>Log It</Btn>
        </div>
      </Card>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Label>Transaction History</Label>
          <div style={{ display: "flex", gap: 6 }}>
            {["all", "income", "expense"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, border: `1px solid ${filter === f ? COLORS.accent : COLORS.border}`, background: filter === f ? COLORS.accent + "22" : "transparent", color: filter === f ? COLORS.accent : COLORS.muted, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>{f}</button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? <div style={{ color: COLORS.muted, fontSize: 14, textAlign: "center", padding: "20px 0" }}>No transactions logged yet.</div>
          : filtered.slice(0, 30).map(e => (
            <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: e.type === "income" ? COLORS.green : COLORS.red, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: COLORS.text }}>{e.label}</div>
                <div style={{ fontSize: 11, color: COLORS.muted }}>{e.category} · {e.date}</div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: e.type === "income" ? COLORS.green : COLORS.red }}>{e.type === "income" ? "+" : "-"}{fmt(e.amount)}</span>
              <button onClick={() => remove(e.id)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.muted, padding: 4 }}><Icon d={icons.trash} size={13} /></button>
            </div>
          ))}
      </Card>
    </div>
  );
}
function IdeasTab() {
  const [ideas, setIdeas] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", q1: false, q2: false, q3: false });
  const [view, setView] = useState("active");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchIdeas(); }, []);

  const fetchIdeas = async () => {
    const { data } = await supabase.from("ideas").select("*").order("created_at", { ascending: false });
    setIdeas(data || []);
    setLoading(false);
  };

  const score = (idea) => [idea.q1, idea.q2, idea.q3].filter(Boolean).length;

  const add = async () => {
    if (!form.title.trim()) return;
    const s = score(form);
    const status = s === 3 ? "active" : s >= 2 ? "watch" : "archive";
    const { data } = await supabase.from("ideas").insert([{ ...form, status }]).select();
    if (data) setIdeas(prev => [...data, ...prev]);
    setForm({ title: "", description: "", q1: false, q2: false, q3: false });
  };

  const updateStatus = async (id, status) => {
    await supabase.from("ideas").update({ status }).eq("id", id);
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  const remove = async (id) => {
    await supabase.from("ideas").delete().eq("id", id);
    setIdeas(prev => prev.filter(i => i.id !== id));
  };

  const activeIdeas = ideas.filter(i => i.status === "active");
  const watchIdeas = ideas.filter(i => i.status === "watch");
  const archiveIdeas = ideas.filter(i => i.status === "archive");
  const statusMap = { active: activeIdeas, watch: watchIdeas, archive: archiveIdeas };
  const statusColor = { active: COLORS.green, watch: COLORS.accent, archive: COLORS.muted };

  const IdeaCard = ({ idea }) => (
    <div style={{ padding: "14px 0", borderBottom: `1px solid ${COLORS.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{ width: 8, height: 8, borderRadius: "50%", background: score(idea) >= n ? COLORS.accent : COLORS.dim }} />
          ))}
          <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{idea.title}</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {idea.status !== "active" && <Btn onClick={() => updateStatus(idea.id, "active")} small variant="success">Activate</Btn>}
          {idea.status !== "archive" && <Btn onClick={() => updateStatus(idea.id, "archive")} small variant="ghost">Archive</Btn>}
          <Btn onClick={() => remove(idea.id)} small variant="danger">✕</Btn>
        </div>
      </div>
      {idea.description && <p style={{ fontSize: 12, color: COLORS.muted, margin: "4px 0 0 24px" }}>{idea.description}</p>}
      <div style={{ display: "flex", gap: 12, marginTop: 6, marginLeft: 24 }}>
        {[["Under $500 to start", idea.q1], ["Passive within 12mo", idea.q2], ["Durable after bad week", idea.q3]].map(([label, val]) => (
          <span key={label} style={{ fontSize: 10, color: val ? COLORS.green : COLORS.muted }}>
            {val ? "✓" : "✗"} {label}
          </span>
        ))}
      </div>
    </div>
  );

  if (loading) return <div style={{ color: COLORS.muted, textAlign: "center", padding: 40 }}>Loading...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {[
          { label: "Active", val: activeIdeas.length, color: COLORS.green, cap: 2 },
          { label: "Watch List", val: watchIdeas.length, color: COLORS.accent },
          { label: "Archive", val: archiveIdeas.length, color: COLORS.muted },
        ].map(s => (
          <Card key={s.label} style={{ textAlign: "center", padding: 16 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.val > (s.cap || 999) ? COLORS.red : s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4, letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</div>
            {s.cap && s.val > s.cap && <div style={{ fontSize: 10, color: COLORS.red, marginTop: 4 }}>⚠ Over limit</div>}
          </Card>
        ))}
      </div>
      {activeIdeas.length >= 2 && (
        <div style={{ padding: "12px 16px", background: COLORS.accent + "11", border: `1px solid ${COLORS.accent}33`, borderRadius: 10, fontSize: 13, color: COLORS.accent }}>
          ⚡ Active slots full (2/2). Finish one before activating another.
        </div>
      )}
      <Card>
        <Label>Capture New Idea</Label>
        <Input value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} placeholder="Idea name" style={{ marginBottom: 8 }} />
        <Input value={form.description} onChange={v => setForm(p => ({ ...p, description: v }))} placeholder="Brief description (optional)" style={{ marginBottom: 12 }} />
        <Label>3-Question Filter</Label>
        {[["q1", "Can I start this for under $500?"], ["q2", "Could this earn passively within 12 months?"], ["q3", "Would I still care about this after a bad week?"]].map(([key, label]) => (
          <label key={key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, cursor: "pointer" }}>
            <div onClick={() => setForm(p => ({ ...p, [key]: !p[key] }))} style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${form[key] ? COLORS.accent : COLORS.border}`, background: form[key] ? COLORS.accent + "33" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {form[key] && <Icon d={icons.check} size={12} color={COLORS.accent} />}
            </div>
            <span style={{ fontSize: 13, color: form[key] ? COLORS.text : COLORS.muted }}>{label}</span>
          </label>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <span style={{ fontSize: 12, color: COLORS.muted }}>
            Score: {score(form)}/3 → <strong style={{ color: score(form) === 3 ? COLORS.green : score(form) >= 2 ? COLORS.accent : COLORS.muted }}>
              {score(form) === 3 ? "Active" : score(form) >= 2 ? "Watch" : "Archive"}
            </strong>
          </span>
          <Btn onClick={add}>Capture Idea</Btn>
        </div>
      </Card>
      <Card>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["active", "watch", "archive"].map(s => (
            <button key={s} onClick={() => setView(s)} style={{ fontSize: 12, padding: "5px 14px", borderRadius: 20, border: `1px solid ${view === s ? statusColor[s] : COLORS.border}`, background: view === s ? statusColor[s] + "22" : "transparent", color: view === s ? statusColor[s] : COLORS.muted, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>
              {s} ({statusMap[s].length})
            </button>
          ))}
        </div>
        {statusMap[view].length === 0
          ? <div style={{ color: COLORS.muted, fontSize: 14, textAlign: "center", padding: "20px 0" }}>No ideas in {view}.</div>
          : statusMap[view].map(idea => <IdeaCard key={idea.id} idea={idea} />)}
      </Card>
    </div>
  );
}

function DaughtersTab() {
  const [daughters, setDaughters] = useState({ d1: null, d2: null });
  const [activeD, setActiveD] = useState("d1");
  const [goalInput, setGoalInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDaughters(); }, []);

  const fetchDaughters = async () => {
    const { data } = await supabase.from("daughters").select("*");
    const d1 = data?.find(d => d.daughter_key === "d1") || { daughter_key: "d1", name: "Daughter 1 (18)", notes: "", milestones: {}, goals: [] };
    const d2 = data?.find(d => d.daughter_key === "d2") || { daughter_key: "d2", name: "Daughter 2 (13)", notes: "", milestones: {}, goals: [] };
    setDaughters({ d1, d2 });
    setLoading(false);
  };

  const save = async (key, updated) => {
    const d = updated[key];
    if (d.id) {
      await supabase.from("daughters").update(d).eq("id", d.id);
    } else {
      const { data } = await supabase.from("daughters").insert([d]).select();
      if (data) updated[key] = data[0];
    }
    setDaughters({ ...updated });
  };

  const update = (field, val) => {
    const updated = { ...daughters, [activeD]: { ...daughters[activeD], [field]: val } };
    save(activeD, updated);
  };

  const addGoal = () => {
    if (!goalInput.trim()) return;
    const goals = [...(daughters[activeD].goals || []), { id: Date.now(), text: goalInput.trim(), done: false }];
    update("goals", goals);
    setGoalInput("");
  };

  const toggleGoal = (id) => {
    const goals = daughters[activeD].goals.map(g => g.id === id ? { ...g, done: !g.done } : g);
    update("goals", goals);
  };

  const removeGoal = (id) => {
    const goals = daughters[activeD].goals.filter(g => g.id !== id);
    update("goals", goals);
  };

  const d = daughters[activeD];
  const d1Milestones = [
    { key: "rothOpened", label: "Roth IRA account opened", detail: "Schwab — free, takes 15 min" },
    { key: "firstContribution", label: "First contribution made", detail: "Even $50 counts. The habit is the point." },
    { key: "skillIdentified", label: "Monetizable skill identified", detail: "What can she offer that someone will pay for?" },
  ];
  const d2Milestones = [
    { key: "firstConvo", label: "First money conversation", detail: "Curiosity-based, not a lecture" },
    { key: "skillIdentified", label: "Skill she's proud of noted", detail: "Seed for future earned income" },
    { key: "earnedIncome", label: "First earned income", detail: "Babysitting, tutoring, creative work" },
  ];
  const milestones = activeD === "d1" ? d1Milestones : d2Milestones;

  if (loading || !d) return <div style={{ color: COLORS.muted, textAlign: "center", padding: 40 }}>Loading...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {["d1", "d2"].map(key => (
          <Card key={key} onClick={() => setActiveD(key)} style={{ cursor: "pointer", border: `1px solid ${activeD === key ? COLORS.purple : COLORS.border}`, background: activeD === key ? COLORS.purple + "11" : COLORS.card, textAlign: "center", padding: 16 }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{key === "d1" ? "👩" : "👧"}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: activeD === key ? COLORS.purple : COLORS.text }}>{daughters[key]?.name}</div>
          </Card>
        ))}
      </div>
      <Card>
        <Label>Name</Label>
        <Input value={d.name || ""} onChange={v => update("name", v)} placeholder="Her name" />
      </Card>
      <Card>
        <Label>Key Milestones</Label>
        {milestones.map(m => (
          <div key={m.key} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
            <div onClick={() => update("milestones", { ...(d.milestones || {}), [m.key]: !(d.milestones || {})[m.key] })} style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${(d.milestones || {})[m.key] ? COLORS.purple : COLORS.border}`, background: (d.milestones || {})[m.key] ? COLORS.purple + "33" : "transparent", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
              {(d.milestones || {})[m.key] && <Icon d={icons.check} size={12} color={COLORS.purple} />}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{m.label}</div>
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{m.detail}</div>
            </div>
          </div>
        ))}
      </Card>
      <Card>
        <Label>Goals</Label>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <Input value={goalInput} onChange={setGoalInput} placeholder="Add a goal" />
          <Btn onClick={addGoal}>Add</Btn>
        </div>
        {(d.goals || []).length === 0
          ? <div style={{ color: COLORS.muted, fontSize: 13, textAlign: "center", padding: "12px 0" }}>No goals yet.</div>
          : (d.goals || []).map(g => (
            <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${COLORS.border}`, opacity: g.done ? 0.5 : 1 }}>
              <div onClick={() => toggleGoal(g.id)} style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${g.done ? COLORS.purple : COLORS.border}`, background: g.done ? COLORS.purple + "33" : "transparent", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {g.done && <Icon d={icons.check} size={10} color={COLORS.purple} />}
              </div>
              <span style={{ flex: 1, fontSize: 13, color: COLORS.text, textDecoration: g.done ? "line-through" : "none" }}>{g.text}</span>
              <button onClick={() => removeGoal(g.id)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.muted }}><Icon d={icons.trash} size={13} /></button>
            </div>
          ))}
      </Card>
      <Card>
        <Label>Notes</Label>
        <textarea value={d.notes || ""} onChange={e => update("notes", e.target.value)} placeholder="Observations, conversations, ideas for her..."
          style={{ width: "100%", minHeight: 100, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontFamily: "inherit", fontSize: 13, padding: 12, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
      </Card>
    </div>
  );
}

function OverviewTab({ setTab }) {
  const [stats, setStats] = useState({ income: 0, expenses: 0, activeIdeas: 0, todayTasks: 0, doneTasks: 0, streams: 0 });
  const [alerts, setAlerts] = useState([]);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    const [{ data: transactions }, { data: ideas }, { data: tasks }, { data: daughters }] = await Promise.all([
      supabase.from("transactions").select("*"),
      supabase.from("ideas").select("*"),
      supabase.from("tasks").select("*"),
      supabase.from("daughters").select("*"),
    ]);
    const income = (transactions || []).filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
    const expenses = (transactions || []).filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);
    const activeIdeas = (ideas || []).filter(i => i.status === "active").length;
    const todayT = (tasks || []).filter(t => t.date === today());
    const streams = [...new Set((transactions || []).filter(e => e.type === "income").map(e => e.category))].length;
    setStats({ income, expenses, activeIdeas, todayTasks: todayT.length, doneTasks: todayT.filter(t => t.done).length, streams });
    const a = [];
    if (income === 0) a.push({ msg: "Log your income streams in Finance tab", color: COLORS.red });
    if (activeIdeas === 0) a.push({ msg: "No active ideas — capture your best one in Ideas tab", color: COLORS.accent });
    if (activeIdeas > 2) a.push({ msg: `${activeIdeas} active ideas — archive the weakest ones`, color: COLORS.red });
    const d1 = (daughters || []).find(d => d.daughter_key === "d1");
    if (!d1?.milestones?.rothOpened) a.push({ msg: "Roth IRA not yet opened for your 18-year-old", color: COLORS.purple });
    setAlerts(a);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ fontFamily: "'Georgia', serif", fontSize: 13, color: COLORS.muted, letterSpacing: 1 }}>
        {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { label: "Net Position", val: fmt(stats.income - stats.expenses), color: stats.income >= stats.expenses ? COLORS.green : COLORS.red, tab: "finance" },
          { label: "Active Ideas", val: `${stats.activeIdeas}/2`, color: stats.activeIdeas > 2 ? COLORS.red : COLORS.accent, tab: "ideas" },
          { label: "Today's Progress", val: `${stats.doneTasks}/${stats.todayTasks}`, color: COLORS.blue, tab: "daily" },
          { label: "Income Streams", val: stats.streams, color: COLORS.green, tab: "finance" },
        ].map(s => (
          <Card key={s.label} onClick={() => setTab(s.tab)} style={{ cursor: "pointer", padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4, letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</div>
          </Card>
        ))}
      </div>
      {alerts.length > 0 && (
        <Card>
          <Label>⚡ Action Items</Label>
          {alerts.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: COLORS.text }}>{a.msg}</span>
            </div>
          ))}
        </Card>
      )}
      <Card style={{ background: COLORS.accent + "08", border: `1px solid ${COLORS.accent}22` }}>
        <Label>Daily 3 Questions</Label>
        {["What one action moves my most important project forward today?", "What one financial action can I take today, however small?", "What can I do for my daughters today — even just a conversation?"].map((q, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < 2 ? `1px solid ${COLORS.border}` : "none" }}>
            <span style={{ fontSize: 18, color: COLORS.accent, lineHeight: 1 }}>{i + 1}</span>
            <span style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6 }}>{q}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

export default function App() {
  const [unlocked, setUnlocked] = useState(
    sessionStorage.getItem('cc_unlocked') === 'true'
  );
  const unlock = () => { sessionStorage.setItem('cc_unlocked','true'); setUnlocked(true); };
  if (!unlocked) return <PinScreen onUnlock={unlock} />;
  const [tab, setTab] = useState("overview");
  const tabs = [
    { id: "overview", label: "Overview", icon: icons.home },
    { id: "daily", label: "Daily", icon: icons.daily },
    { id: "finance", label: "Finance", icon: icons.finance },
    { id: "ideas", label: "Ideas", icon: icons.idea },
    { id: "daughters", label: "Daughters", icon: icons.daughters },
  ];

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'DM Sans', 'Trebuchet MS', sans-serif" }}>
      <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: COLORS.bg, zIndex: 10 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.5, color: COLORS.accent, fontFamily: "'Georgia', serif" }}>Command Center</div>
          <div style={{ fontSize: 11, color: COLORS.muted, letterSpacing: 1, textTransform: "uppercase" }}>Personal Operating System</div>
        </div>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.green, boxShadow: `0 0 8px ${COLORS.green}` }} />
      </div>
      <div style={{ display: "flex", gap: 2, padding: "12px 8px", borderBottom: `1px solid ${COLORS.border}`, overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", borderRadius: 8, border: "none", background: tab === t.id ? COLORS.accent + "22" : "transparent", color: tab === t.id ? COLORS.accent : COLORS.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: tab === t.id ? 700 : 400, whiteSpace: "nowrap", transition: "all 0.15s" }}>
            <Icon d={t.icon} size={14} color={tab === t.id ? COLORS.accent : COLORS.muted} />
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 80px" }}>
        {tab === "overview" && <OverviewTab setTab={setTab} />}
        {tab === "daily" && <DailyTab />}
        {tab === "finance" && <FinanceTab />}
        {tab === "ideas" && <IdeasTab />}
        {tab === "daughters" && <DaughtersTab />}
      </div>
    </div>
  );
}