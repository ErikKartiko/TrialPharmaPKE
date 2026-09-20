import { useEffect, useState, type ReactNode } from "react";
import {
  Activity,
  BookOpenCheck,
  BrainCircuit,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Settings,
  Stethoscope,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { cn } from "../utils/cn";
import { CASES } from "../data/cases";
import { nav } from "../lib/router";
import { K, caseStatus, getAnswers, usePersistent } from "../lib/store";
import { Pill } from "./ui";
import type { Student } from "../types";

export function useTheme(): [string, () => void] {
  const [theme, setTheme] = usePersistent<string>(K.theme, "light");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  return [theme, () => setTheme(theme === "dark" ? "light" : "dark")];
}

function NavItem({
  icon,
  label,
  active,
  onClick,
  badge,
  indent,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  badge?: ReactNode;
  indent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left text-[13px] font-semibold transition-all",
        indent && "pl-4",
        active
          ? "bg-gradient-to-r from-clinical-600/15 to-clinical-500/5 text-clinical-700 dark:from-clinical-500/20 dark:to-transparent dark:text-clinical-300"
          : "text-navy-500 hover:bg-navy-100/60 hover:text-navy-800 dark:text-navy-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
      )}
    >
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
          active ? "bg-clinical-600 text-white shadow-sm" : "bg-navy-100/80 text-navy-500 group-hover:bg-navy-200/70 dark:bg-white/[0.07] dark:text-navy-300"
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {badge}
      {active && <span className="h-5 w-1 rounded-full bg-clinical-500" />}
    </button>
  );
}

function statusDot(caseId: string) {
  const s = caseStatus(getAnswers(caseId));
  if (s === "selesai") return <span className="h-2 w-2 rounded-full bg-emerald-500" title="Selesai" />;
  if (s === "proses") return <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse-soft" title="Sedang dikerjakan" />;
  return <span className="h-2 w-2 rounded-full bg-navy-200 dark:bg-white/20" title="Belum dimulai" />;
}

export function Shell({
  route,
  children,
  headerExtra,
  savedTick,
}: {
  route: string;
  children: ReactNode;
  headerExtra?: ReactNode;
  savedTick?: number;
}) {
  const [open, setOpen] = useState(false);
  const [theme, toggle] = useTheme();
  const [student] = usePersistent<Student | null>(K.student, null);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => setOpen(false), [route]);

  useEffect(() => {
    const h = () => {
      setJustSaved(true);
      window.setTimeout(() => setJustSaved(false), 2600);
    };
    window.addEventListener("pharmakpe:saved", h);
    return () => window.removeEventListener("pharmakpe:saved", h);
  }, []);

  const sidebar = (
    <div className="flex h-full flex-col">
      {/* brand */}
      <div className="flex items-center gap-3 px-5 pb-5 pt-6">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 via-navy-700 to-clinical-600 text-white shadow-lg shadow-navy-900/25">
          <Stethoscope size={20} strokeWidth={2.2} />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-clinical-400 dark:border-navy-950" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-extrabold tracking-tight text-navy-900 dark:text-white">PharmaKPE</p>
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-clinical-600 dark:text-clinical-400">Case-Based Learning</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-3">
        <NavItem icon={<LayoutDashboard size={15} />} label="Dashboard" active={route === "/dashboard"} onClick={() => nav("/dashboard")} />
        <NavItem icon={<UserRound size={15} />} label="Profil Saya" active={route === "/profil"} onClick={() => nav("/profil")} />

        <p className="px-3 pb-1.5 pt-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-navy-300 dark:text-navy-500">Kasus Klinis</p>
        {CASES.map((c) => (
          <NavItem
            key={c.id}
            icon={<span className="num text-xs font-bold">{c.number}</span>}
            label={`${c.title}`}
            active={route.startsWith(`/kasus/${c.id}`)}
            onClick={() => nav(`/kasus/${c.id}`)}
            badge={statusDot(c.id)}
          />
        ))}

        <p className="px-3 pb-1.5 pt-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-navy-300 dark:text-navy-500">Laporan</p>
        <NavItem icon={<FolderOpen size={15} />} label="Portfolio" active={route === "/portfolio"} onClick={() => nav("/portfolio")} />
        <NavItem icon={<BrainCircuit size={15} />} label="Refleksi Akhir" active={route === "/refleksi"} onClick={() => nav("/refleksi")} />

        <p className="px-3 pb-1.5 pt-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-navy-300 dark:text-navy-500">Lainnya</p>
        <NavItem icon={<GraduationCap size={15} />} label="Mode Pengajar" active={route === "/pengajar"} onClick={() => nav("/pengajar")} />
        <NavItem icon={<Settings size={15} />} label="Pengaturan" active={route === "/pengaturan"} onClick={() => nav("/pengaturan")} />
      </nav>

      {/* footer */}
      <div className="border-t border-navy-100 px-5 py-4 dark:border-white/[0.07]">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-navy-800 dark:text-navy-100">{student?.nama || "Mahasiswa Farmasi"}</p>
            <p className="truncate text-[10px] text-navy-400 dark:text-navy-400">{student?.nim ? `NIM ${student.nim}` : "Fakultas Farmasi UNEJ"}</p>
          </div>
          <button
            onClick={() => nav("/")}
            title="Keluar ke beranda"
            className="cursor-pointer rounded-lg p-2 text-navy-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
          >
            <LogOut size={15} />
          </button>
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-navy-300 dark:text-navy-500">
          PharmaKPE · Fakultas Farmasi
          <br />
          Universitas Jember
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-navy-50 text-navy-900 dark:bg-[#070f1d] dark:text-navy-50">
      {/* sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] border-r border-navy-100 bg-white/90 backdrop-blur lg:block dark:border-white/[0.06] dark:bg-navy-950/80">
        {sidebar}
      </aside>
      {/* drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[280px] border-r border-navy-100 bg-white shadow-2xl animate-fade-in dark:border-white/10 dark:bg-navy-950">
            <button
              onClick={() => setOpen(false)}
              aria-label="Tutup menu"
              className="absolute right-3 top-4 cursor-pointer rounded-lg p-2 text-navy-400 hover:bg-navy-100 dark:hover:bg-white/10"
            >
              <X size={18} />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      {/* main column */}
      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-20 border-b border-navy-100/80 bg-navy-50/85 backdrop-blur-md dark:border-white/[0.06] dark:bg-[#070f1d]/85">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
            <button
              onClick={() => setOpen(true)}
              aria-label="Buka menu"
              className="cursor-pointer rounded-lg p-2 text-navy-500 hover:bg-navy-100 lg:hidden dark:text-navy-300 dark:hover:bg-white/10"
            >
              <Menu size={18} />
            </button>
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Pill tone="teal" className="hidden sm:inline-flex">
                <BookOpenCheck size={11} /> Farmakoterapi KPE
              </Pill>
              <span className="hidden text-xs font-medium text-navy-400 md:inline dark:text-navy-400">Fakultas Farmasi · Universitas Jember</span>
              <Pill
                tone="gray"
                className={cn("ml-1 transition-opacity duration-500", (savedTick !== undefined && savedTick > 0) || justSaved ? "opacity-100" : "opacity-0")}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Tersimpan otomatis
              </Pill>
            </div>
            {headerExtra}
            <button
              onClick={toggle}
              aria-label={theme === "dark" ? "Mode terang" : "Mode gelap"}
              className="cursor-pointer rounded-xl border border-navy-200 p-2 text-navy-500 transition hover:bg-navy-100 dark:border-white/15 dark:text-amber-300 dark:hover:bg-white/10"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
          {/* ECG accent line */}
          <svg className="h-3 w-full text-clinical-500/40" preserveAspectRatio="none" viewBox="0 0 1200 12" aria-hidden>
            <path
              className="ecg-line"
              d="M0 6 H460 l8-5 8 9 6-14 8 16 6-10 4 4 H1200"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        </header>
        <main className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8">
          <div key={route} className="animate-fade-in">
            {children}
          </div>
        </main>
        <footer className="border-t border-navy-100/70 px-6 py-5 text-center text-[11px] text-navy-400 dark:border-white/[0.05] dark:text-navy-500">
          <span className="inline-flex items-center gap-1.5">
            <Activity size={11} className="text-clinical-500" />
            PharmaKPE Case-Based Learning — data hanya tersimpan di browser perangkat ini (local storage), tidak dikirim ke server.
          </span>
        </footer>
      </div>
    </div>
  );
}
