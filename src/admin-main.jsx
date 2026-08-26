import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

async function apiJson(url, opts) {
  const r = await fetch(url, { credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, ...opts });
  let j = null;
  try { j = await r.json(); } catch (e) {}
  if (!r.ok) throw new Error((j && j.error) || 'Error de conexión');
  return j;
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

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Sístole — Admin</h1>
        <button onClick={logout} style={s.linkButton}>Cerrar sesión</button>
      </div>

      <div style={s.statCard}>
        <div style={s.statLabel}>Usuarios registrados</div>
        <div style={s.statValue}>{data.count}</div>
      </div>

      <div style={s.tableWrap}>
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
            {data.users.map((u) => (
              <tr key={u.id}>
                <td style={s.td}>{u.name}</td>
                <td style={s.td}>{u.email}</td>
                <td style={s.td}>{u.role}</td>
                <td style={s.td}>{new Date(u.created_at).toLocaleString('es-AR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.users.length === 0 && <p style={s.dim}>Todavía no hay cuentas creadas.</p>}
      </div>
    </div>
  );
}

const s = {
  center: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030605', fontFamily: "'IBM Plex Sans', system-ui, sans-serif" },
  page: { minHeight: '100vh', background: '#030605', color: '#e7e5e4', fontFamily: "'IBM Plex Sans', system-ui, sans-serif", padding: '32px 20px', maxWidth: 900, margin: '0 auto', boxSizing: 'border-box' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 700, color: '#f5f5f4', margin: 0 },
  card: { background: '#0c0f0d', border: '1px solid #292524', borderRadius: 16, padding: 32, width: 320, textAlign: 'center', boxSizing: 'border-box' },
  input: { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #44403c', background: '#1c1917', color: '#f5f5f4', marginTop: 16, marginBottom: 8, boxSizing: 'border-box', fontSize: 14 },
  button: { width: '100%', padding: '10px 14px', borderRadius: 10, border: 'none', background: '#047857', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14 },
  linkButton: { background: 'none', border: '1px solid #44403c', color: '#a8a29e', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13 },
  error: { color: '#fb7185', fontSize: 13, margin: '4px 0' },
  dim: { color: '#78716c', fontSize: 14 },
  statCard: { background: '#0c0f0d', border: '1px solid #292524', borderRadius: 16, padding: 20, marginBottom: 24, display: 'inline-block' },
  statLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#78716c' },
  statValue: { fontSize: 32, fontWeight: 700, color: '#34d399' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid #292524', color: '#a8a29e', fontWeight: 600 },
  td: { padding: '8px 12px', borderBottom: '1px solid #1c1917', color: '#d6d3d1' },
};

ReactDOM.createRoot(document.getElementById('admin-root')).render(<AdminApp />);
