import Link from "next/link";

const products = [
  { id: 1, name: "AirPods Pro", price: "1 299 000 so‘m", status: "New" },
  { id: 2, name: "Smart Watch X", price: "2 450 000 so‘m", status: "Popular" },
  { id: 3, name: "Laptop Air 14", price: "8 990 000 so‘m", status: "Hot" },
  { id: 4, name: "Bluetooth Speaker", price: "690 000 so‘m", status: "Sale" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#020b1f] px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-[28px] border border-white/10 bg-[#0d1b2a]/90 px-6 py-5 shadow-[0_0_40px_rgba(15,23,42,0.8)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#9f7aea]">Account</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white">demo</h1>
            </div>

            <button className="rounded-xl border border-white/10 bg-[#1d2b3c] px-4 py-3 text-lg font-semibold text-white transition hover:bg-[#25344d]">
              Chiqish
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-[24px] border border-white/10 bg-[#0d1b2a]/90 p-6">
            <p className="text-xl text-slate-300">Email</p>
            <p className="mt-4 text-2xl font-semibold text-white">demodemo123@gmail.com</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-[#0d1b2a]/90 p-6">
            <p className="text-xl text-slate-300">Telefon</p>
            <p className="mt-4 text-2xl font-semibold text-white">Ko‘rsatilmagan</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-[#0d1b2a]/90 p-6">
            <p className="text-xl text-slate-300">Rol</p>
            <p className="mt-4 text-2xl font-semibold text-white">Buyer</p>
          </div>
        </section>

        <section className="mt-8 rounded-[28px] border border-white/10 bg-[#0d1b2a]/90 p-6">
          <h2 className="text-3xl font-bold text-white">Telegram ma’lumotlari</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-[20px] border border-white/10 bg-[#0f1f32] p-5">
              <p className="text-xl text-slate-300">Telegram ID</p>
              <p className="mt-4 text-2xl font-semibold text-white">-</p>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-[#0f1f32] p-5">
              <p className="text-xl text-slate-300">Telegram username</p>
              <p className="mt-4 text-2xl font-semibold text-white">-</p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">Sotib olish</h2>
            <Link href="/buy" className="rounded-xl border border-white/10 bg-[#13233b] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a2c48]">
              Barchasi
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <article key={product.id} className="rounded-[24px] border border-white/10 bg-[#0d1b2a]/90 p-4 shadow-[0_0_24px_rgba(15,23,42,0.6)]">
                <div className="h-40 rounded-[18px] bg-gradient-to-br from-[#273a57] via-[#1d2b3c] to-[#101b2d]" />
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-[#2e5d88]/20 px-2 py-1 text-xs font-medium text-[#8cc8ff]">
                    {product.status}
                  </span>
                  <span className="text-sm text-slate-400">#{product.id}</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">{product.name}</h3>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-lg font-bold text-[#8ef0c4]">{product.price}</span>
                  <Link
                    href="/buy"
                    className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                  >
                    Sotib olish
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
