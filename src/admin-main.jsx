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

function RoleBreakdown({ data, total }) {
  return (
    <div style={s.sectionCard}>
      <div style={s.sectionTitle}>Perfil de audiencia</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map((r) => (
          <div key={r.role}>
            <div style={s.roleRowLabel}>
              <span>{ROLE_LABEL[r.role] || r.role}</span>
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

function AdminApp() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState(null);

  const loadStats = useCallback(() => {
    return apiJson('/api/admin/stats')
      .then((res) => { setData(res); setAuthed(true); })
      .catch(() => { setAuthed(false); });
  }, []);

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

  const { count, users, signupsByDay, roleBreakdown, activity, activation, depth } = data;
  const accuracy = pct(depth.totalCorrect, depth.totalAnswered);
  const activatedPct = pct(activation.activated, activation.totalUsers);

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
      <RoleBreakdown data={roleBreakdown} total={count} />

      <div style={s.tableWrap}>
        <div style={s.sectionTitle}>Usuarios ({users.length}{users.length === 500 ? '+' : ''})</div>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Nombre</th>
              <th style={s.th}>Email</th>
              <th style={s.th}>Rol</th>
              <th style={s.th}>Creado</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={s.td}>{u.name}</td>
                <td style={s.td}>{u.email}</td>
                <td style={s.td}>{ROLE_LABEL[u.role] || u.role}</td>
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
  center: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030605', fontFamily: "'IBM Plex Sans', system-ui, sans-serif" },
  page: { minHeight: '100vh', background: '#030605', color: '#e7e5e4', fontFamily: "'IBM Plex Sans', system-ui, sans-serif", padding: '32px 20px', maxWidth: 1000, margin: '0 auto', boxSizing: 'border-box' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 700, color: '#f5f5f4', margin: 0 },
  card: { background: '#0c0f0d', border: '1px solid #292524', borderRadius: 16, padding: 32, width: 320, textAlign: 'center', boxSizing: 'border-box' },
  input: { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #44403c', background: '#1c1917', color: '#f5f5f4', marginTop: 16, marginBottom: 8, boxSizing: 'border-box', fontSize: 14 },
  button: { width: '100%', padding: '10px 14px', borderRadius: 10, border: 'none', background: '#047857', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14 },
  linkButton: { background: 'none', border: '1px solid #44403c', color: '#a8a29e', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13 },
  error: { color: '#fb7185', fontSize: 13, margin: '4px 0' },
  dim: { color: '#78716c', fontSize: 14 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 },
  statCard: { background: '#0c0f0d', border: '1px solid #292524', borderRadius: 16, padding: '16px 18px', boxSizing: 'border-box' },
  statLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#78716c', marginBottom: 6 },
  statValue: { fontSize: 28, fontWeight: 700, color: '#34d399', lineHeight: 1 },
  statSub: { fontSize: 11, color: '#78716c', marginTop: 6 },
  sectionTitle: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#a8a29e', marginBottom: 14, fontWeight: 600 },
  sectionCard: { background: '#0c0f0d', border: '1px solid #292524', borderRadius: 16, padding: 20, marginBottom: 24, boxSizing: 'border-box' },
  tableWrap: { overflowX: 'auto', background: '#0c0f0d', border: '1px solid #292524', borderRadius: 16, padding: 20, boxSizing: 'border-box' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid #292524', color: '#a8a29e', fontWeight: 600 },
  td: { padding: '8px 12px', borderBottom: '1px solid #1c1917', color: '#d6d3d1' },
  chartRow: { display: 'flex', alignItems: 'flex-end', gap: 6, minHeight: 100, overflowX: 'auto', paddingBottom: 4 },
  barWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto', width: 24 },
  bar: { width: 14, background: 'linear-gradient(180deg,#34d399,#047857)', borderRadius: 3 },
  barCount: { fontSize: 9, color: '#78716c', marginTop: 4 },
  roleRowLabel: { display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#e7e5e4', marginBottom: 4 },
  roleBarBg: { height: 8, background: '#1c1917', borderRadius: 4, overflow: 'hidden' },
  roleBarFill: { height: '100%', background: 'linear-gradient(90deg,#047857,#34d399)' },
};

ReactDOM.createRoot(document.getElementById('admin-root')).render(<AdminApp />);
