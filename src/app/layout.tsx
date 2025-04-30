import clsx from "clsx";
import type { Metadata } from "next";
import "./globals.scss";
import { Providers } from "./providers";
import Section from "./section";

const title = `Arise Connext ${process.env.NEXT_PUBLIC_ARISE_CONNEXT_EP}`;
const description = "Arise by INFINITAS, Making digital life possible for All";
const keywords = [""];
export const metadata: Metadata = {
  title: title,
  description: description,
  generator: "Next.js",
  keywords: keywords,
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
  authors: [
    { name: "Thitipat Na Nakorn" },
    {
      name: "Thitipat Na Nakorn",
      url: "https://www.linkedin.com/in/thitipat-na-nakorn/",
    },
  ],
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "icons/apple-touch-icon.png" },
    { rel: "icon", url: "icons/favicon-32x32.png" },
  ],
  openGraph: {
    type: "website",
    url: process.env.NEXT_PUBLIC_URL,
    title: title,
    description: description,
    siteName: title,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_URL}/images/cover.png`,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={clsx(" antialiasedbg ")}>
        <Providers>
          <Section>{children}</Section>
        </Providers>
      </body>
    </html>
  );
}
