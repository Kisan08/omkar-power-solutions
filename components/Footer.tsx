import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Logo */}
        <div className="relative group flex items-center gap-2">
          <Image src="/logo.png" alt="OPS" width={28} height={28} className="object-contain" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">OPS</span>
          <span className="text-sm text-gray-400 ml-2">· Built for India · © 2025</span>
          <div className="absolute left-0 -top-8 bg-gray-900 border border-gray-700 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Omkar Power Solutions
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          <Link href="#" className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            Privacy
          </Link>
          <Link href="#" className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            Terms
          </Link>
          <Link href="#" className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            Contact
          </Link>
          <Link href="#" className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            Blog
          </Link>
        </div>

      </div>
    </footer>
  );
}