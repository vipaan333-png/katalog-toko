import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PT VALOR INSPIRATION PESONA - Katalog Produk",
  description: "Katalog produk lengkap dengan berbagai kategori termasuk DIOSYS, GIP, Softlens, dan produk kecantikan lainnya",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}

