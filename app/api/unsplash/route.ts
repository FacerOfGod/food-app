import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q) return NextResponse.json({ photos: [] });

  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    return NextResponse.json({ error: "Unsplash not configured" }, { status: 500 });
  }

  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=6&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${key}` } }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Unsplash error" }, { status: 502 });
  }

  const data = await res.json();
  const photos = (data.results ?? []).map((p: { urls: { small: string; regular: string }; alt_description: string | null }) => ({
    thumb: p.urls.small,
    url: p.urls.regular + "&w=600&h=400&fit=crop&q=80",
    alt: p.alt_description ?? q,
  }));

  return NextResponse.json({ photos });
}
