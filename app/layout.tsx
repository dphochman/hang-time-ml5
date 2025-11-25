import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Hang Time - Reach Higher',
  description: 'Learn to jump higher by analyzing your jump video.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js" strategy="afterInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/ml5@0.12.2/dist/ml5.min.js" strategy="afterInteractive" />
        {children}
      </body>
    </html>
  );
}
