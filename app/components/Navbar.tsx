import React from 'react';
import Link from 'next/link'; // Import Link dari Next.js

const Navbar = () => {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
          OpenUMKM
        </Link>

        <nav aria-label="Menu utama" className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-10 text-sm font-semibold text-slate-700">
            <li>
              <Link href="/" className="transition hover:text-blue-600">Beranda</Link>
            </li>
            <li>
              <Link href="/#benefits" className="transition hover:text-blue-600">Jelajahi</Link>
            </li>
            <li>
              <Link href="/#features" className="transition hover:text-blue-600">Fitur</Link>
            </li>
            <li>
              <Link href="/teams" className="transition hover:text-blue-600">Teams</Link>
            </li>
            <li>
              <Link href="/#kontak" className="transition hover:text-blue-600">Kontak</Link>
            </li>
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/#kontak"
            className="hidden rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700 sm:inline-block"
          >
            Gabung Sekarang
          </Link>

          {/* Burger mobile */}
          <details className="relative lg:hidden">
            <summary
              className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100"
            >
              <span className="sr-only">Buka menu mobile</span>
              <i className="ri-menu-line text-lg"></i>
            </summary>
            <nav
              aria-label="Menu mobile"
              className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-slate-200 bg-white p-3 shadow-lg"
            >
              <ul className="space-y-2 text-sm font-semibold text-slate-700">
                <li>
                  <Link href="/" className="block rounded-lg px-3 py-2 hover:bg-slate-100">Beranda</Link>
                </li>
                <li>
                  <Link href="/#benefits" className="block rounded-lg px-3 py-2 hover:bg-slate-100">Jelajahi</Link>
                </li>
                <li>
                  <Link href="/#features" className="block rounded-lg px-3 py-2 hover:bg-slate-100">Fitur</Link>
                </li>
                <li>
                  <Link href="/teams" className="block rounded-lg px-3 py-2 hover:bg-slate-100 font-bold text-blue-600">Teams</Link>
                </li>
                <li>
                  <Link href="/#kontak" className="block rounded-lg px-3 py-2 hover:bg-slate-100">Kontak</Link>
                </li>
                <li>
                  <Link
                    href="/#kontak"
                    className="mt-2 block rounded-lg bg-blue-600 px-3 py-2 text-center text-white"
                  >
                    Gabung Sekarang
                  </Link>
                </li>
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
};

export default Navbar;