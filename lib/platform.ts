import { telegramIchidami } from "@/lib/telegram";

export type Platforma = "telegram" | "web";

export function platformaniAniqla(): Platforma {
  return telegramIchidami() ? "telegram" : "web";
}
