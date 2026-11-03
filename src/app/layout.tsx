import type { Metadata } from "next";
import { Geist_Mono, Lora, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/toast";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// Plus Jakarta Sans is a variable font: next/font serves the full weight
// range (400–800) without a `weight` array, and exposing it as
// `--font-sans` feeds the existing `@theme inline` mapping in globals.css.
const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Lora backs the `font-serif` utility used by auth pages and dialogs,
// which previously fell back to the browser default serif.
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BondhuBondhon",
  description: "Together for a Better Community",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakartaSans.variable} ${geistMono.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>

        <Toaster>
          <Navbar />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </Toaster>
        </ThemeProvider>
      </body>
    </html>
  );
}
