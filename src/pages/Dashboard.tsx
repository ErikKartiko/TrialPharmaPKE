import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  FileDown,
  FileText,
  FolderDown,
  Play,
  RotateCcw,
  Search,
  Sparkles,
} from "lucide-react";
import { nav } from "../lib/router";
import { Btn, Card, Pill, Progress } from "../components/ui";
import { CASES, CASE_FILTERS } from "../data/cases";
import { K, allSummaries, formatDate, usePersistent } from "../lib/store";
import type { Student } from "../types";
import { downloadPortfolio } from "../lib/docx";

function StatusPill({ s }: { s: "belum" | "proses" | "selesai" }) {
  if (s === "selesai")
    return (
      <Pill tone="green">
        <CheckCircle2 size={11} /> Selesai
      </Pill>
    );
  if (s === "proses")
    return (
      <Pill tone="amber">
        <Clock3 size={11} /> Sedang dikerjakan
      </Pill>
    );
  return <Pill tone="gray">Belum dimulai</Pill>;
}

export default function Dashboard() {
  const [student] = usePersistent<Student | null>(K.student, null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("Semua");

  const summaries = useMemo(() => allSummaries(), []);
  const doneCount = summaries.filter((s) => s.status === "selesai").length;
  const overall = Math.round(summaries.reduce((acc, s) => acc + s.percent, 0) / summaries.length);
  const lastActivity = summaries
    .filter((s) => s.status !== "belum")
    .map((s) => s.a.updatedAt)
    .filter(Boolean)
    .sort()
    .pop();

  const filtered = summaries.filter(({ c }) => {
    const matchFilter = filter === "Semua" || c.tags.includes(filter);
    const needle = q.trim().toLowerCase();
    if (!needle) return matchFilter;
    const hay = [c.title, c.diagnosis, c.system, ...c.tags, ...c.medications.map((m) => m.name)].join(" ").toLowerCase();
    return matchFilter && hay.includes(needle);
  });

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-clinical-600 dark:text-clinical-400">Selamat datang kembali</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl dark:text-navy-50">
            Clinical Case Dashboard
          </h1>
          <p className="mt-1 text-sm text-navy-500 dark:text-navy-300">
            {student?.nama ? `${student.nama} · NIM ${student.nim}` : "Fakultas Farmasi — Universitas Jember"}
          </p>
        </div>
        <Btn variant="secondary" onClick={() => nav("/portfolio")}>
          <FolderDown size={15} /> Portfolio
        </Btn>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { icon: <FileText size={17} />, label: "Kasus Klinis", value: `${CASES.length} kasus`, sub: "Farmakoterapi KPE" },
          { icon: <CheckCircle2 size={17} />, label: "Kasus Selesai", value: `${doneCount} / ${CASES.length}`, sub: `${CASES.length - doneCount} belum selesai` },
          { icon: <BookOpenCheck size={17} />, label: "Progress Keseluruhan", value: `${overall}%`, sub: "rata-rata 5 kasus", bar: overall },
          {
            icon: <Clock3 size={17} />,
            label: "Aktivitas Terakhir",
            value: lastActivity ? formatDate(lastActivity).split(",").slice(0, 2).join(",") : "—",
            sub: "tersimpan otomatis",
          },
        ].map((s) => (
          <Card key={s.label} className="!p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-navy-400 dark:text-navy-400">{s.label}</p>
              <span className="text-clinical-500">{s.icon}</span>
            </div>
            <p className="num mt-1.5 truncate text-lg font-bold text-navy-900 dark:text-navy-50">{s.value}</p>
            <p className="text-[11px] text-navy-400 dark:text-navy-400">{s.sub}</p>
            {s.bar !== undefined && <Progress value={s.bar} className="mt-2" />}
          </Card>
        ))}
      </div>

      {/* search + filter */}
      <Card className="!p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari kasus, diagnosis, atau nama obat… (cth: amlodipin, STEMI, digoxin)"
              className="clinical-input !pl-10"
              aria-label="Pencarian kasus"
            />
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter kasus">
            {CASE_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={
                  filter === f
                    ? "cursor-pointer rounded-full bg-navy-800 px-3 py-1.5 text-[11px] font-bold text-white dark:bg-clinical-600"
                    : "cursor-pointer rounded-full border border-navy-200 px-3 py-1.5 text-[11px] font-bold text-navy-500 hover:border-clinical-400 hover:text-clinical-600 dark:border-white/15 dark:text-navy-300 dark:hover:text-clinical-300"
                }
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* case cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map(({ c, percent, status }) => (
          <Card key={c.id} className="group flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/[0.07] dark:hover:border-clinical-500/30">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-navy-600 shadow-md shadow-navy-900/20">
                <span className="num text-lg font-extrabold text-clinical-300">{c.number}</span>
              </div>
              <StatusPill s={status} />
            </div>
            <h3 className="mt-4 text-lg font-extrabold tracking-tight text-navy-900 dark:text-navy-50">{c.title}</h3>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-navy-500 dark:text-navy-300">{c.diagnosis}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Pill tone="teal">{c.system}</Pill>
              <Pill tone="gray">
                <Clock3 size={10} /> {c.estTime}
              </Pill>
            </div>
            <div className="mt-4 flex-1" />
            <div className="flex items-center justify-between text-[11px] font-bold text-navy-400 dark:text-navy-400">
              <span>Progress pengerjaan</span>
              <span className="num">{percent}%</span>
            </div>
            <Progress value={percent} className="mt-1.5" />
            <div className="mt-4 flex gap-2">
              {status === "belum" ? (
                <Btn size="sm" className="flex-1" onClick={() => nav(`/kasus/${c.id}`)}>
                  <Play size={13} /> Mulai
                </Btn>
              ) : (
                <>
                  <Btn size="sm" className="flex-1" onClick={() => nav(`/kasus/${c.id}`)}>
                    <Play size={13} /> Lanjutkan
                  </Btn>
                  <Btn size="sm" variant="secondary" onClick={() => nav(`/kasus/${c.id}/review`)}>
                    Review <ArrowRight size={13} />
                  </Btn>
                </>
              )}
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card className="col-span-full py-10 text-center">
            <p className="font-serif italic text-navy-400">Tidak ada kasus yang cocok dengan pencarian/filter.</p>
            <Btn
              variant="ghost"
              size="sm"
              className="mt-3"
              onClick={() => {
                setQ("");
                setFilter("Semua");
              }}
            >
              <RotateCcw size={13} /> Reset pencarian
            </Btn>
          </Card>
        )}
      </div>

      {/* portfolio CTA */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(70%_100%_at_90%_50%,rgba(15,167,156,0.12),transparent)]" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-clinical-600 text-white shadow-lg shadow-clinical-600/30 sm:flex">
              <FileDown size={20} />
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-navy-900 dark:text-navy-50">
                Download Portfolio
                {doneCount === CASES.length && (
                  <Pill tone="green">
                    <Sparkles size={11} /> Semua kasus selesai
                  </Pill>
                )}
              </h3>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-navy-500 dark:text-navy-300">
                Gabungkan hasil pengerjaan seluruh 5 kasus menjadi satu dokumen Word:{" "}
                <span className="num text-xs font-semibold text-navy-700 dark:text-navy-200">
                  Portfolio_Farmakoterapi_KPE_{student?.nim || "NIM"}.docx
                </span>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Btn variant="secondary" onClick={() => nav("/refleksi")}>
              Refleksi Akhir
            </Btn>
            <Btn
              variant="teal"
              onClick={() =>
                downloadPortfolio(
                  summaries.map((s) => ({ c: s.c, a: s.a })),
                  student,
                  JSON.parse(localStorage.getItem("pharmakpe:final-reflection") || "null") ?? {
                    pola: "",
                    perbedaan: "",
                    lab: "",
                    komorbid: "",
                    peranApoteker: "",
                  }
                )
              }
            >
              <FileDown size={15} /> Unduh Portfolio (.docx)
            </Btn>
          </div>
        </div>
      </Card>
    </div>
  );
}
