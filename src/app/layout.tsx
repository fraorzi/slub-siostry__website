import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Caveat, Cormorant_Garamond, Courier_Prime, Fraunces, Instrument_Serif, Inter_Tight, Josefin_Sans, Pinyon_Script, Poiret_One } from "next/font/google";
import localFont from "next/font/local";
import { wedding } from "@/content/wedding";
import { readDesign } from "@/design/server";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin", "latin-ext"], weight: ["500", "600"], preload: false });

const general = localFont({
  variable: "--font-general",
  src: [
    { path: "./fonts/GeneralSans-Regular.woff2", weight: "400" },
    { path: "./fonts/GeneralSans-Medium.woff2", weight: "500" },
  ],
});

// Kroje stylów z panelu projektu. Bez preloadu: przeglądarka pobiera je dopiero, gdy styl jest włączony.
// Po wyborze stylu zostają tylko jego kroje.
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin", "latin-ext"], style: ["normal", "italic"], axes: ["SOFT", "WONK", "opsz"], preload: false });
const pinyon = Pinyon_Script({ variable: "--font-pinyon", subsets: ["latin", "latin-ext"], weight: "400", preload: false });
const poiret = Poiret_One({ variable: "--font-poiret", subsets: ["latin", "latin-ext"], weight: "400", preload: false });
const josefin = Josefin_Sans({ variable: "--font-josefin", subsets: ["latin", "latin-ext"], preload: false });
const bodoni = Bodoni_Moda({ variable: "--font-bodoni", subsets: ["latin", "latin-ext"], style: ["normal", "italic"], axes: ["opsz"], preload: false });
const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin", "latin-ext"], preload: false });
const instrument = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin", "latin-ext"], weight: "400", style: ["normal", "italic"], preload: false });
const courier = Courier_Prime({ variable: "--font-courier", subsets: ["latin", "latin-ext"], weight: ["400", "700"], preload: false });

const fonts = [cormorant, caveat, general, fraunces, pinyon, poiret, josefin, bodoni, interTight, instrument, courier].map((f) => f.variable).join(" ");

export const metadata: Metadata = {
  title: `${wedding.bride} & ${wedding.groom} — ${wedding.dateLabel}`,
  description: "Zaproszenie i informacje dla gości weselnych.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
};

export const viewport: Viewport = {
  themeColor: "#fbf9f4",
  colorScheme: "light",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const design = await readDesign();
  return (
    <html lang="pl" data-style={design.style} className={`${fonts} antialiased`}>
      <body data-theme="day" className="font-sans text-base leading-relaxed">{children}</body>
    </html>
  );
}
