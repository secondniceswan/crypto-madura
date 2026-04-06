import type { NewsApiResponse, NewsApiArticle } from "@/types";

const API_KEY = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;
const BASE_URL = "https://newsdata.io/api/1/crypto";

export async function fetchCryptoNews(): Promise<NewsApiArticle[]> {
  if (!API_KEY) {
    return [];
  }

  try {
    const res = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&language=id,en&size=6`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return [];
    }

    const data: NewsApiResponse = await res.json();
    return data.results ?? [];
  } catch {
    return [];
  }
}
