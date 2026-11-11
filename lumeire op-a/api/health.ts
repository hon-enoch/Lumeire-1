import { neon } from "@neondatabase/serverless";

type ApiRequest = { method?: string };
type ApiResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(body: unknown): void;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(503).json({
      ok: false,
      error: "Database connection is not configured",
    });
  }

  try {
    const sql = neon(databaseUrl);
    const rows = await sql`SELECT 1 AS connected, current_database() AS database`;
    return res.status(200).json({
      ok: true,
      service: "lumeire-api",
      database: rows[0]?.database ?? "connected",
    });
  } catch (error) {
    console.error("Database health check failed", error);
    return res.status(503).json({
      ok: false,
      error: "Database connection failed",
    });
  }
}
