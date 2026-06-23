import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import Analytics from "./components/Analytics";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.monkeia.com"),
  title: "Monkeia — Automatización con IA para escalar tu negocio",
  description:
    "Instalamos el sistema que convierte tus leads de Meta en clientes. Sin setters. Sin seguimiento manual. Pipeline autónomo en 30 días.",
  keywords: [
    "automatización con IA",
    "agencia Meta Ads Costa Rica",
    "chatbot WhatsApp ventas",
    "sistema de ventas automático",
    "captación de leads Costa Rica",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://www.monkeia.com",
    siteName: "Monkeia",
    title: "Monkeia — Automatización con IA para escalar tu negocio",
    description:
      "El sistema que convierte tus leads de Meta en clientes. Pipeline autónomo en 30 días.",
    locale: "es_CR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Monkeia — Automatización con IA para escalar tu negocio",
    description:
      "El sistema que convierte tus leads de Meta en clientes. Pipeline autónomo en 30 días.",
  },
  icons: { icon: "/logo.svg" },
  // verification: { google: "PEGAR-CÓDIGO-SEARCH-CONSOLE" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${dmSans.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-black text-white antialiased">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Monkeia",
              url: "https://www.monkeia.com",
              description:
                "Agencia de automatización con IA y Meta Ads. Sistemas autónomos de captación, calificación y seguimiento de leads.",
              areaServed: { "@type": "Country", name: "Costa Rica" },
              telephone: "+50683225178",
              email: "hi@monkeia.com",
              sameAs: [],
            }),
          }}
        />
        <Analytics />
        <VercelAnalytics />
        <SpeedInsights />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
