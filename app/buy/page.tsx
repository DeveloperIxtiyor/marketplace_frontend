"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { apiSoraq } from "@/lib/api";

interface Mahsulot {
  id: number;
  nomi: string;
  narx: number;
  status?: string | null;
  rasm_havolasi?: string | null;
}

export default function SotibOlishSahifa() {
  const [mahsulotlar, setMahsulotlar] = useState<Mahsulot[]>([]);
  const [yuklanmoqda, setYuklanmoqda] = useState(true);
  const [xato, setXato] = useState<string | null>(null);

  useEffect(() => {
    let bekor = false;

    async function yukla() {
      try {
        setYuklanmoqda(true);
        setXato(null);
        // Eslatma: /products endpoint hali backendda yo'q (keyingi darsda
        // quriladi). Shu sabab bu yerda xato kutish normal holat.
        const data = await apiSoraq<Mahsulot[]>("/products", { auth: false });
        if (!bekor) setMahsulotlar(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!bekor) {
          setXato(
            err instanceof Error
              ? err.message
              : "Mahsulotlarni yuklashda xatolik yuz berdi",
          );
          setMahsulotlar([]);
        }
      } finally {
        if (!bekor) setYuklanmoqda(false);
      }
    }

    void yukla();
    return () => {
      bekor = true;
    };
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 p-4 pb-24 md:pb-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase">
            Marketplace
          </p>
          <h1 className="font-heading mt-1 text-2xl font-semibold">Sotib olish</h1>
        </div>
        <Link
          href="/"
          className="border-input bg-background hover:bg-accent rounded-xl border px-4 py-2 text-sm font-medium"
        >
          Orqaga
        </Link>
      </div>

      {yuklanmoqda ? (
        <div className="border-input rounded-2xl border p-6 text-sm">
          Mahsulotlar yuklanmoqda...
        </div>
      ) : xato ? (
        <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-2xl border p-6 text-sm">
          {xato}
        </div>
      ) : mahsulotlar.length === 0 ? (
        <div className="border-input rounded-2xl border p-8 text-center text-sm">
          Hozircha mahsulotlar mavjud emas. Mahsulotlar backendga
          qo&apos;shilgach, ular bu sahifada paydo bo&apos;ladi.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {mahsulotlar.map((mahsulot) => (
            <article
              key={mahsulot.id}
              className="border-input bg-card rounded-2xl border p-4"
            >
              <div className="h-44 rounded-xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900" />
              <div className="mt-4 flex items-center justify-between">
                <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium">
                  {mahsulot.status ?? "Barchasi"}
                </span>
                <span className="text-muted-foreground text-sm">
                  #{mahsulot.id}
                </span>
              </div>
              <h2 className="mt-4 text-xl font-semibold">{mahsulot.nomi}</h2>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-lg font-bold">
                  {mahsulot.narx.toLocaleString("uz-UZ")} so&apos;m
                </span>
                <button className="bg-primary text-primary-foreground rounded-xl px-3 py-2 text-sm font-semibold">
                  Sotib olish
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <nav className="mobile-nav md:hidden">
        <Link href="/mahsulotlar">⌂<span>Bosh sahifa</span></Link>
        <Link href="/buy" className="active">◫<span>Sotib olish</span></Link>
        <Link href="/profile">◎<span>Profil</span></Link>
      </nav>
    </main>
  );
}
