import type { Metadata } from 'next';

import './globals.scss';

import { Providers } from './providers';
import { Header } from '@/widgets/Header/ui';

export const metadata: Metadata = {
  title: 'DGKR Community / Official website',
  description:
    'DGKR Community - Official website of the geometry dash community',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
