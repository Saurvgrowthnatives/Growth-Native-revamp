import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Agentation } from "agentation";
import { SiteHeader } from "@/components/site-header/site-header";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Growth Natives — AI-Native Digital Transformation & Growth",
  description:
    "Growth Natives combines AI, strategy, technology, data, and creativity to build scalable growth systems for businesses.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
