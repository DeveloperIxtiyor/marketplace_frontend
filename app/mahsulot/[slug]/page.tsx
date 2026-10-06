"use client";

/**
 * Bitta mahsulot sahifasi — dinamik marshrut: /mahsulot/iphone-15-pro
 *
 * Next.js 16 da `params` — **Promise**. Client komponentda uni React'ning
 * `use()` hook'i bilan ochamiz (server komponentda `await` bo'lardi).
 * Next.js 14 va undan oldin u oddiy obyekt edi — internetdagi ko'p
 * misollarda hali ham shunday yozilgan.
 */

import Link from "next/link";
import { use, useEffect, useState } from "react";

import { useAuth } from "@/components/auth-provider";
import { Tugma, XatoQutisi, Yuklanmoqda } from "@/components/form-ui";
import { RasmGalereya } from "@/components/rasm-galereya";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { narxFormat, sanaFormat, zaxiraMatni } from "@/lib/format";
import { productSlugOrqali, type Product } from "@/lib/product-api";

export default function MahsulotSahifa({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { profil } = useAuth();

  const [mahsulot, setMahsulot] = useState<Product | null>(null);
  const [xato, setXato] = useState<string | null>(null);

  useEffect(() => {
    let bekor = false;
    productSlugOrqali(slug).then(
      (m) => {
        if (bekor) return;
        setMahsulot(m);
        setXato(null);
      },
      (err: unknown) => {
        if (bekor) return;
        setXato(err instanceof Error ? err.message : "Mahsulot topilmadi");
      },
    );
    return () => {
      bekor = true;
    };
  }, [slug]);

  if (xato) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-3 p-4">
        <XatoQutisi>{xato}</XatoQutisi>
        <Link href="/mahsulotlar">
          <Tugma variant="ikkilamchi">Katalogga qaytish</Tugma>
        </Link>
      </main>
    );
  }

  if (!mahsulot) return <Yuklanmoqda />;

  // Mahsulot menikimi? Bu — faqat "Tahrirlash" tugmasini ko'rsatish uchun.
  // Haqiqiy tekshiruv backendda (`egalikni_tekshir`).
  const meniki =
    profil !== null &&
    (profil.id === mahsulot.egasi.id || profil.role === "admin");

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 p-4">
      <Link
        href={`/mahsulotlar?kategoriya=${mahsulot.kategoriya.slug}`}
        className="text-muted-foreground text-sm hover:underline"
      >
        ← {mahsulot.kategoriya.nom}
      </Link>

      <Card>
        {/* Bu yerda `object-contain` ishlatiladi (kartochkada `object-cover`
            edi): mahsulot sahifasida rasm to'liq ko'rinishi kerak, chetlari
            kesilmasin. Kartochkada esa bir xil balandlik muhimroq. */}
        <RasmGalereya rasmlar={mahsulot.rasmlar} alt={mahsulot.nom} />

        <CardHeader>
          <CardTitle>{mahsulot.nom}</CardTitle>
          <CardDescription>
            Sotuvchi: {mahsulot.egasi.ism} · {sanaFormat(mahsulot.yaratilgan_vaqt)}
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-3">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-heading text-2xl font-semibold">
              {narxFormat(mahsulot.narx)}
            </span>
            <span
              className={
                mahsulot.zaxira <= 0
                  ? "text-destructive text-sm"
                  : "text-muted-foreground text-sm"
              }
            >
              {zaxiraMatni(mahsulot.zaxira)}
            </span>
          </div>

          {mahsulot.tavsif ? (
            <p className="text-sm whitespace-pre-line">{mahsulot.tavsif}</p>
          ) : (
            <p className="text-muted-foreground text-sm">Tavsif yo&apos;q.</p>
          )}

          {/* Savatga qo'shish keyingi darsda — hozircha o'chiq tugma. */}
          <Tugma disabled title="Savat keyingi darsda">
            Savatga qo&apos;shish
          </Tugma>

          {meniki ? (
            <Link href="/seller/mahsulotlar">
              <Tugma variant="ikkilamchi">Mahsulotlarimni boshqarish</Tugma>
            </Link>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}