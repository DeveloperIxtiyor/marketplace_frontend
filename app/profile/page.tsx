"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Himoyalangan } from "@/components/protected";
import { useAuth } from "@/components/auth-provider";
import { Maydon, Tugma, XatoQutisi } from "@/components/form-ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { parolniOzgartir } from "@/lib/auth-api";

export default function ProfilSahifa() {
  return (
    <Himoyalangan>
      <ProfilIchki />
    </Himoyalangan>
  );
}

function ProfilIchki() {
  const { profil, chiqish } = useAuth();
  const router = useRouter();

  const [eskiParol, setEskiParol] = useState("");
  const [yangiParol, setYangiParol] = useState("");
  const [parolXato, setParolXato] = useState<string | null>(null);
  const [yuborilmoqda, setYuborilmoqda] = useState(false);

  if (!profil) return null;

  async function chiqishBos() {
    await chiqish();
    router.replace("/login");
  }

  async function parolYubor(e: FormEvent) {
    e.preventDefault();
    setParolXato(null);
    setYuborilmoqda(true);
    try {
      await parolniOzgartir({ eski_parol: eskiParol, yangi_parol: yangiParol });
      // Backend parol almashgach barcha tokenlarni bekor qiladi —
      // shuning uchun o'zimiz chiqib, login sahifasiga o'tamiz.
      await chiqish();
      router.replace("/login");
    } catch (err) {
      setParolXato(err instanceof Error ? err.message : "Xatolik");
    } finally {
      setYuborilmoqda(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold">{profil.ism}</h1>
          <p className="text-muted-foreground text-sm">
            Rolingiz: <span className="font-mono">{profil.role}</span>
          </p>
        </div>
        <Tugma variant="ikkilamchi" className="w-auto px-3" onClick={chiqishBos}>
          Chiqish
        </Tugma>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ma&apos;lumotlar</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>{profil.email ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Telefon</span>
            <span>{profil.telefon ?? "—"}</span>
          </div>
          {profil.auth_provider === "telegram" ? (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Telegram</span>
              <span>@{profil.telegram_username ?? profil.telegram_id}</span>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Telegram orqali kirgan foydalanuvchida parol yo'q — forma faqat
          web orqali kirganlar uchun ko'rsatiladi. */}
      {profil.auth_provider === "web" ? (
        <Card>
          <CardHeader>
            <CardTitle>Parolni almashtirish</CardTitle>
            <CardDescription>
              Almashtirgach, qayta kirishingiz kerak bo&apos;ladi.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={parolYubor} className="grid gap-3">
              <Maydon
                id="eski-parol"
                yorliq="Eski parol"
                type="password"
                autoComplete="current-password"
                required
                value={eskiParol}
                onChange={(e) => setEskiParol(e.target.value)}
              />
              <Maydon
                id="yangi-parol"
                yorliq="Yangi parol"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={yangiParol}
                onChange={(e) => setYangiParol(e.target.value)}
              />
              <XatoQutisi>{parolXato}</XatoQutisi>
              <Tugma type="submit" disabled={yuborilmoqda}>
                {yuborilmoqda ? "Saqlanmoqda..." : "Almashtirish"}
              </Tugma>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <nav className="mobile-nav md:hidden">
        <Link href="/mahsulotlar">⌂<span>Bosh sahifa</span></Link>
        <Link href="/buy">◫<span>Sotib olish</span></Link>
        <Link href="/profile" className="active">◎<span>Profil</span></Link>
      </nav>
    </main>
  );
}
