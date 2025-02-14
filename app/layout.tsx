import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Moving Time Calculator',
  description: 'Calculate your moving time',
  manifest: '/site.webmanifest',
  other: {
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL,
  },
  openGraph: {
    title: 'Moving Time Calculator',
    description: 'Calculate your moving time',
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: 'Moving Time Calculator',
    images: [{ url: '/og-image.png' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-muted dark:bg-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
