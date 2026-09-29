"use client";


import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAuth } from "@/components/auth-provider";
import { Yuklanmoqda } from "@/components/form-ui";
import type { Rol } from "@/lib/auth-api";

export function Himoyalangan({
  children,
  rollar,
}: {
  children: ReactNode;
  /** Berilmasa — kirgan har kim ko'radi. */
  rollar?: Rol[];
}) {
  const { holat, profil } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (holat === "chiqgan") router.replace("/login");
  }, [holat, router]);

  if (holat !== "kirgan" || !profil) return <Yuklanmoqda />;

  // MUHIM: bu — UI himoyasi, xavfsizlik emas. Haqiqiy himoya backendda
  // (`Depends(role_talab_qil(...))`). Bu yer shunchaki foydalanuvchiga
  // ishlamaydigan tugmalarni ko'rsatmaslik uchun.
  if (rollar && !rollar.includes(profil.role)) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-2 p-4 text-center">
        <h1 className="font-heading text-xl font-semibold">Ruxsat yo&apos;q</h1>
        <p className="text-muted-foreground text-sm">
          Bu sahifa {rollar.join(" yoki ")} roli uchun. Sizning rolingiz:{" "}
          <span className="font-mono">{profil.role}</span>.
        </p>
      </main>
    );
  }

  return <>{children}</>;
}