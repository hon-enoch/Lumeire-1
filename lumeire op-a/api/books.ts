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
    return res.status(405).json({ error: "Method not allowed" });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(503).json({ error: "Database connection is not configured" });
  }

  try {
    const sql = neon(databaseUrl);
    const books = await sql`
      SELECT
        b.id,
        b.title,
        b.author,
        b.category_id AS "categoryId",
        c.label AS category,
        b.price,
        b.original_price AS "originalPrice",
        b.rating,
        b.reviews,
        b.formats,
        b.tags,
        b.isbn,
        b.color,
        b.cover,
        b.badge,
        b.description,
        b.chapters,
        b.cover_image_url AS "coverImageUrl",
        b.hidden
      FROM public.books AS b
      LEFT JOIN public.categories AS c ON c.id = b.category_id
      WHERE b.hidden = false
      ORDER BY b.created_at DESC, b.title ASC
      LIMIT 100
    `;

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ books });
  } catch (error) {
    console.error("Book catalogue query failed", error);
    return res.status(500).json({ error: "Unable to load the book catalogue" });
  }
}
