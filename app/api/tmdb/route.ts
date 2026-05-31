import { NextRequest, NextResponse } from "next/server";
import { guardProxyRequest } from "@/lib/api-guards";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const guard = await guardProxyRequest(request);
  if (!guard.ok) return guard.response;
  if (!guard.q) return NextResponse.json({ movies: [] });

  const key = process.env.TMDB_API_KEY;
  if (!key) return NextResponse.json({ error: "TMDB not configured" }, { status: 500 });

  const url = new URL("https://api.themoviedb.org/3/search/movie");
  url.searchParams.set("query", guard.q);
  url.searchParams.set("language", "fr-FR");
  url.searchParams.set("include_adult", "false");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  if (!res.ok) return NextResponse.json({ error: "TMDB error" }, { status: 502 });

  const data = await res.json();
  const movies = (data.results ?? []).slice(0, 8).map((m: {
    id: number;
    title: string;
    release_date?: string;
    poster_path: string | null;
    vote_average?: number;
    vote_count?: number;
  }) => ({
    id: m.id,
    title: m.title,
    year: m.release_date ? m.release_date.slice(0, 4) : null,
    posterThumb: m.poster_path ? `https://image.tmdb.org/t/p/w200${m.poster_path}` : null,
    posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : "",
    voteAverage: (m.vote_count ?? 0) > 0 ? m.vote_average ?? null : null,
  }));

  return NextResponse.json({ movies });
}
