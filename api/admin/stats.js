import { sql, ensureSchema } from '../../server/db.js';
import { isAdminRequest } from '../../server/adminAuth.js';

// Solo lectura: nunca inserta, actualiza ni borra nada de usuarios ni de su progreso.
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!isAdminRequest(req)) return res.status(401).json({ error: 'No autorizado' });
  await ensureSchema();

  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM users`;

  const users = await sql`
    SELECT id, name, email, role, country, created_at
    FROM users
    ORDER BY created_at DESC
    LIMIT 500
  `;

  const signupsByDay = await sql`
    SELECT to_char(created_at, 'YYYY-MM-DD') AS day, COUNT(*)::int AS count
    FROM users
    GROUP BY day
    ORDER BY day DESC
    LIMIT 30
  `;

  const roleBreakdown = await sql`
    SELECT role, COUNT(*)::int AS count
    FROM users
    GROUP BY role
    ORDER BY count DESC
  `;

  const countryBreakdown = await sql`
    SELECT COALESCE(country, '??') AS country, COUNT(*)::int AS count
    FROM users
    GROUP BY country
    ORDER BY count DESC
  `;

  // Países de los usuarios que estuvieron activos (sincronizaron progreso) en los últimos 7 días.
  const activeCountriesRecent = await sql`
    SELECT COALESCE(u.country, '??') AS country, COUNT(*)::int AS count
    FROM progress p JOIN users u ON u.id = p.user_id
    WHERE p.updated_at > now() - interval '7 days'
    GROUP BY country
    ORDER BY count DESC
  `;

  const [activity] = await sql`
    SELECT
      COUNT(*) FILTER (WHERE updated_at > now() - interval '1 day')::int   AS active_24h,
      COUNT(*) FILTER (WHERE updated_at > now() - interval '7 days')::int  AS active_7d,
      COUNT(*) FILTER (WHERE updated_at > now() - interval '30 days')::int AS active_30d,
      COUNT(*)::int AS with_progress
    FROM progress
  `;

  // Ojo: el progreso real queda anidado un nivel más adentro — data.progress.xp, no data.xp —
  // porque el cliente sincroniza {progress, srData, adaptData, errors, mistakes} como un solo objeto.
  const [activation] = await sql`
    SELECT
      COUNT(*)::int AS with_progress,
      COUNT(*) FILTER (
        WHERE COALESCE((data->'progress'->>'xp')::numeric, 0) > 0
           OR COALESCE((data->'progress'->'stats'->>'quizTotal')::int, 0) > 0
      )::int AS activated
    FROM progress
  `;

  const [depth] = await sql`
    SELECT
      AVG(COALESCE((data->'progress'->>'xp')::numeric, 0))                                    AS avg_xp,
      SUM(COALESCE((data->'progress'->'stats'->>'quizCorrect')::int, 0))                       AS total_correct,
      SUM(COALESCE((data->'progress'->'stats'->>'quizTotal')::int, 0))                         AS total_answered,
      AVG(COALESCE(jsonb_array_length(data->'progress'->'stats'->'casesDone'), 0))             AS avg_cases_done
    FROM progress
  `;

  res.status(200).json({
    count,
    users,
    signupsByDay,
    roleBreakdown,
    countryBreakdown,
    activeCountriesRecent,
    activity: {
      active24h: activity.active_24h,
      active7d: activity.active_7d,
      active30d: activity.active_30d,
      withProgress: activity.with_progress,
    },
    activation: {
      withProgress: activation.with_progress,
      activated: activation.activated,
      totalUsers: count,
    },
    depth: {
      avgXp: Number(depth.avg_xp) || 0,
      totalCorrect: Number(depth.total_correct) || 0,
      totalAnswered: Number(depth.total_answered) || 0,
      avgCasesDone: Number(depth.avg_cases_done) || 0,
    },
  });
}
