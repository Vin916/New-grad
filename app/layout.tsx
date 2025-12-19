import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "AfterGrad - Post-Graduation Outcomes & Career Timeline",
  description:
    "Explore post-graduation outcomes, salary distributions, and career timelines based on your school, major, and goals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={figtree.variable}>
      <body className="font-sans bg-gradient-to-br from-slate-50 via-white to-primary-50 min-h-screen">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl">🎓</span>
                <span className="font-bold text-xl bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                  AfterGrad
                </span>
              </Link>

              <div className="flex items-center gap-6">
                <Link
                  href="/"
                  className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/report"
                  className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
                >
                  Report
                </Link>
                <Link
                  href="/compare"
                  className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
                >
                  Compare
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-16">{children}</main>

        {/* Footer */}
        <footer className="mt-20 py-8 border-t border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎓</span>
                <span className="font-semibold text-slate-900">AfterGrad</span>
              </div>
              <p className="text-sm text-slate-500">
                Skeleton MVP • Data is mock/placeholder only
              </p>
              <div className="text-sm text-slate-400">
                © {new Date().getFullYear()} AfterGrad
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

