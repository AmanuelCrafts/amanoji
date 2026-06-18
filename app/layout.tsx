import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import EmojiRenderer from './components/EmojiRenderer';

const siteUrl = 'https://amanoji.vercel.app';
const siteName = 'Amanoji';
const description = 'Search and stream movies & TV shows instantly. Free, fast, no sign-up.';

export const metadata: Metadata = {
  title: {
    default: `${siteName} — Watch Movies & TV Shows Free`,
    template: `%s | ${siteName}`,
  },
  description,
  keywords: ['watch movies free', 'stream TV shows', 'free movie streaming', 'Amanoji', 'watch online'],
  authors: [{ name: 'Amanoji' }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: `${siteName} — Watch Movies & TV Shows Free`,
    description,
    url: siteUrl,
    siteName,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} — Watch Movies & TV Shows Free`,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎬</text></svg>" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: siteName,
              url: siteUrl,
              description,
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${siteUrl}/?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6168141382402894" crossOrigin="anonymous" />
      </head>
      <body><EmojiRenderer>{children}</EmojiRenderer></body>
      <Analytics />
    </html>
  );
}
