import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CryptoEdu - Learn Crypto Trading',
  description: 'Expert-led cryptocurrency education platform with flexible learning plans and earning opportunities',
  keywords: 'crypto, trading, education, blockchain, cryptocurrency',
  openGraph: {
    title: 'CryptoEdu - Learn Crypto Trading',
    description: 'Expert-led cryptocurrency education platform',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <ToastProvider>
            {children}
          </ToastProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}