"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

import { Himoyalangan } from "@/components/protected";
import {
  MatnMaydon,
  Maydon,
  Tugma,
  XatoQutisi,
  Yuklanmoqda,
} from "@/components/form-ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  categoryArxivla,
  categoryRoyxat,
  categoryTikla,
  categoryYangila,
  categoryYarat,
  type Category,
} from "@/lib/category-api";

export default function AdminKategoriyalarSahifa() {
  return (
    <Himoyalangan rollar={["admin"]}>
      <AdminIchki />
    </Himoyalangan>
  );
}

interface FormaHolat {
  nom: string;
  tavsif: string;
  tartib: string;
}

const BOSH_FORMA: FormaHolat = { nom: "", tavsif: "", tartib: "0" };

function AdminIchki() {
  const [royxat, setRoyxat] = useState<Category[] | null>(null);
  const [arxivniKorsat, setArxivniKorsat] = useState(false);
  const [xato, setXato] = useState<string | null>(null);

  const [forma, setForma] = useState<FormaHolat>(BOSH_FORMA);
  const [tahrirId, setTahrirId] = useState<number | null>(null);
  const [yuborilmoqda, setYuborilmoqda] = useState(false);
  const [ochirilayotgan, setOchirilayotgan] = useState<number | null>(null);

  // `versiya` — "ro'yxatni qayta yukla" tugmasi vazifasini bajaradi.
  // O'zgartirish (qo'shish, tahrirlash, arxivlash) tugagach uni bittaga
  // oshiramiz, effekt esa qaytadan ishga tushadi. Shu tufayli yuklash
  // mantig'i bitta joyda qoladi.
  const [versiya, setVersiya] = useState(0);
  const qaytaYukla = useCallback(() => setVersiya((v) => v + 1), []);

  useEffect(() => {
    let bekor = false;
    categoryRoyxat(!arxivniKorsat).then(
      (malumot) => {
        if (bekor) return;
        setRoyxat(malumot);
        setXato(null);
      },
      (err: unknown) => {
        if (bekor) return;
        setXato(err instanceof Error ? err.message : "Yuklashda xatolik");
        setRoyxat([]);
      },
    );
    return () => {
      bekor = true;
    };
  }, [arxivniKorsat, versiya]);

  function tahrirniBoshla(k: Category) {
    setTahrirId(k.id);
    setForma({
      nom: k.nom,
      tavsif: k.tavsif ?? "",
      tartib: String(k.tartib),
    });
    setXato(null);
    // Forma sahifaning tepasida — foydalanuvchi uni ko'rishi kerak.
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
    setYuborilmoqda(true);

    // Bo'sh matn — bu "tavsif yo'q" degani, bo'sh satr emas.
    const tanasi = {
      nom: forma.nom.trim(),
      tavsif: forma.tavsif.trim() || null,
      tartib: Number(forma.tartib) || 0,
    };

    try {
      if (tahrirId === null) {
        await categoryYarat(tanasi);
      } else {
        await categoryYangila(tahrirId, tanasi);
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
      await categoryArxivla(id);
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
      await categoryTikla(id);
      qaytaYukla();
    } catch (err) {
      setXato(err instanceof Error ? err.message : "Tiklashda xatolik");
    }
  }

  if (royxat === null) return <Yuklanmoqda />;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 p-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold">
          Kategoriyalarni boshqarish
        </h1>
        <p className="text-muted-foreground text-sm">Admin paneli</p>
      </div>

      {/* --- forma: yaratish yoki tahrirlash --- */}
      <Card>
        <CardHeader>
          <CardTitle>
            {tahrirId === null ? "Yangi kategoriya" : "Tahrirlash"}
          </CardTitle>
          <CardDescription>
            Manzildagi nom (slug) nomdan avtomatik yasaladi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={yubor} className="grid gap-3">
            <Maydon
              id="nom"
              yorliq="Nom"
              required
              minLength={2}
              maxLength={100}
              placeholder="Maishiy texnika"
              value={forma.nom}
              onChange={(e) => setForma({ ...forma, nom: e.target.value })}
            />
            <MatnMaydon
              id="tavsif"
              yorliq="Tavsif"
              maxLength={2000}
              placeholder="Muzlatgich, kir yuvish mashinasi va boshqalar"
              value={forma.tavsif}
              onChange={(e) => setForma({ ...forma, tavsif: e.target.value })}
            />
            <Maydon
              id="tartib"
              yorliq="Tartib (kichik raqam — yuqorida)"
              type="number"
              min={0}
              max={9999}
              value={forma.tartib}
              onChange={(e) => setForma({ ...forma, tartib: e.target.value })}
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

      {/* --- ro'yxat --- */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="size-4"
          checked={arxivniKorsat}
          onChange={(e) => setArxivniKorsat(e.target.checked)}
        />
        Arxivlanganlarni ham ko&apos;rsatish
      </label>

      {royxat.length === 0 ? (
        <p className="text-muted-foreground text-sm">Hozircha bo&apos;sh.</p>
      ) : null}

      <div className="grid gap-3">
        {royxat.map((k) => (
          <Card key={k.id} size="sm" className={k.faol ? "" : "opacity-60"}>
            <CardHeader>
              <CardTitle>
                {k.nom}
                {!k.faol ? (
                  <span className="text-muted-foreground ml-2 text-xs font-normal">
                    (arxivda)
                  </span>
                ) : null}
              </CardTitle>
              <CardDescription>
                <span className="font-mono">/{k.slug}</span> · tartib {k.tartib}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              {k.tavsif ? (
                <p className="text-muted-foreground text-sm">{k.tavsif}</p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <Tugma
                  variant="ikkilamchi"
                  className="w-auto px-3"
                  onClick={() => tahrirniBoshla(k)}
                >
                  Tahrirlash
                </Tugma>

                {k.faol ? (
                  ochirilayotgan === k.id ? (
                    <>
                      <Tugma
                        className="w-auto px-3"
                        onClick={() => arxivla(k.id)}
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
                      onClick={() => setOchirilayotgan(k.id)}
                    >
                      Arxivlash
                    </Tugma>
                  )
                ) : (
                  <Tugma
                    variant="ikkilamchi"
                    className="w-auto px-3"
                    onClick={() => tikla(k.id)}
                  >
                    Tiklash
                  </Tugma>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}