import { useState, useEffect, useCallback, useRef } from "react";

const API_BASE = "";
const API_KEY = "";

function api(path, opts = {}) {
  const headers = { "Content-Type": "application/json" };
  if (API_KEY) headers["Authorization"] = `Bearer ${API_KEY}`;
  return fetch(`${API_BASE}${path}`, { headers, ...opts }).then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });
}

const LANGS = { en:"English", id:"Indonesian", de:"German", ar:"Arabic", th:"Thai", vi:"Vietnamese", ja:"Japanese", ko:"Korean" };

const IC = ({ name, size = 16, style = {} }) => (
  <i className={`ti ti-${name}`} style={{ fontSize: size, ...style }} aria-hidden="true" />
);

const Badge = ({ children, variant = "default" }) => {
  const styles = {
    default: { background: "var(--surface-1)", color: "var(--text-secondary)", border: "0.5px solid var(--border)" },
    success: { background: "var(--bg-success)", color: "var(--text-success)", border: "0.5px solid var(--border-success)" },
    danger:  { background: "var(--bg-danger)",  color: "var(--text-danger)",  border: "0.5px solid var(--border-danger)" },
    warning: { background: "var(--bg-warning)", color: "var(--text-warning)", border: "0.5px solid var(--border-warning)" },
    accent:  { background: "var(--bg-accent)",  color: "var(--text-accent)",  border: "0.5px solid var(--border-accent)" },
  };
  return (
    <span style={{ ...styles[variant], fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: "var(--radius)", display: "inline-block", lineHeight: 1.6 }}>
      {children}
    </span>
  );
};

const Toast = ({ msg, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const ok = !msg.toLowerCase().includes("error") && !msg.toLowerCase().includes("gagal");
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: "var(--surface-2)", border: `0.5px solid ${ok ? "var(--border-success)" : "var(--border-danger)"}`,
      borderRadius: "var(--radius)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10,
      fontSize: 13, color: "var(--text-primary)", minWidth: 220, maxWidth: 360,
    }}>
      <IC name={ok ? "check" : "alert-triangle"} size={15} style={{ color: ok ? "var(--text-success)" : "var(--text-danger)", flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{msg}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "var(--text-muted)", lineHeight: 1 }}>
        <IC name="x" size={14} />
      </button>
    </div>
  );
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: 12, padding: "1rem 1.25rem", ...style }}>
    {children}
  </div>
);

const Stat = ({ label, value, icon, variant }) => {
  const colors = { accent: "var(--text-accent)", success: "var(--text-success)", warning: "var(--text-warning)", default: "var(--text-primary)" };
  return (
    <div style={{ background: "var(--surface-1)", borderRadius: "var(--radius)", padding: "1rem", display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
        {icon && <IC name={icon} size={14} style={{ color: "var(--text-muted)" }} />}
      </div>
      <span style={{ fontSize: 22, fontWeight: 500, color: colors[variant] || colors.default }}>{value ?? "—"}</span>
    </div>
  );
};

const Btn = ({ children, onClick, variant = "default", disabled, size = "md", style = {} }) => {
  const pad = size === "sm" ? "5px 10px" : "7px 14px";
  const fs  = size === "sm" ? 12 : 13;
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6, cursor: disabled ? "not-allowed" : "pointer",
    border: "0.5px solid", borderRadius: "var(--radius)", fontWeight: 500, fontSize: fs, padding: pad,
    opacity: disabled ? 0.45 : 1, transition: "background 0.12s", whiteSpace: "nowrap", ...style,
  };
  const vars = {
    default: { background: "transparent", borderColor: "var(--border-strong)", color: "var(--text-primary)" },
    accent:  { background: "var(--fill-accent)", borderColor: "transparent", color: "var(--on-accent)" },
    danger:  { background: "var(--bg-danger)", borderColor: "var(--border-danger)", color: "var(--text-danger)" },
    success: { background: "var(--bg-success)", borderColor: "var(--border-success)", color: "var(--text-success)" },
    ghost:   { background: "transparent", borderColor: "transparent", color: "var(--text-secondary)" },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...vars[variant] }}>
      {children}
    </button>
  );
};

const Input = ({ label, value, onChange, type = "text", placeholder, small, style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4, ...style }}>
    {label && <label style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>}
    <input
      type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ fontSize: small ? 12 : 13, padding: small ? "4px 8px" : "7px 10px", borderRadius: "var(--radius)", border: "0.5px solid var(--border-strong)", background: "var(--surface-2)", color: "var(--text-primary)", width: "100%", outline: "none", boxSizing: "border-box" }}
    />
  </div>
);

const Select = ({ label, value, onChange, options, style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4, ...style }}>
    {label && <label style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>}
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ fontSize: 13, padding: "7px 10px", borderRadius: "var(--radius)", border: "0.5px solid var(--border-strong)", background: "var(--surface-2)", color: "var(--text-primary)", outline: "none" }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

function NavItem({ label, icon, active, onClick, badge }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: "var(--radius)",
      background: active ? "var(--surface-1)" : "transparent", border: "none", cursor: "pointer",
      color: active ? "var(--text-primary)" : "var(--text-secondary)", fontSize: 13, fontWeight: active ? 500 : 400,
      width: "100%", textAlign: "left", transition: "all 0.1s",
    }}>
      <IC name={icon} size={16} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge && <span style={{ fontSize: 10, fontWeight: 600, background: "var(--bg-danger)", color: "var(--text-danger)", borderRadius: 10, padding: "1px 6px" }}>{badge}</span>}
    </button>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 500, color: "var(--text-primary)" }}>{title}</h2>
        {subtitle && <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-muted)" }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function OverviewPanel({ status, guilds, onSelectGuild }) {
  const totalMembers = guilds.reduce((s, g) => s + (g.member_count || 0), 0);
  const premiumCount = guilds.filter(g => g.premium).length;
  return (
    <div>
      <SectionHeader title="Overview" subtitle="Bot status and server summary" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: "1.5rem" }}>
        <Stat label="Servers" value={guilds.length} icon="server" variant="accent" />
        <Stat label="Members" value={totalMembers.toLocaleString()} icon="users" />
        <Stat label="Premium" value={premiumCount} icon="star" variant="warning" />
        <Stat label="Ping" value={status?.latency_ms ? `${status.latency_ms}ms` : "—"} icon="activity" variant={status?.latency_ms < 100 ? "success" : "warning"} />
      </div>

      <SectionHeader title="Servers" subtitle={`${guilds.length} connected`} />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {guilds.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No servers found.</p>}
        {guilds.map(g => (
          <div key={g.id} onClick={() => onSelectGuild(g)} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
            background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)",
            cursor: "pointer", transition: "border-color 0.1s",
          }}>
            {g.icon
              ? <img src={g.icon} alt="" style={{ width: 36, height: 36, borderRadius: "50%" }} />
              : <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--bg-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "var(--text-accent)" }}>{g.name?.slice(0,2).toUpperCase()}</div>
            }
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 500, fontSize: 13, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.name}</p>
              <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>{(g.member_count || 0).toLocaleString()} members · ID {g.id}</p>
            </div>
            {g.premium && <Badge variant="warning">Premium</Badge>}
            <IC name="chevron-right" size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function GuildSettings({ guild, guildData, onSave, onToast }) {
  const gc = guildData?.config || {};
  const [lang, setLang] = useState(gc.language || "en");
  const [levelEnabled, setLevelEnabled] = useState(gc.leveling_enabled ?? true);
  const [levelCh, setLevelCh] = useState(gc.level_channel || "");
  const [questCh, setQuestCh] = useState(gc.quest_channel || "");
  const [xpMin, setXpMin] = useState((gc.xp_per_message || [15, 25])[0]);
  const [xpMax, setXpMax] = useState((gc.xp_per_message || [15, 25])[1]);
  const [xpCd, setXpCd] = useState(gc.xp_cooldown || 60);
  const [mainCh, setMainCh] = useState(gc.main_channel || "");
  const [saving, setSaving] = useState(false);

  const channels = guildData?.channels?.filter(c => c.type === "text") || [];
  const chOptions = [{ value: "", label: "— none —" }, ...channels.map(c => ({ value: c.id, label: `#${c.name}` }))];

  async function save() {
    setSaving(true);
    try {
      await api(`/api/guild/${guild.id}`, {
        method: "POST",
        body: JSON.stringify({
          language: lang, leveling_enabled: levelEnabled,
          level_channel: levelCh || null, quest_channel: questCh || null,
          xp_per_message: [Number(xpMin), Number(xpMax)], xp_cooldown: Number(xpCd),
          main_channel: mainCh || null,
        }),
      });
      onToast("Settings saved");
      onSave();
    } catch (e) {
      onToast("Error: " + e.message);
    }
    setSaving(false);
  }

  return (
    <div>
      <SectionHeader title="Server settings" subtitle={guild.name} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Card>
          <p style={{ margin: "0 0 12px", fontSize: 12, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>General</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Select label="Language" value={lang} onChange={setLang}
              options={Object.entries(LANGS).map(([v, l]) => ({ value: v, label: l }))} />
            <Select label="Main channel" value={mainCh} onChange={setMainCh} options={chOptions} />
          </div>
        </Card>

        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Leveling system</p>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "var(--text-secondary)" }}>
              <input type="checkbox" checked={levelEnabled} onChange={e => setLevelEnabled(e.target.checked)} />
              {levelEnabled ? "Enabled" : "Disabled"}
            </label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
            <Select label="Level channel" value={levelCh} onChange={setLevelCh} options={chOptions} />
            <Select label="Quest channel" value={questCh} onChange={setQuestCh} options={chOptions} />
            <Input label="XP min" type="number" value={xpMin} onChange={setXpMin} />
            <Input label="XP max" type="number" value={xpMax} onChange={setXpMax} />
          </div>
          <Input label="XP cooldown (seconds)" type="number" value={xpCd} onChange={setXpCd} style={{ marginTop: 12, maxWidth: 200 }} />
        </Card>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Btn variant="accent" onClick={save} disabled={saving}>
            <IC name={saving ? "loader" : "device-floppy"} size={14} />
            {saving ? "Saving…" : "Save changes"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

function ModerationPanel({ guild, guildData, onToast }) {
  const [tab, setTab] = useState("warnings");
  const [warnings, setWarnings] = useState({});
  const [banMember, setBanMember] = useState("");
  const [banReason, setBanReason] = useState("");
  const [kicking, setKicking] = useState(false);
  const [banning, setBanning] = useState(false);
  const members = guildData?.members || [];
  const roles   = guildData?.roles  || [];

  useEffect(() => {
    setWarnings(guildData?.warnings || {});
  }, [guildData]);

  const warningEntries = Object.entries(warnings).filter(([, ws]) => ws.length > 0);

  return (
    <div>
      <SectionHeader title="Moderation" subtitle={guild.name} />
      <div style={{ display: "flex", gap: 4, marginBottom: "1.5rem", background: "var(--surface-1)", borderRadius: "var(--radius)", padding: 4 }}>
        {[["Warnings", "warnings"], ["Actions", "actions"]].map(([l, v]) => (
          <button key={v} onClick={() => setTab(v)} style={{
            flex: 1, padding: "6px 0", borderRadius: "calc(var(--radius) - 2px)", border: "none", cursor: "pointer",
            background: tab === v ? "var(--surface-2)" : "transparent",
            color: tab === v ? "var(--text-primary)" : "var(--text-muted)", fontSize: 13, fontWeight: tab === v ? 500 : 400,
          }}>{l}</button>
        ))}
      </div>

      {tab === "warnings" && (
        <div>
          {warningEntries.length === 0
            ? <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0 }}>No warnings recorded.</p>
            : warningEntries.map(([uid, ws]) => (
              <div key={uid} style={{ marginBottom: 12, padding: "12px 14px", background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                    User <code style={{ fontSize: 11, background: "var(--surface-1)", padding: "1px 5px", borderRadius: 4 }}>{uid}</code>
                  </span>
                  <Badge variant="warning">{ws.length} warning{ws.length !== 1 ? "s" : ""}</Badge>
                </div>
                {ws.slice(-3).map((w, i) => (
                  <div key={i} style={{ fontSize: 12, color: "var(--text-secondary)", padding: "4px 0", borderTop: i > 0 ? "0.5px solid var(--border)" : "none" }}>
                    <span style={{ color: "var(--text-muted)" }}>{new Date(w.timestamp).toLocaleDateString()} — </span>{w.reason}
                  </div>
                ))}
              </div>
            ))
          }
        </div>
      )}

      {tab === "actions" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Card>
            <p style={{ margin: "0 0 12px", fontSize: 12, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Broadcast announcement</p>
            <BroadcastForm guilds={[guild]} onToast={onToast} single />
          </Card>
        </div>
      )}
    </div>
  );
}

function BroadcastForm({ guilds, onToast, single }) {
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);

  async function send() {
    if (!msg.trim()) return;
    setSending(true);
    try {
      const res = await api("/api/broadcast", {
        method: "POST",
        body: JSON.stringify({ title: title || "Announcement", message: msg }),
      });
      onToast(`Broadcast sent — ${res.success} ok, ${res.failed} failed`);
      setMsg(""); setTitle("");
    } catch (e) {
      onToast("Error: " + e.message);
    }
    setSending(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <Input label="Title" value={title} onChange={setTitle} placeholder="Scheduled maintenance" />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <label style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Message</label>
        <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={3}
          placeholder="Write your announcement here…"
          style={{ fontSize: 13, padding: "7px 10px", borderRadius: "var(--radius)", border: "0.5px solid var(--border-strong)", background: "var(--surface-2)", color: "var(--text-primary)", resize: "vertical", outline: "none", fontFamily: "inherit" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          {single ? "Sends to this server's main channel" : `Sends to ${guilds.length} server${guilds.length !== 1 ? "s" : ""}`}
        </span>
        <Btn variant="accent" onClick={send} disabled={sending || !msg.trim()}>
          <IC name={sending ? "loader" : "send"} size={14} />
          {sending ? "Sending…" : "Broadcast"}
        </Btn>
      </div>
    </div>
  );
}

function GiveawayPanel({ guild, guildData, onToast }) {
  const [giveaways, setGiveaways] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ending, setEnding] = useState(null);

  const channels = (guildData?.channels || []).filter(c => c.type === "text");
  const roles     = guildData?.roles || [];

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api(`/api/guild/${guild.id}/giveaways`);
      setGiveaways(Array.isArray(res) ? res : []);
    } catch (e) {
      onToast("Error loading giveaways: " + e.message);
    }
    setLoading(false);
  }, [guild.id]);

  useEffect(() => { load(); }, [load]);

  async function forceEnd(mid) {
    setEnding(mid);
    try {
      await api(`/api/giveaway/${mid}/end`, { method: "POST" });
      onToast("Giveaway ended");
      load();
    } catch (e) {
      onToast("Error: " + e.message);
    }
    setEnding(null);
  }

  return (
    <div>
      <SectionHeader title="Giveaways" subtitle={guild.name}
        action={<Btn onClick={load} size="sm"><IC name="refresh" size={13} />Refresh</Btn>} />

      {loading && <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Loading…</p>}
      {!loading && giveaways.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No active giveaways.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {giveaways.map(gw => {
          const ends = new Date(gw.ends_ts * 1000);
          const left = Math.max(0, ends - Date.now());
          const h = Math.floor(left / 3600000), m = Math.floor((left % 3600000) / 60000);
          return (
            <Card key={gw.message_id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 500, fontSize: 14, color: "var(--text-primary)" }}>{gw.prize}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
                    {gw.winner_count} winner{gw.winner_count !== 1 ? "s" : ""} · {gw.entries?.length || 0} entries · ends in {h}h {m}m
                  </p>
                </div>
                <Btn variant="danger" size="sm" onClick={() => forceEnd(gw.message_id)} disabled={ending === gw.message_id}>
                  <IC name={ending === gw.message_id ? "loader" : "player-stop"} size={12} />
                  End
                </Btn>
              </div>
              <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>ID: {gw.message_id}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function QuestPanel({ guild, guildData, onToast }) {
  const [quests, setQuests] = useState(guildData?.quests || []);
  const [form, setForm] = useState({ name: "", description: "", type: "send_messages", target: 10, reward_xp: 0, reward_text: "" });
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => { setQuests(guildData?.quests || []); }, [guildData]);

  async function questAction(action, body) {
    const res = await api(`/api/guild/${guild.id}/quest`, {
      method: "POST",
      body: JSON.stringify({ action, ...body }),
    });
    setQuests(res.quests || []);
    return res;
  }

  async function createQuest() {
    if (!form.name) return;
    setSaving(true);
    try {
      await questAction("create", { ...form, target: Number(form.target), reward_xp: Number(form.reward_xp) });
      onToast("Quest created");
      setForm({ name: "", description: "", type: "send_messages", target: 10, reward_xp: 0, reward_text: "" });
    } catch (e) { onToast("Error: " + e.message); }
    setSaving(false);
  }

  async function toggleQuest(name) {
    setToggling(name);
    try { await questAction("toggle", { name }); } catch (e) { onToast("Error: " + e.message); }
    setToggling(null);
  }

  async function deleteQuest(name) {
    setDeleting(name);
    try {
      await questAction("delete", { name });
      onToast("Quest deleted");
    } catch (e) { onToast("Error: " + e.message); }
    setDeleting(null);
  }

  const typeOpts = [
    { value: "send_messages", label: "Send messages" },
    { value: "reactions_given", label: "Give reactions" },
    { value: "days_active", label: "Days active" },
  ];

  return (
    <div>
      <SectionHeader title="Quests" subtitle={guild.name} />

      <Card style={{ marginBottom: "1.25rem" }}>
        <p style={{ margin: "0 0 12px", fontSize: 12, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Create quest</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <Input label="Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Daily Chatter" />
          <Select label="Type" value={form.type} onChange={v => setForm(f => ({ ...f, type: v }))} options={typeOpts} />
          <Input label="Target" type="number" value={form.target} onChange={v => setForm(f => ({ ...f, target: v }))} />
          <Input label="XP reward" type="number" value={form.reward_xp} onChange={v => setForm(f => ({ ...f, reward_xp: v }))} />
        </div>
        <Input label="Description" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} placeholder="Send 100 messages in any channel" style={{ marginBottom: 10 }} />
        <Input label="Text reward (optional)" value={form.reward_text} onChange={v => setForm(f => ({ ...f, reward_text: v }))} placeholder="Code, instructions, or any text shown on claim" style={{ marginBottom: 12 }} />
        <Btn variant="accent" onClick={createQuest} disabled={saving || !form.name}>
          <IC name={saving ? "loader" : "plus"} size={14} />
          {saving ? "Creating…" : "Create quest"}
        </Btn>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {quests.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No quests yet.</p>}
        {quests.map(q => (
          <div key={q.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 500, fontSize: 13, color: "var(--text-primary)" }}>{q.name}</p>
              <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>{q.description} · +{q.reward_xp} XP</p>
            </div>
            <Badge variant={q.active ? "success" : "default"}>{q.active ? "Active" : "Off"}</Badge>
            <Btn size="sm" onClick={() => toggleQuest(q.name)} disabled={toggling === q.name}>
              {toggling === q.name ? <IC name="loader" size={12} /> : q.active ? "Disable" : "Enable"}
            </Btn>
            <Btn size="sm" variant="danger" onClick={() => deleteQuest(q.name)} disabled={deleting === q.name}>
              <IC name={deleting === q.name ? "loader" : "trash"} size={12} />
            </Btn>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaderboardPanel({ guild, guildData }) {
  const lb = guildData?.leaderboard || [];
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div>
      <SectionHeader title="Leaderboard" subtitle={guild.name} />
      {lb.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No XP data yet.</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {lb.map((m, i) => (
          <div key={m.uid} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)" }}>
            <span style={{ fontSize: i < 3 ? 18 : 13, width: 28, textAlign: "center", color: i >= 3 ? "var(--text-muted)" : undefined, fontWeight: i >= 3 ? 500 : undefined }}>
              {i < 3 ? medals[i] : `#${i + 1}`}
            </span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 500, fontSize: 13, color: "var(--text-primary)" }}>{m.name}</p>
              <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>{m.messages.toLocaleString()} messages</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontWeight: 500, fontSize: 13, color: "var(--text-primary)" }}>Level {m.level}</p>
              <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>{m.xp.toLocaleString()} XP</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PremiumPanel({ premiumData, onToast, onRefresh }) {
  const [pkg, setPkg] = useState({ name: "", duration: "", type: "basic", price: "" });
  const [rmPkg, setRmPkg] = useState("");
  const [uid, setUid] = useState("");
  const [action, setAction] = useState("add");
  const [saving, setSaving] = useState(false);

  const users    = premiumData?.premium_users    || [];
  const guilds   = premiumData?.premium_guilds   || [];
  const packages = premiumData?.premium_packages || [];
  const locked   = premiumData?.premium_commands || [];

  async function savePackage(act) {
    setSaving(true);
    try {
      await api("/api/premium/packages", { method: "POST", body: JSON.stringify({ action: act, ...(act === "add" ? pkg : { name: rmPkg }) }) });
      onToast(`Package ${act === "add" ? "added" : "removed"}`);
      onRefresh();
    } catch (e) { onToast("Error: " + e.message); }
    setSaving(false);
  }

  async function manageUser() {
    if (!uid.trim()) return;
    setSaving(true);
    try {
      await api("/api/premium/users", { method: "POST", body: JSON.stringify({ action, user_id: uid.trim() }) });
      onToast(`User ${action === "add" ? "granted" : "revoked"} premium`);
      setUid("");
      onRefresh();
    } catch (e) { onToast("Error: " + e.message); }
    setSaving(false);
  }

  return (
    <div>
      <SectionHeader title="Premium manager" subtitle="Packages, users, and locked commands" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: "1.5rem" }}>
        <Stat label="Premium users"  value={users.length}    icon="user-star" variant="warning" />
        <Stat label="Premium guilds" value={guilds.length}   icon="building-community" variant="accent" />
        <Stat label="Locked cmds"    value={locked.length}   icon="lock" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <p style={{ margin: "0 0 12px", fontSize: 12, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Packages ({packages.length})</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
            {packages.map(p => (
              <div key={p.name} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "6px 0", borderBottom: "0.5px solid var(--border)", color: "var(--text-secondary)" }}>
                <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>{p.name}</span>
                <span>{p.duration} · {p.price}</span>
              </div>
            ))}
            {packages.length === 0 && <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>No packages.</p>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <Input small label="Name"     value={pkg.name}     onChange={v => setPkg(p => ({ ...p, name: v }))}     placeholder="Gold" />
              <Input small label="Duration" value={pkg.duration} onChange={v => setPkg(p => ({ ...p, duration: v }))} placeholder="30 days" />
              <Input small label="Price"    value={pkg.price}    onChange={v => setPkg(p => ({ ...p, price: v }))}    placeholder="Rp 50.000" />
              <Input small label="Type"     value={pkg.type}     onChange={v => setPkg(p => ({ ...p, type: v }))}     placeholder="basic/vip" />
            </div>
            <Btn size="sm" variant="success" onClick={() => savePackage("add")} disabled={saving || !pkg.name}>
              <IC name="plus" size={12} />Add package
            </Btn>
            <div style={{ display: "flex", gap: 6 }}>
              <input value={rmPkg} onChange={e => setRmPkg(e.target.value)} placeholder="Package name to remove"
                style={{ flex: 1, fontSize: 12, padding: "4px 8px", borderRadius: "var(--radius)", border: "0.5px solid var(--border-strong)", background: "var(--surface-2)", color: "var(--text-primary)", outline: "none" }} />
              <Btn size="sm" variant="danger" onClick={() => savePackage("remove")} disabled={saving || !rmPkg}>
                <IC name="trash" size={12} />
              </Btn>
            </div>
          </div>
        </Card>

        <Card>
          <p style={{ margin: "0 0 12px", fontSize: 12, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Manage users</p>
          <div style={{ marginBottom: 12 }}>
            <p style={{ margin: "0 0 6px", fontSize: 12, color: "var(--text-muted)" }}>Premium users ({users.length})</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {users.slice(0, 8).map(u => (
                <code key={u} style={{ fontSize: 10, background: "var(--surface-1)", padding: "2px 6px", borderRadius: 4, color: "var(--text-secondary)" }}>{u}</code>
              ))}
              {users.length > 8 && <span style={{ fontSize: 11, color: "var(--text-muted)" }}>+{users.length - 8} more</span>}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Input small label="User ID" value={uid} onChange={setUid} placeholder="123456789012345678" />
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setAction("add")} style={{ flex: 1, padding: "5px 0", fontSize: 12, borderRadius: "var(--radius)", border: "0.5px solid var(--border-strong)", cursor: "pointer", background: action === "add" ? "var(--bg-success)" : "transparent", color: action === "add" ? "var(--text-success)" : "var(--text-muted)", fontWeight: action === "add" ? 500 : 400 }}>Grant</button>
              <button onClick={() => setAction("remove")} style={{ flex: 1, padding: "5px 0", fontSize: 12, borderRadius: "var(--radius)", border: "0.5px solid var(--border-strong)", cursor: "pointer", background: action === "remove" ? "var(--bg-danger)" : "transparent", color: action === "remove" ? "var(--text-danger)" : "var(--text-muted)", fontWeight: action === "remove" ? 500 : 400 }}>Revoke</button>
            </div>
            <Btn size="sm" variant="accent" onClick={manageUser} disabled={saving || !uid.trim()}>
              <IC name={saving ? "loader" : "user-check"} size={12} />
              Apply
            </Btn>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 16 }}>
        <Card>
          <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Premium-locked commands</p>
          {locked.length === 0
            ? <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)" }}>No locked commands.</p>
            : <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {locked.map(c => (
                  <div key={c} style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--bg-warning)", border: "0.5px solid var(--border-warning)", borderRadius: "var(--radius)", padding: "3px 8px 3px 10px" }}>
                    <code style={{ fontSize: 11, color: "var(--text-warning)", fontWeight: 500 }}>{c}</code>
                    <button onClick={async () => {
                      try { await api("/api/premium/commands", { method: "POST", body: JSON.stringify({ action: "unlock", command: c }) }); onToast("Unlocked"); onRefresh(); }
                      catch (e) { onToast("Error: " + e.message); }
                    }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "var(--text-warning)", lineHeight: 1 }}>
                      <IC name="x" size={11} />
                    </button>
                  </div>
                ))}
              </div>
          }
          <LockCommandRow onToast={onToast} onRefresh={onRefresh} />
        </Card>
      </div>
    </div>
  );
}

function LockCommandRow({ onToast, onRefresh }) {
  const [cmd, setCmd] = useState("");
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
      <input value={cmd} onChange={e => setCmd(e.target.value)} placeholder="Command to lock (e.g. kick)"
        style={{ flex: 1, fontSize: 12, padding: "4px 8px", borderRadius: "var(--radius)", border: "0.5px solid var(--border-strong)", background: "var(--surface-2)", color: "var(--text-primary)", outline: "none" }} />
      <Btn size="sm" onClick={async () => {
        if (!cmd.trim()) return;
        try { await api("/api/premium/commands", { method: "POST", body: JSON.stringify({ action: "lock", command: cmd.trim() }) }); onToast("Locked"); setCmd(""); onRefresh(); }
        catch (e) { onToast("Error: " + e.message); }
      }} disabled={!cmd.trim()}>
        <IC name="lock" size={12} />Lock
      </Btn>
    </div>
  );
}

function BroadcastPanel({ guilds, onToast }) {
  return (
    <div>
      <SectionHeader title="Broadcast" subtitle="Send a message to all servers" />
      <Card>
        <BroadcastForm guilds={guilds} onToast={onToast} />
      </Card>
    </div>
  );
}

function TicketConfigPanel({ guild, guildData, onToast }) {
  const gc = guildData?.config?.ticket || {};
  const channels   = (guildData?.channels || []).filter(c => c.type === "text");
  const categories = guildData?.categories || [];
  const roles      = guildData?.roles || [];

  const [catId, setCatId]     = useState(gc.category     || "");
  const [logCh, setLogCh]     = useState(gc.log_channel  || "");
  const [suppRole, setSuppRole] = useState(gc.support_role || "");
  const [maxT, setMaxT]       = useState(gc.max_tickets  || 1);
  const [saving, setSaving]   = useState(false);

  const catOpts  = [{ value: "", label: "— select —" }, ...categories.map(c => ({ value: c.id, label: c.name }))];
  const chOpts   = [{ value: "", label: "— none —" }, ...channels.map(c => ({ value: c.id, label: `#${c.name}` }))];
  const roleOpts = [{ value: "", label: "— none —" }, ...roles.map(r => ({ value: r.id, label: r.name }))];

  async function save() {
    setSaving(true);
    try {
      await api(`/api/guild/${guild.id}`, {
        method: "POST",
        body: JSON.stringify({ ticket: { category: catId || null, log_channel: logCh || null, support_role: suppRole || null, max_tickets: Number(maxT) } }),
      });
      onToast("Ticket config saved");
    } catch (e) { onToast("Error: " + e.message); }
    setSaving(false);
  }

  const tickets = guildData?.active_tickets || 0;

  return (
    <div>
      <SectionHeader title="Ticket system" subtitle={guild.name} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: "1.5rem" }}>
        <Stat label="Active tickets" value={tickets} icon="ticket" variant="accent" />
        <Stat label="Max per user" value={gc.max_tickets || 1} icon="users" />
        <Stat label="Support role" value={gc.support_role ? "Set" : "None"} icon="shield" variant={gc.support_role ? "success" : "default"} />
      </div>
      <Card>
        <p style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Configuration</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Select label="Category" value={catId} onChange={setCatId} options={catOpts} />
          <Select label="Log channel" value={logCh} onChange={setLogCh} options={chOpts} />
          <Select label="Support role" value={suppRole} onChange={setSuppRole} options={roleOpts} />
          <Input label="Max tickets per user" type="number" value={maxT} onChange={setMaxT} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
          <Btn variant="accent" onClick={save} disabled={saving}>
            <IC name={saving ? "loader" : "device-floppy"} size={14} />
            {saving ? "Saving…" : "Save config"}
          </Btn>
        </div>
      </Card>
    </div>
  );
}

export default function App() {
  const [page, setPage]           = useState("overview");
  const [guilds, setGuilds]       = useState([]);
  const [status, setStatus]       = useState(null);
  const [premiumData, setPremium] = useState(null);
  const [selGuild, setSelGuild]   = useState(null);
  const [guildData, setGuildData] = useState(null);
  const [loadingGuild, setLoadingGuild] = useState(false);
  const [toast, setToast]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [sidebarOpen, setSidebar] = useState(true);

  const showToast = useCallback(msg => setToast(msg), []);

  async function loadBase() {
    setLoading(true);
    try {
      const [st, gs, pr] = await Promise.all([
        api("/api/status").catch(() => null),
        api("/api/guilds").catch(() => []),
        api("/api/premium").catch(() => null),
      ]);
      setStatus(st);
      setGuilds(Array.isArray(gs) ? gs : []);
      setPremium(pr);
    } catch (e) {
      showToast("Could not reach the bot API. Make sure the bot is running.");
    }
    setLoading(false);
  }

  useEffect(() => { loadBase(); }, []);

  async function selectGuild(g) {
    setSelGuild(g);
    setPage("guild-settings");
    setLoadingGuild(true);
    try {
      const data = await api(`/api/guild/${g.id}`);
      setGuildData(data);
    } catch (e) {
      showToast("Failed to load guild data");
    }
    setLoadingGuild(false);
  }

  const guildPages = [
    { id: "guild-settings",  label: "Settings",    icon: "settings"     },
    { id: "guild-moderation",label: "Moderation",  icon: "shield"       },
    { id: "guild-tickets",   label: "Tickets",     icon: "ticket"       },
    { id: "guild-leveling",  label: "Leaderboard", icon: "chart-bar"    },
    { id: "guild-quests",    label: "Quests",      icon: "checklist"    },
    { id: "guild-giveaways", label: "Giveaways",   icon: "confetti"     },
  ];

  const globalPages = [
    { id: "overview",   label: "Overview",  icon: "layout-dashboard" },
    { id: "premium",    label: "Premium",   icon: "star"             },
    { id: "broadcast",  label: "Broadcast", icon: "speakerphone"     },
  ];

  function renderMain() {
    if (loading) return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 320, gap: 12, color: "var(--text-muted)", fontSize: 13 }}>
        <IC name="loader" size={24} />
        Connecting to bot…
      </div>
    );

    if (page === "overview") return <OverviewPanel status={status} guilds={guilds} onSelectGuild={selectGuild} />;
    if (page === "premium")  return <PremiumPanel premiumData={premiumData} onToast={showToast} onRefresh={loadBase} />;
    if (page === "broadcast") return <BroadcastPanel guilds={guilds} onToast={showToast} />;

    if (!selGuild) return <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Select a server first.</p>;

    if (loadingGuild) return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 240, gap: 12, color: "var(--text-muted)", fontSize: 13 }}>
        <IC name="loader" size={22} />
        Loading {selGuild.name}…
      </div>
    );

    if (page === "guild-settings")   return <GuildSettings   guild={selGuild} guildData={guildData} onSave={() => selectGuild(selGuild)} onToast={showToast} />;
    if (page === "guild-moderation") return <ModerationPanel guild={selGuild} guildData={guildData} onToast={showToast} />;
    if (page === "guild-tickets")    return <TicketConfigPanel guild={selGuild} guildData={guildData} onToast={showToast} />;
    if (page === "guild-leveling")   return <LeaderboardPanel guild={selGuild} guildData={guildData} />;
    if (page === "guild-quests")     return <QuestPanel       guild={selGuild} guildData={guildData} onToast={showToast} />;
    if (page === "guild-giveaways")  return <GiveawayPanel   guild={selGuild} guildData={guildData} onToast={showToast} />;
    return null;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--surface-0)", fontFamily: "var(--font-sans)" }}>
      <aside style={{
        width: sidebarOpen ? 220 : 52, flexShrink: 0, borderRight: "0.5px solid var(--border)",
        background: "var(--surface-2)", display: "flex", flexDirection: "column",
        transition: "width 0.18s", overflow: "hidden",
      }}>
        <div style={{ padding: "14px 12px 10px", display: "flex", alignItems: "center", gap: 10, borderBottom: "0.5px solid var(--border)" }}>
          <div style={{ width: 28, height: 28, borderRadius: "var(--radius)", background: "var(--fill-accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <IC name="robot" size={15} style={{ color: "var(--on-accent)" }} />
          </div>
          {sidebarOpen && <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)", whiteSpace: "nowrap" }}>JoyCannot</span>}
          <button onClick={() => setSidebar(v => !v)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 2 }}>
            <IC name={sidebarOpen ? "layout-sidebar-left-collapse" : "layout-sidebar-left-expand"} size={15} />
          </button>
        </div>

        <div style={{ flex: 1, padding: 8, display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
          {status && sidebarOpen && (
            <div style={{ padding: "6px 10px", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--fill-success)", flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Online</span>
            </div>
          )}

          {globalPages.map(p => (
            <NavItem key={p.id} label={sidebarOpen ? p.label : ""} icon={p.icon} active={page === p.id} onClick={() => setPage(p.id)} />
          ))}

          {selGuild && (
            <>
              <div style={{ height: 1, background: "var(--border)", margin: "8px 4px" }} />
              {sidebarOpen && (
                <div style={{ padding: "4px 10px", display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  {selGuild.icon
                    ? <img src={selGuild.icon} alt="" style={{ width: 16, height: 16, borderRadius: "50%" }} />
                    : <div style={{ width: 16, height: 16, borderRadius: "50%", background: "var(--bg-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 600, color: "var(--text-accent)", flexShrink: 0 }}>{selGuild.name?.slice(0, 2).toUpperCase()}</div>
                  }
                  <span style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{selGuild.name}</span>
                </div>
              )}
              {guildPages.map(p => (
                <NavItem key={p.id} label={sidebarOpen ? p.label : ""} icon={p.icon} active={page === p.id} onClick={() => setPage(p.id)} />
              ))}
            </>
          )}
        </div>

        {sidebarOpen && (
          <div style={{ padding: "10px 12px", borderTop: "0.5px solid var(--border)" }}>
            <p style={{ margin: 0, fontSize: 10, color: "var(--text-muted)" }}>JoyCannot Dashboard</p>
            <p style={{ margin: "2px 0 0", fontSize: 10, color: "var(--text-muted)" }}>
              {status ? `${status.guild_count || guilds.length} servers` : "Offline"}
            </p>
          </div>
        )}
      </aside>

      <main style={{ flex: 1, padding: "2rem", overflowY: "auto", maxWidth: 900 }}>
        {renderMain()}
      </main>

      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
