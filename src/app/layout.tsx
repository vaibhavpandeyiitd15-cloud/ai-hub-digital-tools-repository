import type { Metadata } from "next";
import { headers } from "next/headers";
import { Barlow, Inter } from "next/font/google";
import { BookingProvider } from "@/components/booking/BookingProvider";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getActiveTools } from "@/lib/tools";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Desire Lab | Unilever",
  description:
    "Desire Lab — Consumer Focused and Science Focused innovation tools at Unilever Head Office.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <html lang="en" className={`${barlow.variable} ${inter.variable} h-full`}>
        <body className="min-h-full antialiased">{children}</body>
      </html>
    );
  }

  const tools = await getActiveTools();
  const bookingTools = tools.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    pocName: t.pocName,
    pocEmail: t.pocEmail,
  }));

  return (
    <html lang="en" className={`${barlow.variable} ${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <BookingProvider allTools={bookingTools}>
          <ChatProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <ChatWidget />
          </ChatProvider>
        </BookingProvider>
      </body>
    </html>
  );
}
