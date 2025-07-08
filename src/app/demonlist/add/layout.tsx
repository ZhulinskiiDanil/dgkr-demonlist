import type { Metadata } from 'next';

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
  return children;
}
