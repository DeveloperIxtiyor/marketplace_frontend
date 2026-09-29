"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { Tugma, XatoQutisi, Yuklanmoqda } from "@/components/form-ui";
import { ProductCard } from "@/components/product-card";
import { categoryRoyxat, type Category } from "@/lib/category-api";
import { productRoyxat, type Product } from "@/lib/product-api";

export default function MahsulotlarSahifa() {
  return (
    <Suspense fallback={<Yuklanmoqda />}>
      <Katalog />
    </Suspense>
  );
}

function Katalog() {
  const searchParams = useSearchParams();
  const boshlangichSlug = searchParams.get("kategoriya");

  const [kategoriyalar, setKategoriyalar] = useState<Category[] | null>(null);
  const [tanlangan, setTanlangan] = useState<number | null>(null);
  const [xato, setXato] = useState<string | null>(null);

  const [natija, setNatija] = useState<{
    catId: number | null;
    royxat: Product[];
  } | null>(null);

  const yuklanmoqda = natija === null || natija.catId !== tanlangan;
  const mahsulotlar = natija?.royxat ?? [];

  useEffect(() => {
    let bekor = false;
    categoryRoyxat().then(
      (royxat) => {
        if (bekor) return;
        setKategoriyalar(royxat);
        if (boshlangichSlug) {
          const topilgan = royxat.find((k) => k.slug === boshlangichSlug);
          if (topilgan) setTanlangan(topilgan.id);
        }
      },
      () => {
        if (!bekor) setKategoriyalar([]);
      },
    );
    return () => {
      bekor = true;
    };
  }, [boshlangichSlug]);

  useEffect(() => {
    let bekor = false;
    productRoyxat(tanlangan ?? undefined).then(
      (royxat) => {
        if (bekor) return;
        setNatija({ catId: tanlangan, royxat });
        setXato(null);
      },
      (err: unknown) => {
        if (bekor) return;
        setXato(err instanceof Error ? err.message : "Yuklashda xatolik");
        setNatija({ catId: tanlangan, royxat: [] });
      },
    );
    return () => {
      bekor = true;
    };
  }, [tanlangan]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 p-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Mahsulotlar</h1>
        <p className="text-muted-foreground text-sm">
          {yuklanmoqda ? "yuklanmoqda..." : `${mahsulotlar.length} ta`}
        </p>
      </div>

      {kategoriyalar && kategoriyalar.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          <Chip faol={tanlangan === null} onClick={() => setTanlangan(null)}>
            Hammasi
          </Chip>
          {kategoriyalar.map((k) => (
            <Chip
              key={k.id}
              faol={tanlangan === k.id}
              onClick={() => setTanlangan(k.id)}
            >
              {k.nom}
            </Chip>
          ))}
        </div>
      ) : null}

      <XatoQutisi>{xato}</XatoQutisi>

      {yuklanmoqda ? (
        <Yuklanmoqda />
      ) : mahsulotlar.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          {tanlangan === null
            ? "Hozircha mahsulotlar yo'q."
            : "Bu bo'limda hozircha mahsulot yo'q."}
        </p>
      ) : (
        <div className="grid gap-3">
          {mahsulotlar.map((m) => (
            <ProductCard key={m.id} mahsulot={m} />
          ))}
        </div>
      )}
    </main>
  );
}

function Chip({
  children,
  faol,
  onClick,
}: {
  children: React.ReactNode;
  faol: boolean;
  onClick: () => void;
}) {
  return (
    <Tugma
      variant={faol ? "asosiy" : "ikkilamchi"}
      className="h-8 w-auto px-3 text-xs"
      onClick={onClick}
    >
      {children}
    </Tugma>
  );
}