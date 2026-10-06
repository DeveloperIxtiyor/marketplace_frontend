"use client";

/**
 * Rasm galereyasi — mahsulot sahifasida.
 *
 * Katta rasm + pastda thumbnail qatori. Thumbnail bosilsa katta rasm
 * o'zgaradi.
 *
 * E'tibor bering: tanlangan rasm `useEffect` BILAN tiklanmaydi. Faqat
 * indeks saqlanadi va chizishda chegaraga kiritiladi (`Math.min`).
 * Agar `useEffect` ichida `setTanlangan(0)` yozsak:
 *   1) ortiqcha qayta chizish bo'lardi;
 *   2) ESLint `react-hooks/set-state-in-effect` qoidasi xato bergan edi
 *      (03- va 04-darslarda shu bilan to'qnashganmiz).
 * Qoida: holatni effektda tuzatish o'rniga, chizishda hisoblash.
 */

import { useState } from "react";

import { mediaUrl } from "@/lib/media";
import type { Rasm } from "@/lib/product-api";

export function RasmGalereya({
  rasmlar,
  alt,
}: {
  rasmlar: Rasm[];
  alt: string;
}) {
  const [tanlangan, setTanlangan] = useState(0);

  if (rasmlar.length === 0) {
    return (
      <div className="bg-muted text-muted-foreground flex h-56 items-center justify-center text-sm">
        Rasm yo&apos;q
      </div>
    );
  }

  const indeks = Math.min(tanlangan, rasmlar.length - 1);
  const faol = rasmlar[indeks];

  return (
    <div className="grid gap-2">
      <div className="bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaUrl(faol.url)}
          alt={alt}
          width={faol.kenglik}
          height={faol.balandlik}
          className="max-h-80 w-full object-contain"
        />
      </div>

      {rasmlar.length > 1 ? (
        // `overflow-x-auto` — telefonda rasm 8 ta bo'lsa, qator surilib
        // ketadi, sahifani buzmaydi.
        <div className="flex gap-2 overflow-x-auto pb-1">
          {rasmlar.map((r, i) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setTanlangan(i)}
              aria-label={`${i + 1}-rasm`}
              aria-current={i === indeks}
              className={
                "shrink-0 overflow-hidden rounded-md border-2 " +
                (i === indeks ? "border-primary" : "border-transparent")
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaUrl(r.thumb_url)}
                alt=""
                width={64}
                height={64}
                loading="lazy"
                className="size-16 object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}