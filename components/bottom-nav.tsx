"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/components/auth-provider";

export function BottomNav() {
  const pathname = usePathname();
  const { profil } = useAuth();

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return null;
  }

  const items: { href: string; icon: string; nom: string }[] = [
    { href: "/mahsulotlar", icon: "\u2302", nom: "Bosh sahifa" },
    { href: "/kategoriyalar", icon: "\u25A6", nom: "Kategoriyalar" },
  ];
  if (profil?.role === "seller" || profil?.role === "admin") {
    items.push({ href: "/seller/mahsulotlar", icon: "\u25A3", nom: "Mahsulotlarim" });
  }
  if (profil?.role === "admin") {
    items.push({ href: "/admin/kategoriyalar", icon: "\u2699", nom: "Admin" });
  }
  items.push(
    profil
      ? { href: "/profile", icon: "\u25CE", nom: "Profil" }
      : { href: "/login", icon: "\u25CE", nom: "Kirish" },
  );

  return (
    <nav className="mobile-nav md:hidden">
      {items.map((i) => (
        <Link
          key={i.href}
          href={i.href}
          className={pathname === i.href || pathname.startsWith(i.href + "/") ? "active" : ""}
        >
          {i.icon}
          <span>{i.nom}</span>
        </Link>
      ))}
    </nav>
  );
}