import type { Metadata } from "next";
import "./globals.css";
import COMPANY from "@/lib/company.config";

export const metadata: Metadata = {
  title: `${COMPANY.name} — AI-powered solar platform`,
  description: `Go solar with intelligent decisions — ${COMPANY.name}`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head />
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
