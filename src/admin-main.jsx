import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

async function apiJson(url, opts) {
  const r = await fetch(url, { credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, ...opts });
  let j = null;
  try { j = await r.json(); } catch (e) {}
  if (!r.ok) throw new Error((j && j.error) || 'Error de conexión');
  return j;
}

const ROLE_LABEL = { medico: 'Médico', estudiante: 'Estudiante', otro: 'Otro' };
const pct = (n, d) => (d > 0 ? Math.round((n / d) * 100) : 0);

// Código ISO de 2 letras -> emoji de bandera (regional indicator symbols, sin librerías).
function flagEmoji(code) {
  if (!code || code === '??' || code.length !== 2) return '🌐';
  const A = 0x1f1e6;
  const chars = code.toUpperCase().split('').map((c) => A + (c.charCodeAt(0) - 65));
  if (chars.some((c) => c < A || c > A + 25)) return '🌐';
  return String.fromCodePoint(...chars);
}

function StatCard({ label, value, sub }) {
  return (
    <div style={s.statCard}>
      <div style={s.statLabel}>{label}</div>
      <div style={s.statValue}>{value}</div>
      {sub && <div style={s.statSub}>{sub}</div>}
    </div>
  );
}

function GrowthChart({ data }) {
  // data viene día más reciente primero; lo mostramos cronológico (izq -> der)
  const days = [...data].reverse();
  const max = Math.max(1, ...days.map((d) => d.count));
  return (
    <div style={s.sectionCard}>
      <div style={s.sectionTitle}>Altas por día (últimos {days.length})</div>
      <div style={s.chartRow}>
        {days.map((d) => (
          <div key={d.day} style={s.barWrap} title={`${d.day}: ${d.count}`}>
            <div style={{ ...s.bar, height: `${Math.max(4, (d.count / max) * 80)}px` }} />
            <div style={s.barCount}>{d.count}</div>
          </div>
        ))}
        {days.length === 0 && <p style={s.dim}>Todavía no hay altas registradas.</p>}
      </div>
    </div>
  );
}

function BreakdownList({ title, data, total, labelFor }) {
  return (
    <div style={s.sectionCard}>
      <div style={s.sectionTitle}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map((r) => (
          <div key={r.key}>
            <div style={s.roleRowLabel}>
              <span>{labelFor(r.key)}</span>
              <span style={s.dim}>{r.count} ({pct(r.count, total)}%)</span>
            </div>
            <div style={s.roleBarBg}>
              <div style={{ ...s.roleBarFill, width: `${pct(r.count, total)}%` }} />
            </div>
          </div>
        ))}
        {data.length === 0 && <p style={s.dim}>Sin datos todavía.</p>}
      </div>
    </div>
  );
}

const FEEDBACK_TYPE_LABEL = { error: '🐞 Error', sugerencia: '💡 Sugerencia' };

function FeedbackList({ items }) {
  return (
    <div style={s.sectionCard}>
      <div style={s.sectionTitle}>Feedback de usuarios ({items.length}{items.length === 300 ? '+' : ''})</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((f) => (
          <div key={f.id} style={s.feedbackRow}>
            <div style={s.feedbackHead}>
              <span>{FEEDBACK_TYPE_LABEL[f.type] || f.type}</span>
              <span style={s.dim}>{f.name} · {f.email} · {new Date(f.created_at).toLocaleString('es-AR')}</span>
            </div>
            <p style={s.feedbackMsg}>{f.message}</p>
          </div>
        ))}
        {items.length === 0 && <p style={s.dim}>Todavía no llegó ningún mensaje.</p>}
      </div>
    </div>
  );
}

function AdminApp() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState(null);
  const [feedback, setFeedback] = useState([]);

  const loadStats = useCallback(() => {
    return apiJson('/api/admin/stats')
      .then((res) => { setData(res); setAuthed(true); })
      .catch(() => { setAuthed(false); });
  }, []);

  useEffect(() => {
    if (!authed) return;
    apiJson('/api/admin/feedback').then((res) => setFeedback(res.items)).catch(() => {});
  }, [authed]);

  useEffect(() => { loadStats().finally(() => setReady(true)); }, [loadStats]);

  const login = async () => {
    setBusy(true); setError('');
    try {
      await apiJson('/api/admin/login', { method: 'POST', body: JSON.stringify({ secret }) });
      setSecret('');
      await loadStats();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  const logout = async () => {
    await apiJson('/api/admin/logout', { method: 'POST' }).catch(() => {});
    setAuthed(false); setData(null);
  };

  if (!ready) {
    return <div style={s.center}><div style={s.dim}>Cargando…</div></div>;
  }

  if (!authed) {
    return (
      <div style={s.center}>
        <div style={s.card}>
          <h1 style={s.title}>Sístole — Admin</h1>
          <input
            type="password" value={secret} placeholder="Clave de administrador" autoFocus
            onChange={(e) => { setSecret(e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && login()}
            style={s.input}
          />
          {error && <p style={s.error}>{error}</p>}
          <button onClick={login} disabled={busy} style={s.button}>{busy ? 'Verificando…' : 'Entrar'}</button>
        </div>
      </div>
    );
  }

  const { count, users, signupsByDay, roleBreakdown, countryBreakdown, activeCountriesRecent, activity, activation, depth } = data;
  const accuracy = pct(depth.totalCorrect, depth.totalAnswered);
  const activatedPct = pct(activation.activated, activation.totalUsers);
  const activeCountryTotal = activeCountriesRecent.reduce((a, r) => a + r.count, 0);
  const countryLabel = (code) => `${flagEmoji(code)} ${code === '??' ? 'Desconocido' : code}`;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Sístole — Admin</h1>
        <button onClick={logout} style={s.linkButton}>Cerrar sesión</button>
      </div>

      <div style={s.grid}>
        <StatCard label="Usuarios registrados" value={count} />
        <StatCard label="Activos últimas 24h" value={activity.active24h} />
        <StatCard label="Activos últimos 7 días" value={activity.active7d} />
        <StatCard label="Activos últimos 30 días" value={activity.active30d} />
        <StatCard label="Activación" value={`${activatedPct}%`} sub={`${activation.activated} de ${activation.totalUsers} jugaron algo`} />
        <StatCard label="Precisión promedio en Quiz" value={`${accuracy}%`} sub={`${depth.totalCorrect} de ${depth.totalAnswered} respuestas`} />
        <StatCard label="XP promedio" value={Math.round(depth.avgXp)} />
        <StatCard label="Casos completados (prom.)" value={depth.avgCasesDone.toFixed(1)} />
      </div>

      <GrowthChart data={signupsByDay} />

      <div style={s.twoCol}>
        <BreakdownList
          title="Países — todos los registrados"
          data={countryBreakdown.map((r) => ({ key: r.country, count: r.count }))}
          total={count}
          labelFor={countryLabel}
        />
        <BreakdownList
          title="Países — activos últimos 7 días"
          data={activeCountriesRecent.map((r) => ({ key: r.country, count: r.count }))}
          total={activeCountryTotal}
          labelFor={countryLabel}
        />
      </div>

      <BreakdownList
        title="Perfil de audiencia"
        data={roleBreakdown.map((r) => ({ key: r.role, count: r.count }))}
        total={count}
        labelFor={(k) => ROLE_LABEL[k] || k}
      />

      <FeedbackList items={feedback} />

      <div style={s.tableWrap}>
        <div style={s.sectionTitle}>Usuarios ({users.length}{users.length === 500 ? '+' : ''})</div>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Nombre</th>
              <th style={s.th}>Email</th>
              <th style={s.th}>Rol</th>
              <th style={s.th}>País</th>
              <th style={s.th}>Creado</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={s.td}>{u.name}</td>
                <td style={s.td}>{u.email}</td>
                <td style={s.td}>{ROLE_LABEL[u.role] || u.role}</td>
                <td style={s.td}>{flagEmoji(u.country)} {u.country || '—'}</td>
                <td style={s.td}>{new Date(u.created_at).toLocaleString('es-AR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p style={s.dim}>Todavía no hay cuentas creadas.</p>}
      </div>
    </div>
  );
}

const s = {
  center: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050912', fontFamily: "'IBM Plex Sans', system-ui, sans-serif" },
  page: { minHeight: '100vh', background: '#050912', color: '#e7e5e4', fontFamily: "'IBM Plex Sans', system-ui, sans-serif", padding: '32px 20px', maxWidth: 1000, margin: '0 auto', boxSizing: 'border-box' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 700, color: '#f5f5f4', margin: 0 },
  card: { background: '#0d1117', border: '1px solid #1f2937', borderRadius: 16, padding: 32, width: 320, textAlign: 'center', boxSizing: 'border-box' },
  input: { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #33415580', background: '#161b24', color: '#f5f5f4', marginTop: 16, marginBottom: 8, boxSizing: 'border-box', fontSize: 14 },
  button: { width: '100%', padding: '10px 14px', borderRadius: 10, border: 'none', background: '#4F5BD5', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14 },
  linkButton: { background: 'none', border: '1px solid #33415580', color: '#a8a29e', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13 },
  error: { color: '#fb7185', fontSize: 13, margin: '4px 0' },
  dim: { color: '#78716c', fontSize: 14 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 },
  twoCol: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 },
  statCard: { background: '#0d1117', border: '1px solid #1f2937', borderRadius: 16, padding: '16px 18px', boxSizing: 'border-box' },
  statLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#78716c', marginBottom: 6 },
  statValue: { fontSize: 28, fontWeight: 700, color: '#818cf8', lineHeight: 1 },
  statSub: { fontSize: 11, color: '#78716c', marginTop: 6 },
  sectionTitle: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#a8a29e', marginBottom: 14, fontWeight: 600 },
  sectionCard: { background: '#0d1117', border: '1px solid #1f2937', borderRadius: 16, padding: 20, marginBottom: 24, boxSizing: 'border-box' },
  tableWrap: { overflowX: 'auto', background: '#0d1117', border: '1px solid #1f2937', borderRadius: 16, padding: 20, boxSizing: 'border-box' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid #1f2937', color: '#a8a29e', fontWeight: 600 },
  td: { padding: '8px 12px', borderBottom: '1px solid #161b24', color: '#d6d3d1' },
  chartRow: { display: 'flex', alignItems: 'flex-end', gap: 6, minHeight: 100, overflowX: 'auto', paddingBottom: 4 },
  barWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto', width: 24 },
  bar: { width: 14, background: 'linear-gradient(180deg,#818cf8,#4F5BD5)', borderRadius: 3 },
  barCount: { fontSize: 9, color: '#78716c', marginTop: 4 },
  roleRowLabel: { display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#e7e5e4', marginBottom: 4 },
  roleBarBg: { height: 8, background: '#161b24', borderRadius: 4, overflow: 'hidden' },
  roleBarFill: { height: '100%', background: 'linear-gradient(90deg,#4F5BD5,#818cf8)' },
  feedbackRow: { padding: '10px 0', borderBottom: '1px solid #161b24' },
  feedbackHead: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'baseline', fontSize: 12, color: '#e7e5e4', marginBottom: 4 },
  feedbackMsg: { fontSize: 13, color: '#d6d3d1', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5 },
};

ReactDOM.createRoot(document.getElementById('admin-root')).render(<AdminApp />);
