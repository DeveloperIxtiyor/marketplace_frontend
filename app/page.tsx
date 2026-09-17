import Link from "next/link";

const categories = [
  "Elektronika",
  "Kiyim",
  "Uy jihozlari",
  "Sog‘liq",
  "Aksesuarlar",
];

const featured = [
  { name: "Smart Watch Pro", price: "1 290 000 so‘m", badge: "Yangi" },
  { name: "AirPods Max", price: "2 890 000 so‘m", badge: "Top sale" },
  { name: "Mini Projector", price: "3 450 000 so‘m", badge: "Chegirma" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div>
          <span className="text-2xl font-black tracking-tight text-emerald-400">Market</span>
        </div>

        <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#catalog" className="hover:text-white">Katalog</a>
          <a href="#offers" className="hover:text-white">Takliflar</a>
          <a href="#about" className="hover:text-white">Biz haqimizda</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5">Kirish</Link>
          <Link href="/register" className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400">Ro‘yxatdan o‘tish</Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-[1.2fr_0.8fr] md:py-20">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">
            Marketplace
          </p>
          <h1 className="max-w-xl text-5xl font-black leading-tight tracking-tight">
            Bugungi mahsulotlarni qulay va tezda toping.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-slate-300">
            Telegram mini app va veb platforma uchun ishlab chiqilgan marketplace. Mahsulotlarni qidiring, tanlang va xususiy kabinet orqali boshqaring.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/register" className="rounded-2xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400">Boshlash</Link>
            <Link href="/login" className="rounded-2xl border border-white/10 px-6 py-3 font-semibold text-white hover:bg-white/5">Kabinetga kirish</Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-300">
            <div><span className="block text-2xl font-bold text-white">12k+</span> Foydalanuvchi</div>
            <div><span className="block text-2xl font-bold text-white">4.8/5</span> Baho</div>
            <div><span className="block text-2xl font-bold text-white">24/7</span> Support</div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
          <div className="rounded-2xl bg-gradient-to-br from-emerald-500/30 via-slate-900 to-cyan-500/20 p-6">
            <p className="text-sm text-slate-300">Bugun</p>
            <h2 className="mt-3 text-3xl font-bold">Yangi chegirmalar</h2>
            <div className="mt-8 space-y-4">
              {featured.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-2xl bg-slate-950/60 p-4">
                  <div>
                    <p className="text-sm text-emerald-300">{item.badge}</p>
                    <p className="mt-1 font-medium">{item.name}</p>
                  </div>
                  <span className="font-semibold text-emerald-400">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="catalog" className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Katalog</h2>
          <a href="#offers" className="text-sm text-emerald-400">Barchasini ko‘rish</a>
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          {categories.map((category) => (
            <div key={category} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm font-medium text-slate-200 hover:border-emerald-400/40">
              {category}
            </div>
          ))}
        </div>
      </section>

      <section id="offers" className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="mb-6 text-2xl font-bold">Mashhur mahsulotlar</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((item, index) => (
            <article key={item.name} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="mb-5 h-44 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900" />
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">{item.badge}</span>
                <span className="text-sm text-slate-400">#{index + 1}</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold">{item.name}</h3>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-lg font-bold text-emerald-400">{item.price}</span>
                <button className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-950">Savatga</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl px-6 pb-20 pt-6">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 p-8 text-center">
          <h2 className="text-2xl font-bold">Telegram va veb uchun qulay marketplace</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">
            Foydalanuvchilar ro‘yxatdan o‘tib, profilni boshqarib, mahsulotlarni tanlab, xaridlar va buyurtmalarini qulay usulda yuritadi.
          </p>
        </div>
      </section>
    </main>
  );
}
