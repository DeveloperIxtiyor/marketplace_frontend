"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { initDataOl, miniAppniTayyorla, temaniQolla } from "@/lib/telegram";
import { platformaniAniqla, type Platforma } from "@/lib/platform";
import { tokenlarniSaqla, tokenlarniOchir } from "@/lib/api";
import {
  profilniOl,
  telegramLogin,
  login as apiLogin,
  royxatdanOtish as apiRoyxat,
  chiqish as apiChiqish,
  type Profil,
} from "@/lib/auth-api";

export type AuthHolat = "yuklanmoqda" | "kirgan" | "chiqgan";

interface AuthQiymat {
  holat: AuthHolat;
  profil: Profil | null;
  platforma: Platforma | null;
  xato: string | null;
  login: (email: string, parol: string) => Promise<void>;
  royxatdanOtish: (ism: string, email: string, parol: string) => Promise<void>;
  chiqish: () => Promise<void>;
  profilniYangilaHolat: (yangi: Profil) => void;
}

const AuthContext = createContext<AuthQiymat | null>(null);

export function useAuth(): AuthQiymat {
  const qiymat = useContext(AuthContext);
  if (!qiymat) {
    throw new Error("useAuth faqat <AuthProvider> ichida ishlaydi");
  }
  return qiymat;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [holat, setHolat] = useState<AuthHolat>("yuklanmoqda");
  const [profil, setProfil] = useState<Profil | null>(null);
  const [platforma, setPlatforma] = useState<Platforma | null>(null);
  const [xato, setXato] = useState<string | null>(null);

  // React 19 + Strict Mode da useEffect IKKI MARTA ishlaydi.
  // Bu bayroqsiz Telegram login so'rovi ikki marta ketadi.
  const bajarildi = useRef(false);

  useEffect(() => {
    if (bajarildi.current) return;
    bajarildi.current = true;

    const p = platformaniAniqla();
    setPlatforma(p);

    async function boshla() {
      if (p === "telegram") {
        miniAppniTayyorla();
        temaniQolla();
        const initData = initDataOl();
        if (initData) {
          try {
            tokenlarniSaqla(await telegramLogin(initData));
            setProfil(await profilniOl());
            setHolat("kirgan");
            return;
          } catch (e) {
            setXato(e instanceof Error ? e.message : "Telegram kirishda xato");
          }
        }
      }

      // Oddiy brauzer yoki Telegram login ishlamadi: saqlangan tokenni sinaymiz.
      try {
        setProfil(await profilniOl());
        setHolat("kirgan");
      } catch {
        tokenlarniOchir();
        setHolat("chiqgan");
      }
    }

    void boshla();
  }, []);

  const login = useCallback(async (email: string, parol: string) => {
    setXato(null);
    tokenlarniSaqla(await apiLogin({ email, parol }));
    setProfil(await profilniOl());
    setHolat("kirgan");
  }, []);

  const royxatdanOtish = useCallback(
    async (ism: string, email: string, parol: string) => {
      setXato(null);
      await apiRoyxat({ ism, email, parol });
      // Ro'yxatdan o'tish token bermaydi — darhol login qilamiz.
      tokenlarniSaqla(await apiLogin({ email, parol }));
      setProfil(await profilniOl());
      setHolat("kirgan");
    },
    [],
  );

  const chiqish = useCallback(async () => {
    try {
      await apiChiqish();
    } catch {
      // Token allaqachon yaroqsiz bo'lishi mumkin — baribir chiqaramiz.
    }
    tokenlarniOchir();
    setProfil(null);
    setHolat("chiqgan");
  }, []);

  const profilniYangilaHolat = useCallback((yangi: Profil) => {
    setProfil(yangi);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        holat,
        profil,
        platforma,
        xato,
        login,
        royxatdanOtish,
        chiqish,
        profilniYangilaHolat,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
