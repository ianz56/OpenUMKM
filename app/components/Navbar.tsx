import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
        <Link href="/" data-testid="nav-logo" className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
          OpenUMKM
        </Link>

        <nav aria-label="Menu utama" className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-10 text-sm font-semibold text-slate-700">
            <li>
              <Link href="/" data-testid="nav-home" className="transition hover:text-blue-600">Beranda</Link>
            </li>
            <li>
              <Link href="/services" data-testid="nav-services" className="transition hover:text-blue-600">Layanan</Link>
            </li>
            <li>
              <Link href="/about-us" data-testid="nav-about" className="transition hover:text-blue-600">Tentang Kami</Link>
            </li>
            <li>
              <Link href="/teams" data-testid="nav-teams" className="transition hover:text-blue-600">Tim</Link>
            </li>
            <li>
              <Link href="/contact" data-testid="nav-contact" className="transition hover:text-blue-600">Kontak</Link>
            </li>
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/contact"
            data-testid="nav-cta-join"
            className="hidden rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700 sm:inline-block"
          >
            Gabung Sekarang
          </Link>

          <details className="relative lg:hidden">
            <summary
              className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100"
              data-testid="nav-mobile-toggle"
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
                  <Link href="/" data-testid="nav-mobile-home" className="block rounded-lg px-3 py-2 hover:bg-slate-100">Beranda</Link>
                </li>
                <li>
                  <Link href="/services" data-testid="nav-mobile-services" className="block rounded-lg px-3 py-2 hover:bg-slate-100">Layanan</Link>
                </li>
                <li>
                  <Link href="/about-us" data-testid="nav-mobile-about" className="block rounded-lg px-3 py-2 hover:bg-slate-100">Tentang Kami</Link>
                </li>
                <li>
                  <Link href="/teams" data-testid="nav-mobile-teams" className="block rounded-lg px-3 py-2 hover:bg-slate-100">Tim</Link>
                </li>
                <li>
                  <Link href="/contact" data-testid="nav-mobile-contact" className="block rounded-lg px-3 py-2 hover:bg-slate-100">Kontak</Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    data-testid="nav-mobile-cta-join"
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
