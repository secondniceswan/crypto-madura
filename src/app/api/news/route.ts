import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.NEWSDATA_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ results: [] });
  }

  try {
    const res = await fetch(
      `https://newsdata.io/api/1/crypto?apikey=${apiKey}&language=id,en&size=6`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return NextResponse.json({ results: [] });
    }

    const data = await res.json();
    return NextResponse.json({ results: data.results ?? [] });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
