import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL);

let schemaReady = null;
export function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          name TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'estudiante',
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      // Columna agregada después del lanzamiento: país detectado por Vercel al registrarse/iniciar sesión.
      // No se guarda la IP, solo el código de país que Vercel ya resuelve en el header de cada request.
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS country TEXT`;
      await sql`
        CREATE TABLE IF NOT EXISTS sessions (
          token TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          expires_at TIMESTAMPTZ NOT NULL
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS progress (
          user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
          data JSONB NOT NULL DEFAULT '{}'::jsonb,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS password_resets (
          token_hash TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          expires_at TIMESTAMPTZ NOT NULL,
          used_at TIMESTAMPTZ
        )
      `;
      // Para el control de frecuencia: se consultan los pedidos recientes de un usuario.
      await sql`CREATE INDEX IF NOT EXISTS password_resets_user_idx ON password_resets (user_id, created_at DESC)`;
      await sql`
        CREATE TABLE IF NOT EXISTS feedback (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          type TEXT NOT NULL DEFAULT 'sugerencia',
          message TEXT NOT NULL,
          page TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
    })();
  }
  return schemaReady;
}
