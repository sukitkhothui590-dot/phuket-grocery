import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import { Header, Footer } from "@/components/layout";
import { AppProviders } from "@/components/providers/app-providers";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import { getCategories } from "@/lib/api/products";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-sans",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | สินค้าอุปโภคบริโภค ราคาส่ง ภูเก็ต`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();

  return (
    <html lang="th">
      <body className={`${notoSansThai.variable} font-sans antialiased`}>
        <AppProviders>
          <div className="flex min-h-screen flex-col">
            <Header categories={categories} />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
