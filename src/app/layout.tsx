import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Crypto Madura - Komunitas Crypto Madura",
  description:
    "Komunitas edukasi dan trading crypto untuk masyarakat Madura. Bergabung untuk sinyal trading, webinar, dan analisis pasar.",
  keywords: ["crypto", "madura", "trading", "edukasi", "komunitas", "bitcoin"],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Crypto Madura - Komunitas Crypto Madura",
    description:
      "Komunitas edukasi dan trading crypto untuk masyarakat Madura.",
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Crypto Madura",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
