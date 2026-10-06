"use client";

/**
 * Mahsulot kartochkasi — katalogda va seller panelida ishlatiladi.
 *
 * Alohida komponent qilishning sababi: bir xil ko'rinish ikki joyda kerak.
 * Nusxa ko'chirsak, birini o'zgartirib ikkinchisini unutish kafolatlangan.
 */

import Link from "next/link";
import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { narxFormat, zaxiraMatni } from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import { asosiyRasm, type Product } from "@/lib/product-api";

export function ProductCard({
  mahsulot,
  amallar,
}: {
  mahsulot: Product;
  /** Seller panelida tugmalar uzatiladi; katalogda hech narsa. */
  amallar?: ReactNode;
}) {
  const tugagan = mahsulot.zaxira <= 0;
  // Katalogda THUMB ko'rsatiladi (400px, ~20 KB), kattasi emas.
  // 20 ta mahsulot = 20 ta rasm: 1600px'larni yuklasak, sahifa 10 MB bo'lardi.
  const rasm = asosiyRasm(mahsulot);
  const qoshimcha = mahsulot.rasmlar.length - 1;

  return (
    <Card size="sm" className={mahsulot.faol ? "" : "opacity-60"}>
      <div className="bg-muted relative h-40 w-full overflow-hidden">
        {rasm ? (
          // next/image emas, oddiy img: next/image tashqi domenlar
          // ro'yxatini talab qiladi (next.config.ts -> images.remotePatterns),
          // bizning backend manzili esa ngrok/vercel bilan o'zgarib turadi.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl(rasm.thumb_url)}
            alt={mahsulot.nom}
            // width/height — backend bergan o'lchamlar. Busiz rasm
            // yuklanganda sahifa "sakrab" ketadi (layout shift).
            width={rasm.kenglik}
            height={rasm.balandlik}
            loading="lazy"
            className="h-40 w-full object-cover"
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
            Rasm yo&apos;q
          </div>
        )}

        {qoshimcha > 0 ? (
          <span className="bg-background/80 absolute right-2 bottom-2 rounded-md px-1.5 py-0.5 text-xs">
            +{qoshimcha}
          </span>
        ) : null}
      </div>

      <CardHeader>
        <CardTitle>
          <Link href={`/mahsulot/${mahsulot.slug}`} className="hover:underline">
            {mahsulot.nom}
          </Link>
          {!mahsulot.faol ? (
            <span className="text-muted-foreground ml-2 text-xs font-normal">
              (arxivda)
            </span>
          ) : null}
        </CardTitle>
        <CardDescription>
          {mahsulot.kategoriya.nom} · {mahsulot.egasi.ism}
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-2">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-heading text-lg font-semibold">
            {narxFormat(mahsulot.narx)}
          </span>
          <span
            className={
              tugagan ? "text-destructive text-xs" : "text-muted-foreground text-xs"
            }
          >
            {zaxiraMatni(mahsulot.zaxira)}
          </span>
        </div>
        {amallar}
      </CardContent>
    </Card>
  );
}