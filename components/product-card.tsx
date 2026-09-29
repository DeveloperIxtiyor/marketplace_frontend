"use client";

/**
 * Mahsulot kartochkasi — katalogda va seller panelida ishlatiladi.
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
import type { Product } from "@/lib/product-api";

export function ProductCard({
  mahsulot,
  amallar,
}: {
  mahsulot: Product;
  /** Seller panelida tugmalar uzatiladi; katalogda hech narsa. */
  amallar?: ReactNode;
}) {
  const tugagan = mahsulot.zaxira <= 0;

  return (
    <Card size="sm" className={mahsulot.faol ? "" : "opacity-60"}>
      {mahsulot.rasm_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mahsulot.rasm_url}
          alt={mahsulot.nom}
          className="h-40 w-full object-cover"
        />
      ) : null}

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