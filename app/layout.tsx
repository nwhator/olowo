import type { Metadata } from 'next';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { MarketProvider } from '@/components/market/MarketContext';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-mono',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'OLOWO — Autonomous AI Money Operator for Market Traders & Modern Business',
  description:
    'OLOWO is an autonomous AI financial operator built for African market traders and modern SMEs. We verify paper waybills, prevent duplicate invoice fraud, protect shop rent reserves, and settle permitted payments in USDC on Arc (<500ms). Built for Tameion Agents Hackathon (Canteen × Circle × Arc).',
  keywords: [
    'OLOWO',
    'AI Finance Operator',
    'Autonomous Treasury',
    'African Market Women',
    'Balogun Market',
    'Kantin Kwari',
    'Circle USDC',
    'Arc Network',
    'Tameion Hackathon',
    'Canteen',
    'Waybill OCR',
    'Fraud Prevention',
    'Nigerian Pidgin AI',
    'Web3 SME Finance',
  ],
  authors: [{ name: 'OLOWO Team' }],
  creator: 'OLOWO',
  publisher: 'OLOWO Finance',
  metadataBase: new URL('https://olowo.finance'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/favicon.svg' }],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'OLOWO — AI Finance Operator | Watch the money. Face your business.',
    description:
      'Autonomous finance within your rules. OLOWO monitors obligations, verifies handwritten waybills, executes permitted USDC payments on Arc, and protects shop rent reserves.',
    url: 'https://olowo.finance',
    siteName: 'OLOWO Finance',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OLOWO — Autonomous AI Finance Operator',
    description:
      'Watch the money. Face your business. Autonomous finance for African market traders & modern SMEs. Settled on Arc in USDC, powered by Circle.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: 'OLOWO AI Finance Operator',
  description:
    'Autonomous AI money operator for African market traders and modern business. Settled on Arc Network in Circle USDC.',
  brand: {
    '@type': 'Brand',
    name: 'OLOWO',
  },
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ibmPlexMono.variable} h-full antialiased light`}
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('olowo-theme');
                  var theme = (saved === 'dark') ? 'dark' : 'light';
                  var root = document.documentElement;
                  root.classList.remove('dark', 'light');
                  root.classList.add(theme);
                  root.setAttribute('data-theme', theme);
                } catch(e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen w-full overflow-x-hidden flex flex-col bg-[#F7F8FA] dark:bg-[#08111F] text-[#101828] dark:text-white transition-colors duration-150">
        <ThemeProvider>
          <MarketProvider>{children}</MarketProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
