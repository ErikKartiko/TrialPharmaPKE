import { useEffect, useRef, useState, type ReactNode } from "react";
import { Bookmark as BookmarkIcon, Check, ChevronDown, X } from "lucide-react";
import { cn } from "../utils/cn";
import { BOOKMARK_CATEGORIES } from "../types";
import type { Bookmark } from "../types";
import { uid } from "../lib/store";

/* ---------- Button ---------- */

export function Btn({
  children,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "teal";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <button
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-semibold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "md" && "px-4 py-2.5 text-sm",
        size === "lg" && "px-6 py-3.5 text-base",
        variant === "primary" &&
          "bg-navy-800 text-white shadow-lg shadow-navy-900/20 hover:bg-navy-700 dark:bg-clinical-600 dark:hover:bg-clinical-500 dark:text-navy-950 dark:shadow-clinical-900/30",
        variant === "teal" && "bg-clinical-600 text-white shadow-lg shadow-clinical-600/25 hover:bg-clinical-500",
        variant === "secondary" &&
          "border border-navy-200 bg-white text-navy-700 hover:border-navy-300 hover:bg-navy-50 dark:border-white/15 dark:bg-white/5 dark:text-navy-100 dark:hover:bg-white/10",
        variant === "ghost" && "text-navy-600 hover:bg-navy-100/70 dark:text-navy-200 dark:hover:bg-white/10",
        variant === "danger" && "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ---------- Card ---------- */

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("card-surface p-5 sm:p-6", className)}>{children}</div>;
}

/* ---------- Pill / Badge ---------- */

export function Pill({ children, tone = "navy", className }: { children: ReactNode; tone?: "navy" | "teal" | "amber" | "red" | "green" | "gray" | "violet"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide whitespace-nowrap",
        tone === "navy" && "bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-200",
        tone === "teal" && "bg-clinical-100 text-clinical-800 dark:bg-clinical-500/15 dark:text-clinical-300",
        tone === "amber" && "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
        tone === "red" && "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
        tone === "green" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
        tone === "gray" && "bg-slate-200/70 text-slate-600 dark:bg-white/10 dark:text-navy-200",
        tone === "violet" && "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
        className
      )}
    >
      {children}
    </span>
  );
}

/* ---------- Progress bar ---------- */

export function Progress({ value, className, barClass }: { value: number; className?: string; barClass?: string }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-navy-100 dark:bg-white/10", className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={cn("h-full rounded-full bg-gradient-to-r from-clinical-600 to-clinical-400 transition-all duration-700", barClass)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

/* ---------- Form fields ---------- */

export function Field({ label, hint, optional, children, className }: { label: string; hint?: string; optional?: boolean; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="clinical-label">
        {label}
        {optional && <span className="ml-1 font-medium normal-case tracking-normal text-navy-300 dark:text-navy-500">(opsional)</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs leading-relaxed text-navy-400 dark:text-navy-400">{hint}</p>}
    </div>
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="clinical-textarea" {...props} />;
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="clinical-input" {...props} />;
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className="clinical-input appearance-none pr-8" {...props} />
      <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-navy-400" />
    </div>
  );
}

/* ---------- Empty state ---------- */

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-navy-200 bg-navy-50/60 px-4 py-6 text-center dark:border-white/10 dark:bg-white/[0.03]">
      <p className="font-serif italic text-navy-500 dark:text-navy-300">{title}</p>
      {children && <div className="mt-1 text-xs text-navy-400 dark:text-navy-500">{children}</div>}
    </div>
  );
}

/* ---------- Confirm dialog ---------- */

export function Confirm({
  open,
  title,
  body,
  confirmLabel = "Ya, lanjutkan",
  danger,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="card-surface relative w-full max-w-md p-6 animate-fade-up">
        <h3 className="text-lg font-bold text-navy-900 dark:text-navy-50">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-navy-500 dark:text-navy-300">{body}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Btn variant="secondary" onClick={onClose}>Batal</Btn>
          <Btn variant={danger ? "danger" : "primary"} onClick={() => { onConfirm(); onClose(); }}>
            {confirmLabel}
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* ---------- Bookmark / Clinical Highlight ---------- */

const BOOKMARK_TONES: Record<string, "teal" | "red" | "amber" | "violet" | "navy" | "green"> = {
  "Temuan klinis penting": "teal",
  "Lab abnormal": "red",
  "Gejala penting": "amber",
  "Drug Related Problem": "violet",
  "Diagnosis penting": "navy",
  "Parameter monitoring": "green",
};

export function BookmarkTag({ label, bagian, onAdd, small }: { label: string; bagian: string; onAdd: (b: Bookmark) => void; small?: boolean }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        type="button"
        title="Tandai sebagai temuan klinis (bookmark/highlight)"
        aria-label="Tandai temuan klinis"
        onClick={() => { setOpen((o) => !o); setDone(false); }}
        className={cn(
          "inline-flex cursor-pointer items-center gap-1 rounded-lg border text-[11px] font-semibold transition-all",
          small ? "px-1.5 py-0.5" : "px-2.5 py-1",
          done
            ? "border-clinical-300 bg-clinical-50 text-clinical-700 dark:border-clinical-500/40 dark:bg-clinical-500/10 dark:text-clinical-300"
            : "border-navy-200 text-navy-400 hover:border-clinical-400 hover:text-clinical-600 dark:border-white/10 dark:text-navy-400 dark:hover:text-clinical-300"
        )}
      >
        {done ? <Check size={12} /> : <BookmarkIcon size={12} />}
        {!small && (done ? "Ditandai" : "Tandai")}
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-8 w-56 animate-fade-in rounded-xl border border-navy-100 bg-white p-1.5 shadow-xl shadow-navy-900/10 dark:border-white/10 dark:bg-navy-800">
          <p className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-navy-400">Highlight sebagai…</p>
          {BOOKMARK_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-medium text-navy-700 hover:bg-navy-50 dark:text-navy-100 dark:hover:bg-white/5"
              onClick={() => {
                onAdd({ id: uid(), kategori: cat, label, bagian, waktu: new Date().toISOString() });
                setOpen(false);
                setDone(true);
              }}
            >
              <span className="flex-1">{cat}</span>
              <Pill tone={BOOKMARK_TONES[cat]} className="!px-1.5 !py-0">·</Pill>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function BookmarkList({ bookmarks, onRemove }: { bookmarks: Bookmark[]; onRemove: (id: string) => void }) {
  if (bookmarks.length === 0)
    return <Empty title="Belum ada temuan yang ditandai.">Gunakan tombol “Tandai” pada data kasus untuk menyimpan <em>important clinical finding</em>.</Empty>;
  return (
    <ul className="space-y-2">
      {bookmarks.map((b) => (
        <li key={b.id} className="group flex items-start gap-2 rounded-xl border border-navy-100 bg-white p-3 dark:border-white/[0.07] dark:bg-white/[0.03]">
          <div className="min-w-0 flex-1">
            <Pill tone={BOOKMARK_TONES[b.kategori] ?? "navy"}>{b.kategori}</Pill>
            <p className="mt-1.5 text-xs font-semibold leading-snug text-navy-800 dark:text-navy-100">{b.label}</p>
            <p className="text-[10px] uppercase tracking-wide text-navy-400">{b.bagian}</p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(b.id)}
            aria-label="Hapus bookmark"
            className="cursor-pointer rounded-md p-1 text-navy-300 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
          >
            <X size={13} />
          </button>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Lab flag badge ---------- */

export function labFlag(num: number | null | undefined, min: number | null | undefined, max: number | null | undefined): "normal" | "low" | "high" | null {
  if (num === null || num === undefined) return null;
  if (min !== null && min !== undefined && num < min) return "low";
  if (max !== null && max !== undefined && num > max) return "high";
  if ((min !== null && min !== undefined) || (max !== null && max !== undefined)) return "normal";
  return null;
}

export function FlagBadge({ flag }: { flag: "normal" | "low" | "high" | null }) {
  if (flag === "normal") return <Pill tone="green">Dalam rentang</Pill>;
  if (flag === "low") return <Pill tone="amber">↓ Di bawah rentang</Pill>;
  if (flag === "high") return <Pill tone="red">↑ Di atas rentang</Pill>;
  return <Pill tone="gray">Kualitatif</Pill>;
}

/* ---------- Section header ---------- */

export function SectionHead({
  icon,
  step,
  title,
  desc,
  action,
}: {
  icon: ReactNode;
  step: string;
  title: string;
  desc?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-start gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-navy-600 text-clinical-300 shadow-md shadow-navy-900/20 dark:from-clinical-600 dark:to-clinical-800 dark:text-white">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-clinical-600 dark:text-clinical-400">{step}</p>
          <h2 className="mt-0.5 text-xl font-extrabold tracking-tight text-navy-900 dark:text-navy-50">{title}</h2>
          {desc && <p className="mt-1 max-w-2xl text-sm leading-relaxed text-navy-500 dark:text-navy-300">{desc}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
