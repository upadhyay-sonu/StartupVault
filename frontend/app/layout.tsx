import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Startup Vault - Exclusive SaaS Deals for Founders',
  description: 'Get exclusive discounts on premium SaaS tools for your startup',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="75" font-weight="bold" fill="%233b82f6">V</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-primary via-primary to-secondary">
        <div className="min-h-screen transition-colors duration-300">
          {children}
        </div>
      </body>
    </html>
  );
}
