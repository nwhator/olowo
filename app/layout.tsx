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
  title: 'OLOWO — AI Finance Operator',
  description:
    'Autonomous finance within your rules. OLOWO monitors obligations, verifies invoices, executes permitted USDC payments on Arc, and protects your treasury.',
  icons: {
    icon: '/favicon.ico',
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
      </head>
      <body className="min-h-screen w-full overflow-x-hidden flex flex-col bg-[#F7F8FA] dark:bg-[#08111F] text-[#101828] dark:text-white transition-colors duration-150">
        <ThemeProvider>
          <MarketProvider>{children}</MarketProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
