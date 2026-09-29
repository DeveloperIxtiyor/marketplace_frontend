import { type ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Maydon({
  yorliq,
  id,
  className,
  ...props
}: ComponentProps<"input"> & { yorliq: string; id: string }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {yorliq}
      </label>
      <input
        id={id}
        className={cn(
          "border-input bg-background h-10 w-full rounded-md border px-3 text-sm",
          "placeholder:text-muted-foreground",
          "focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none",
          className,
        )}
        {...props}
      />
    </div>
  );
}

const TUGMA_VARIANT = {
  asosiy:
    "bg-primary text-primary-foreground hover:bg-primary/90",
  ikkilamchi:
    "border-input bg-background hover:bg-accent hover:text-accent-foreground border",
} as const;

export function Tugma({
  variant = "asosiy",
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: keyof typeof TUGMA_VARIANT }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-10 w-full items-center justify-center rounded-md px-4 text-sm font-medium transition-colors",
        "disabled:pointer-events-none disabled:opacity-50",
        TUGMA_VARIANT[variant],
        className,
      )}
      {...props}
    />
  );
}

export function XatoQutisi({ children }: { children?: string | null }) {
  if (!children) return null;
  return (
    <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm">
      {children}
    </div>
  );
}

export function Yuklanmoqda() {
  return (
    <main className="flex w-full flex-1 items-center justify-center p-8">
      <div
        className="border-muted-foreground/30 border-t-foreground size-6 animate-spin rounded-full border-2"
        role="status"
        aria-label="Yuklanmoqda"
      />
    </main>
  );
}

export function MatnMaydon({
  yorliq,
  id,
  className,
  ...props
}: ComponentProps<"textarea"> & { yorliq: string; id: string }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {yorliq}
      </label>
      <textarea
        id={id}
        rows={3}
        className={cn(
          "border-input bg-background w-full resize-y rounded-md border px-3 py-2 text-sm",
          "placeholder:text-muted-foreground",
          "focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none",
          className,
        )}
        {...props}
      />
    </div>
  );
}