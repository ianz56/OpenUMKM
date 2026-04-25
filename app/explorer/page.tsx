'use client';

import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';
import { useEffect, useState, useCallback } from 'react';

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
}

interface ApiResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

function ratingStars(rating: number) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return { full, half, empty };
}

function SkeletonCard() {
    return (
        <article className="animate-pulse rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="aspect-square w-full rounded-lg bg-slate-200" />
            <div className="mt-4 h-4 w-3/4 rounded bg-slate-200" />
            <div className="mt-2 h-3 w-full rounded bg-slate-200" />
            <div className="mt-1 h-3 w-5/6 rounded bg-slate-200" />
            <div className="mt-4 flex items-center justify-between">
                <div className="h-5 w-16 rounded bg-slate-200" />
                <div className="h-5 w-12 rounded bg-slate-200" />
            </div>
        </article>
    );
}

function StatusBadge({ status }: { status: 'idle' | 'loading' | 'success' | 'error' }) {
    const map = {
        idle: { bg: 'bg-slate-100', text: 'text-slate-500', icon: 'ri-time-line', label: 'Idle' },
        loading: { bg: 'bg-amber-100', text: 'text-amber-600', icon: 'ri-loader-4-line', label: 'Loading…' },
        success: { bg: 'bg-emerald-100', text: 'text-emerald-600', icon: 'ri-check-line', label: 'Done' },
        error: { bg: 'bg-red-100', text: 'text-red-600', icon: 'ri-error-warning-line', label: 'Error' },
    };
    const s = map[status];
    return (
        <span
            data-testid="fetch-status-badge"
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${s.bg} ${s.text}`}
        >
            <i className={`${s.icon} ${status === 'loading' ? 'animate-spin' : ''}`} />
            {s.label}
        </span>
    );
}

function ProductCard({ product }: { product: Product }) {
    const stars = ratingStars(product.rating);
    const discountedPrice = product.price * (1 - product.discountPercentage / 100);

    return (
        <article
            data-testid={`product-card-${product.id}`}
            className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
        >
            <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                <img
                    src={product.thumbnail}
                    alt={product.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                {product.discountPercentage > 5 && (
                    <span className="absolute top-2 left-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                        -{Math.round(product.discountPercentage)}%
                    </span>
                )}
                <span className="absolute top-2 right-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-600 shadow backdrop-blur-sm">
                    {product.category}
                </span>
            </div>

            <div className="mt-3">
                {product.brand && (
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">
                        {product.brand}
                    </p>
                )}
                <h3 className="mt-0.5 line-clamp-1 text-sm font-bold text-slate-900">{product.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{product.description}</p>
            </div>

            <div className="mt-3 flex items-center gap-1">
                {[...Array(stars.full)].map((_, i) => (
                    <i key={`full-${product.id}-${i}`} className="ri-star-fill text-sm text-amber-400" />
                ))}
                {stars.half ? <i className="ri-star-half-fill text-sm text-amber-400" /> : null}
                {[...Array(stars.empty)].map((_, i) => (
                    <i key={`empty-${product.id}-${i}`} className="ri-star-line text-sm text-slate-300" />
                ))}
                <span className="ml-1 text-xs text-slate-400">{product.rating.toFixed(1)}</span>
            </div>

            <div className="mt-3 flex items-end justify-between">
                <div>
                    <p className="text-lg font-black text-slate-900">{formatCurrency(discountedPrice)}</p>
                    {product.discountPercentage > 5 && (
                        <p className="text-xs text-slate-400 line-through">{formatCurrency(product.price)}</p>
                    )}
                </div>
                <span
                    className={`text-[11px] font-semibold ${product.stock > 10 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-500'
                        }`}
                >
                    {product.stock > 10 ? 'Stok tersedia' : product.stock > 0 ? `Sisa ${product.stock}` : 'Habis'}
                </span>
            </div>
        </article>
    );
}

export default function ExplorerPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filtered, setFiltered] = useState<Product[]>([]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [fetchTime, setFetchTime] = useState<number | null>(null);
    const [totalFromApi, setTotalFromApi] = useState<number>(0);

    const fetchProducts = useCallback(async () => {
        setStatus('loading');
        setError(null);
        const start = performance.now();

        try {
            const res = await fetch('https://dummyjson.com/products?limit=30&select=id,title,description,price,discountPercentage,rating,stock,brand,category,thumbnail,images');
            if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            const data: ApiResponse = await res.json();
            const elapsed = performance.now() - start;

            setProducts(data.products);
            setFiltered(data.products);
            setTotalFromApi(data.total);
            setFetchTime(Math.round(elapsed));
            setStatus('success');
        } catch (err) {
            const elapsed = performance.now() - start;
            setFetchTime(Math.round(elapsed));
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
            setStatus('error');
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        let result = products;
        if (category !== 'all') {
            result = result.filter((p) => p.category === category);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q) ||
                    (p.brand && p.brand.toLowerCase().includes(q)),
            );
        }
        setFiltered(result);
    }, [search, category, products]);

    const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

    return (
        <div className="bg-white overflow-hidden" data-testid="explorer-page">
            <Navbar />

            <main className="mx-auto max-w-[1220px] flex-grow space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                {/* Hero */}
                <section className="relative isolate overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-10">
                    <div className="max-w-3xl">
                        <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                            Katalog Produk <span className="text-blue-600">DummyJSON</span>
                        </h1>
                        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                            Semua produk di halaman ini diambil langsung dari{' '}
                            <a
                                href="https://dummyjson.com/docs/products"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-blue-600 underline decoration-blue-300 underline-offset-2 transition hover:text-blue-700"
                            >
                                dummyjson.com
                            </a>
                            {' '}lewat API. Untuk pelengkap dan memenuhi kriteria tugas :D.
                        </p>
                    </div>
                </section>



                {/* Filters */}
                <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="relative flex-grow max-w-md">
                        <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input
                            type="text"
                            placeholder="Cari produk..."
                            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Kategori:</span>
                            <select
                                className="rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 appearance-none cursor-pointer"
                                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem', backgroundRepeat: 'no-repeat' }}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {categories.map((c) => (
                                    <option key={c} value={c} className="capitalize">
                                        {c === 'all' ? 'Semua Kategori' : c.replace(/-/g, ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Product Grid */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-black tracking-tight text-slate-900">
                            Daftar Produk
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Data di bawah di-fetch dari API.
                        </p>
                    </div>

                    {status === 'loading' && (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="skeleton-grid">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonCard key={`skeleton-${i}`} />
                            ))}
                        </div>
                    )}

                    {status === 'error' && (
                        <div
                            data-testid="error-panel"
                            className="flex flex-col items-center gap-4 rounded-xl border border-red-200 bg-red-50 p-8 text-center"
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500">
                                <i className="ri-error-warning-line text-3xl" />
                            </div>
                            <div>
                                <p className="font-bold text-red-700">Gagal fetch data</p>
                                <p className="mt-1 text-sm text-red-500">{error}</p>
                            </div>
                            <button
                                type="button"
                                onClick={fetchProducts}
                                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                            >
                                Coba Lagi
                            </button>
                        </div>
                    )}

                    {status === 'success' && filtered.length > 0 && (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="product-grid">
                            {filtered.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    {status === 'success' && filtered.length === 0 && (
                        <div className="flex flex-col items-center gap-3 py-12 text-center" data-testid="empty-state">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <i className="ri-search-eye-line text-3xl" />
                            </div>
                            <p className="font-bold text-slate-700">Nggak ada yang cocok</p>
                            <p className="text-sm text-slate-500">Coba ganti keyword atau kategorinya.</p>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    setCategory('all');
                                }}
                                className="mt-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Reset Filter
                            </button>
                        </div>
                    )}
                </section>


            </main>

            <Footer />
        </div>
    );
}
