import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: "Bright Ears - Book DJs, Bands & Entertainment Thailand",
  description: "Book professional DJs, bands, and entertainment for events in Thailand. No commission fees. Trusted by leading hotels and venues.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}