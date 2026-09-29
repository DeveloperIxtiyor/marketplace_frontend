"use client";

/**
 * Sotuvchi paneli: o'z mahsulotlarini boshqarish.
 */

import { useCallback, useEffect, useState, type FormEvent } from "react";

import {
  MatnMaydon,
  Maydon,
  Tugma,
  XatoQutisi,
  Yuklanmoqda,
} from "@/components/form-ui";
import { ProductCard } from "@/components/product-card";
import { Himoyalangan } from "@/components/protected";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { categoryRoyxat, type Category } from "@/lib/category-api";
import {
  meningMahsulotlarim,
  productArxivla,
  productTikla,
  productYangila,
  productYarat,
  type Product,
} from "@/lib/product-api";

export default function SellerMahsulotlarSahifa() {
  return (
    <Himoyalangan rollar={["seller", "admin"]}>
      <SellerIchki />
    </Himoyalangan>
  );
}

interface FormaHolat {
  nom: string;
  tavsif: string;
  narx: string;
  zaxira: string;
  rasm_url: string;
  category_id: string;
}

const BOSH_FORMA: FormaHolat = {
  nom: "",
  tavsif: "",
  narx: "",
  zaxira: "0",
  rasm_url: "",
  category_id: "",
};

function SellerIchki() {
  const [mahsulotlar, setMahsulotlar] = useState<Product[] | null>(null);
  const [kategoriyalar, setKategoriyalar] = useState<Category[]>([]);
  const [xato, setXato] = useState<string | null>(null);

  const [forma, setForma] = useState<FormaHolat>(BOSH_FORMA);
  const [tahrirId, setTahrirId] = useState<number | null>(null);
  const [yuborilmoqda, setYuborilmoqda] = useState(false);
  const [ochirilayotgan, setOchirilayotgan] = useState<number | null>(null);

  const [versiya, setVersiya] = useState(0);
  const qaytaYukla = useCallback(() => setVersiya((v) => v + 1), []);

  useEffect(() => {
    let bekor = false;
    categoryRoyxat().then(
      (royxat) => {
        if (!bekor) setKategoriyalar(royxat);
      },
      () => {
        if (!bekor) setKategoriyalar([]);
      },
    );
    return () => {
      bekor = true;
    };
  }, []);

  useEffect(() => {
    let bekor = false;
    meningMahsulotlarim().then(
      (royxat) => {
        if (bekor) return;
        setMahsulotlar(royxat);
        setXato(null);
      },
      (err: unknown) => {
        if (bekor) return;
        setXato(err instanceof Error ? err.message : "Yuklashda xatolik");
        setMahsulotlar([]);
      },
    );
    return () => {
      bekor = true;
    };
  }, [versiya]);

  function tahrirniBoshla(m: Product) {
    setTahrirId(m.id);
    setForma({
      nom: m.nom,
      tavsif: m.tavsif ?? "",
      narx: String(m.narx),
      zaxira: String(m.zaxira),
      rasm_url: m.rasm_url ?? "",
      category_id: String(m.kategoriya.id),
    });
    setXato(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function bekorQil() {
    setTahrirId(null);
    setForma(BOSH_FORMA);
    setXato(null);
  }

  async function yubor(e: FormEvent) {
    e.preventDefault();
    setXato(null);

    const categoryId = Number(forma.category_id);
    if (!categoryId) {
      setXato("Kategoriyani tanlang");
      return;
    }

    setYuborilmoqda(true);
    const tanasi = {
      nom: forma.nom.trim(),
      tavsif: forma.tavsif.trim() || null,
      narx: Number(forma.narx) || 0,
      zaxira: Number(forma.zaxira) || 0,
      rasm_url: forma.rasm_url.trim() || null,
      category_id: categoryId,
    };

    try {
      if (tahrirId === null) {
        await productYarat(tanasi);
      } else {
        await productYangila(tahrirId, tanasi);
      }
      bekorQil();
      qaytaYukla();
    } catch (err) {
      setXato(err instanceof Error ? err.message : "Saqlashda xatolik");
    } finally {
      setYuborilmoqda(false);
    }
  }

  async function arxivla(id: number) {
    setXato(null);
    try {
      await productArxivla(id);
      if (tahrirId === id) bekorQil();
      qaytaYukla();
    } catch (err) {
      setXato(err instanceof Error ? err.message : "Arxivlashda xatolik");
    } finally {
      setOchirilayotgan(null);
    }
  }

  async function tikla(id: number) {
    setXato(null);
    try {
      await productTikla(id);
      qaytaYukla();
    } catch (err) {
      setXato(err instanceof Error ? err.message : "Tiklashda xatolik");
    }
  }

  if (mahsulotlar === null) return <Yuklanmoqda />;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 p-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold">
          Mahsulotlarim
        </h1>
        <p className="text-muted-foreground text-sm">
          {mahsulotlar.length} ta (arxivlanganlari bilan)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {tahrirId === null ? "Yangi mahsulot" : "Tahrirlash"}
          </CardTitle>
          <CardDescription>Narx so&apos;mda, butun son.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={yubor} className="grid gap-3">
            <Maydon
              id="nom"
              yorliq="Nom"
              required
              minLength={2}
              maxLength={200}
              placeholder="iPhone 15 Pro 256GB"
              value={forma.nom}
              onChange={(e) => setForma({ ...forma, nom: e.target.value })}
            />

            <div className="grid gap-1.5">
              <label htmlFor="kategoriya" className="text-sm font-medium">
                Kategoriya
              </label>
              <select
                id="kategoriya"
                required
                className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none"
                value={forma.category_id}
                onChange={(e) =>
                  setForma({ ...forma, category_id: e.target.value })
                }
              >
                <option value="">— tanlang —</option>
                {kategoriyalar.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nom}
                  </option>
                ))}
              </select>
            </div>

            <Maydon
              id="narx"
              yorliq="Narx (so'm)"
              type="number"
              required
              min={1}
              placeholder="15000000"
              value={forma.narx}
              onChange={(e) => setForma({ ...forma, narx: e.target.value })}
            />
            <Maydon
              id="zaxira"
              yorliq="Zaxira (dona)"
              type="number"
              min={0}
              value={forma.zaxira}
              onChange={(e) => setForma({ ...forma, zaxira: e.target.value })}
            />
            <Maydon
              id="rasm_url"
              yorliq="Rasm havolasi"
              type="url"
              maxLength={500}
              placeholder="https://..."
              value={forma.rasm_url}
              onChange={(e) => setForma({ ...forma, rasm_url: e.target.value })}
            />
            <MatnMaydon
              id="tavsif"
              yorliq="Tavsif"
              maxLength={5000}
              value={forma.tavsif}
              onChange={(e) => setForma({ ...forma, tavsif: e.target.value })}
            />

            <XatoQutisi>{xato}</XatoQutisi>
            <div className="grid gap-2">
              <Tugma type="submit" disabled={yuborilmoqda}>
                {yuborilmoqda
                  ? "Saqlanmoqda..."
                  : tahrirId === null
                    ? "Qo'shish"
                    : "Saqlash"}
              </Tugma>
              {tahrirId !== null ? (
                <Tugma type="button" variant="ikkilamchi" onClick={bekorQil}>
                  Bekor qilish
                </Tugma>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      {mahsulotlar.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Hozircha mahsulotingiz yo&apos;q. Yuqoridagi forma bilan qo&apos;shing.
        </p>
      ) : null}

      <div className="grid gap-3">
        {mahsulotlar.map((m) => (
          <ProductCard
            key={m.id}
            mahsulot={m}
            amallar={
              <div className="flex flex-wrap gap-2">
                <Tugma
                  variant="ikkilamchi"
                  className="w-auto px-3"
                  onClick={() => tahrirniBoshla(m)}
                >
                  Tahrirlash
                </Tugma>

                {m.faol ? (
                  ochirilayotgan === m.id ? (
                    <>
                      <Tugma
                        className="w-auto px-3"
                        onClick={() => arxivla(m.id)}
                      >
                        Ha, arxivla
                      </Tugma>
                      <Tugma
                        variant="ikkilamchi"
                        className="w-auto px-3"
                        onClick={() => setOchirilayotgan(null)}
                      >
                        Yo&apos;q
                      </Tugma>
                    </>
                  ) : (
                    <Tugma
                      variant="ikkilamchi"
                      className="text-destructive w-auto px-3"
                      onClick={() => setOchirilayotgan(m.id)}
                    >
                      Arxivlash
                    </Tugma>
                  )
                ) : (
                  <Tugma
                    variant="ikkilamchi"
                    className="w-auto px-3"
                    onClick={() => tikla(m.id)}
                  >
                    Tiklash
                  </Tugma>
                )}
              </div>
            }
          />
        ))}
      </div>
    </main>
  );
}