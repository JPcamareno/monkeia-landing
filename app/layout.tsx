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
  title: "Monkeia — Sistemas de IA y automatización para empresas",
  description:
    "Diseñamos e implementamos sistemas de IA y automatización que ayudan a empresas a vender, atender y operar de forma más eficiente.",
  keywords: [
    "sistemas de IA para empresas",
    "automatización de procesos empresariales",
    "consultoría en IA y automatización",
    "integración de CRM y canales",
    "automatización de ventas y atención",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://www.monkeia.com",
    siteName: "Monkeia",
    title: "Monkeia — Sistemas de IA y automatización para empresas",
    description:
      "Diseñamos e implementamos sistemas de IA y automatización que ayudan a empresas a vender, atender y operar de forma más eficiente.",
    locale: "es_CR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Monkeia — Sistemas de IA y automatización para empresas",
    description:
      "Diseñamos e implementamos sistemas de IA y automatización que ayudan a empresas a vender, atender y operar de forma más eficiente.",
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
                "Diseño e implementación de sistemas de IA y automatización para empresas: ventas, atención y operación conectadas.",
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
