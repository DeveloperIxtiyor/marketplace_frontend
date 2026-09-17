import Link from "next/link";

const products = [
    { id: 1, name: "AirPods Pro", price: "1 299 000 so‘m", status: "New" },
    { id: 2, name: "Smart Watch X", price: "2 450 000 so‘m", status: "Popular" },
    { id: 3, name: "Laptop Air 14", price: "8 990 000 so‘m", status: "Hot" },
    { id: 4, name: "Bluetooth Speaker", price: "690 000 so‘m", status: "Sale" },
    { id: 5, name: "Power Bank 20000", price: "540 000 so‘m", status: "New" },
    { id: 6, name: "4K Camera", price: "3 800 000 so‘m", status: "Best" },
];

export default function BuyPage() {
    return (
        <main className="min-h-screen bg-[#020b1f] px-4 py-8 text-white md:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-[#9f7aea]">Marketplace</p>
                        <h1 className="mt-3 text-4xl font-black">Sotib olish</h1>
                    </div>
                    <Link href="/" className="rounded-xl border border-white/10 bg-[#13233b] px-4 py-2 text-sm font-medium hover:bg-[#1a2c48]">
                        Orqaga
                    </Link>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {products.map((product) => (
                        <article key={product.id} className="rounded-[24px] border border-white/10 bg-[#0d1b2a]/90 p-4 shadow-[0_0_24px_rgba(15,23,42,0.6)]">
                            <div className="h-44 rounded-[18px] bg-gradient-to-br from-[#2a3d63] via-[#1b2d46] to-[#0d1426]" />

                            <div className="mt-4 flex items-center justify-between">
                                <span className="rounded-full bg-[#2e5d88]/20 px-2 py-1 text-xs font-medium text-[#8cc8ff]">
                                    {product.status}
                                </span>
                                <span className="text-sm text-slate-400">#{product.id}</span>
                            </div>

                            <h2 className="mt-4 text-2xl font-semibold text-white">{product.name}</h2>

                            <div className="mt-5 flex items-center justify-between">
                                <span className="text-lg font-bold text-[#8ef0c4]">{product.price}</span>
                                <button className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200">
                                    Buy now
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
}
