"use client";

/**
 * Sotuvchi paneli uchun rasm boshqaruvi: yuklash, asosiy qilish, o'chirish.
 *
 * Alohida komponent — chunki seller sahifasi allaqachon katta, va bu
 * mantiq o'z holatiga ega (yuklanmoqda, xato, o'chirish tasdiqlash).
 *
 * `<input type="file">` ni `sr-only` bilan yashirib, o'z tugmamizdan
 * `input.click()` chaqiramiz. Sababi: brauzerning tug'ma "Choose File"
 * tugmasini stillash mumkin emas, u har brauzerda boshqacha ko'rinadi.
 * `display: none` EMAS, `sr-only`: yashirilgan input ekran o'quvchilar
 * uchun ham, forma validatsiyasi uchun ham mavjud bo'lib qoladi.
 */

import { useRef, useState } from "react";

import { Tugma, XatoQutisi } from "@/components/form-ui";
import { faylniTekshir, MAX_RASM_MB, mediaUrl } from "@/lib/media";
import {
  rasmAsosiyQil,
  rasmOchir,
  rasmYukla,
  type Product,
} from "@/lib/product-api";

export function RasmBoshqaruv({
  mahsulot,
  ozgardi,
}: {
  mahsulot: Product;
  /** Rasm o'zgargach ro'yxatni qayta yuklash uchun. */
  ozgardi: () => void;
}) {
  const [xato, setXato] = useState<string | null>(null);
  const [yuklanmoqda, setYuklanmoqda] = useState(false);
  const [band, setBand] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const inputId = `rasm-${mahsulot.id}`;

  async function fayllarniYukla(fayllar: FileList) {
    setXato(null);
    setYuklanmoqda(true);
    try {
      // Ketma-ket yuklaymiz, `Promise.all` bilan BARAVAR emas:
      //   1) tartib saqlanadi (birinchi tanlangan — birinchi rasm);
      //   2) `asosiy` ni kim oladi degan poyga yuzaga kelmaydi;
      //   3) 8 ta rasmni mobil internetdan baravar yuklash sekinroq.
      for (const fayl of Array.from(fayllar)) {
        const nosozlik = faylniTekshir(fayl);
        if (nosozlik) throw new Error(`${fayl.name}: ${nosozlik}`);
        await rasmYukla(mahsulot.id, fayl);
      }
      ozgardi();
    } catch (err) {
      setXato(err instanceof Error ? err.message : "Yuklashda xatolik");
      // Bir qismi yuklangan bo'lishi mumkin — ro'yxatni baribir yangilaymiz.
      ozgardi();
    } finally {
      setYuklanmoqda(false);
      // Inputni bo'shatamiz: aks holda bir xil faylni qayta tanlaganda
      // `onChange` ishlamaydi (qiymat o'zgarmagan hisoblanadi).
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function asosiyQil(rasmId: number) {
    setXato(null);
    setBand(rasmId);
    try {
      await rasmAsosiyQil(mahsulot.id, rasmId);
      ozgardi();
    } catch (err) {
      setXato(err instanceof Error ? err.message : "Xatolik");
    } finally {
      setBand(null);
    }
  }

  async function ochir(rasmId: number) {
    setXato(null);
    setBand(rasmId);
    try {
      await rasmOchir(mahsulot.id, rasmId);
      ozgardi();
    } catch (err) {
      setXato(err instanceof Error ? err.message : "O'chirishda xatolik");
    } finally {
      setBand(null);
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          // `accept` — fayl tanlash oynasida faqat rasmlarni ko'rsatadi.
          // Bu ham qulaylik, himoya emas: foydalanuvchi "Barcha fayllar" ni
          // tanlab, istalgan narsani yuborishi mumkin.
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files;
            if (f && f.length) void fayllarniYukla(f);
          }}
        />
        <Tugma
          type="button"
          variant="ikkilamchi"
          className="w-auto px-3"
          disabled={yuklanmoqda}
          onClick={() => inputRef.current?.click()}
        >
          {yuklanmoqda ? "Yuklanmoqda..." : "Rasm qo'shish"}
        </Tugma>
        <span className="text-muted-foreground text-xs">
          {mahsulot.rasmlar.length} ta · JPEG/PNG/WebP · {MAX_RASM_MB} MB gacha
        </span>
      </div>

      <XatoQutisi>{xato}</XatoQutisi>

      {mahsulot.rasmlar.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {mahsulot.rasmlar.map((r) => (
            <div key={r.id} className="w-20 shrink-0 grid gap-1">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(r.thumb_url)}
                  alt=""
                  width={80}
                  height={80}
                  loading="lazy"
                  className={
                    "size-20 rounded-md object-cover " +
                    (r.asosiy ? "ring-primary ring-2" : "")
                  }
                />
                {r.asosiy ? (
                  <span className="bg-primary text-primary-foreground absolute bottom-0 left-0 rounded-br-md rounded-tl-md px-1 text-[10px]">
                    asosiy
                  </span>
                ) : null}
              </div>

              {!r.asosiy ? (
                <button
                  type="button"
                  disabled={band === r.id}
                  onClick={() => void asosiyQil(r.id)}
                  className="text-muted-foreground text-[11px] hover:underline"
                >
                  asosiy qilish
                </button>
              ) : (
                <span className="text-[11px] text-transparent select-none">·</span>
              )}

              <button
                type="button"
                disabled={band === r.id}
                onClick={() => void ochir(r.id)}
                className="text-destructive text-[11px] hover:underline"
              >
                o&apos;chirish
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-xs">
          Rasmsiz mahsulot katalogda kam bosiladi — kamida bitta rasm
          qo&apos;shing.
        </p>
      )}
    </div>
  );
}