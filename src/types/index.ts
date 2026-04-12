export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  thumbnail: string;
  url?: string;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
}

export interface Founder {
  id?: string;
  name: string;
  role: string;
  bio: string;
  quote: string;
  image: string;
  instagram?: string;
}

export interface EventPhoto {
  src: string;
  alt: string;
}

export interface NewsApiArticle {
  article_id: string;
  title: string;
  description: string | null;
  link: string;
  image_url: string | null;
  pubDate: string;
  source_name: string;
  category: string[];
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  results: NewsApiArticle[];
  nextPage?: string;
}
