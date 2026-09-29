"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth-provider";
import { Tugma, XatoQutisi, Yuklanmoqda } from "@/components/form-ui";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { categoryRoyxat, type Category } from "@/lib/category-api";

export default function KategoriyalarSahifa() {
  const { profil } = useAuth();
  const [royxat, setRoyxat] = useState<Category[] | null>(null);
  const [xato, setXato] = useState<string | null>(null);

  useEffect(() => {
    let bekor = false;
    categoryRoyxat().then(
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
  }, []);

  if (royxat === null) return <Yuklanmoqda />;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Kategoriyalar</h1>
          <p className="text-muted-foreground text-sm">
            {royxat.length} ta bo&apos;lim
          </p>
        </div>
        {profil?.role === "admin" ? (
          <Link href="/admin/kategoriyalar" className="w-auto shrink-0">
            <Tugma variant="ikkilamchi" className="w-auto px-3">
              Boshqarish
            </Tugma>
          </Link>
        ) : null}
      </div>

      <XatoQutisi>{xato}</XatoQutisi>

      {royxat.length === 0 && !xato ? (
        <p className="text-muted-foreground text-sm">
          Hozircha bo&apos;limlar yo&apos;q.
        </p>
      ) : null}

      <div className="grid gap-3">
        {royxat.map((k) => (
          <Card key={k.id}>
            <CardHeader>
              <CardTitle>{k.nom}</CardTitle>
              <CardDescription>
                {k.tavsif ?? <span className="font-mono">/{k.slug}</span>}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </main>
  );
}