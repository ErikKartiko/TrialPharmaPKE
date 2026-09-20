import { useMemo, useRef } from "react";
import { ArrowRight, BrainCircuit, CheckCircle2, FileDown, FolderOpen, Lock } from "lucide-react";
import { nav } from "../lib/router";
import { Btn, Card, Field, Pill, Progress, TextArea } from "../components/ui";
import { K, allSummaries, emptyFinalReflection, usePersistent } from "../lib/store";
import type { FinalReflection, Student } from "../types";
import { downloadPortfolio } from "../lib/docx";
import { cn } from "../utils/cn";

const REFLECTION_QUESTIONS: { key: keyof FinalReflection; q: string }[] = [
  { key: "pola", q: "Apa pola masalah farmakoterapi yang paling sering ditemukan?" },
  { key: "perbedaan", q: "Apa perbedaan pendekatan farmakoterapi antar kasus?" },
  { key: "lab", q: "Bagaimana data laboratorium mempengaruhi keputusan terapi?" },
  { key: "komorbid", q: "Bagaimana kondisi komorbid mempengaruhi pemilihan obat?" },
  { key: "peranApoteker", q: "Apa peran apoteker dalam kasus-kasus tersebut?" },
];

export default function Portfolio({ focusReflection }: { focusReflection?: boolean }) {
  const [student] = usePersistent<Student | null>(K.student, null);
  const [finalReflection, setFinalReflection] = usePersistent<FinalReflection>(K.finalReflection, emptyFinalReflection);
  const summaries = useMemo(() => allSummaries(), []);
  const done = summaries.filter((s) => s.status === "selesai").length;
  const ref = useRef<HTMLDivElement>(null);

  const scrollToReflection = () => ref.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="space-y-6" ref={focusReflection ? ref : undefined}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-clinical-600 dark:text-clinical-400">Laporan Terpadu</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl dark:text-navy-50">Portfolio & Refleksi Akhir</h1>
          <p className="mt-1 text-sm text-navy-500 dark:text-navy-300">Seluruh hasil pengerjaan 5 kasus dalam satu dokumen Word.</p>
        </div>
      </div>

      {/* per-case status */}
      <Card className="!p-0 overflow-hidden">
        <div className="flex items-center gap-3 border-b border-navy-100 bg-navy-50/70 px-5 py-4 dark:border-white/[0.06] dark:bg-white/[0.03]">
          <FolderOpen size={18} className="text-clinical-600 dark:text-clinical-400" />
          <h2 className="text-sm font-extrabold text-navy-900 dark:text-navy-50">
            Status Pengerjaan — {done}/{summaries.length} kasus selesai
          </h2>
        </div>
        <div className="divide-y divide-navy-100/70 dark:divide-white/[0.05]">
          {summaries.map(({ c, a, percent, status }) => (
            <div key={c.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
              <span className="num flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-800 text-sm font-extrabold text-clinical-300 dark:bg-clinical-600 dark:text-white">
                {c.number}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-navy-900 dark:text-navy-50">{c.title}</p>
                <p className="truncate text-xs text-navy-400">{c.diagnosis}</p>
              </div>
              <div className="hidden w-36 sm:block">
                <Progress value={percent} />
              </div>
              <span className="num w-10 text-right text-xs font-bold text-navy-500 dark:text-navy-300">{percent}%</span>
              {status === "selesai" ? (
                <Pill tone="green">
                  <CheckCircle2 size={11} /> Selesai
                </Pill>
              ) : status === "proses" ? (
                <Pill tone="amber">Proses</Pill>
              ) : (
                <Pill tone="gray">Belum</Pill>
              )}
              <Btn size="sm" variant="secondary" onClick={() => nav(a.finished ? `/kasus/${c.id}/review` : `/kasus/${c.id}`)}>
                {status === "belum" ? "Mulai" : "Buka"} <ArrowRight size={12} />
              </Btn>
            </div>
          ))}
        </div>
      </Card>

      {/* final reflection */}
      <div ref={ref}>
      <Card className={cn(focusReflection && "ring-2 ring-clinical-500/40")}>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-clinical-600 to-navy-700 text-white">
              <BrainCircuit size={20} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-navy-900 dark:text-navy-50">Final Clinical Reflection</h2>
              <p className="text-sm text-navy-500 dark:text-navy-300">
                {done === summaries.length
                  ? "Semua kasus selesai — refleksikan pembelajaran Anda secara menyeluruh."
                  : "Dapat diisi kapan saja; disarankan setelah seluruh kasus selesai."}
              </p>
            </div>
          </div>
          {done < summaries.length && (
            <Pill tone="amber">
              <Lock size={10} /> {summaries.length - done} kasus belum selesai
            </Pill>
          )}
        </div>
        <div className="grid gap-4">
          {REFLECTION_QUESTIONS.map((f, i) => (
            <Field key={f.key} label={`${i + 1}. ${f.q}`}>
              <TextArea
                value={finalReflection[f.key]}
                onChange={(e) => setFinalReflection((x) => ({ ...x, [f.key]: e.target.value }))}
                className="!min-h-[90px]"
              />
            </Field>
          ))}
        </div>
      </Card>
      </div>

      {/* download */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(70%_100%_at_90%_50%,rgba(15,167,156,0.12),transparent)]" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-navy-900 dark:text-navy-50">Download Portfolio (.docx)</h3>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-navy-500 dark:text-navy-300">
              Struktur dokumen: Cover → Daftar Isi → Case 1 s.d. Case 5 (lengkap 13 bab per kasus) → Refleksi Akhir.
              Kasus yang belum difinalisasi akan ditandai <em>draft</em> di dalam dokumen.
            </p>
            <p className="num mt-2 text-xs font-bold text-navy-700 dark:text-navy-200">
              Portfolio_Farmakoterapi_KPE_{student?.nim || "NIM"}.docx
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {!focusReflection && (
              <Btn variant="secondary" onClick={scrollToReflection}>
                Isi Refleksi Akhir
              </Btn>
            )}
            <Btn variant="teal" size="lg" onClick={() => downloadPortfolio(summaries.map((s) => ({ c: s.c, a: s.a })), student, finalReflection)}>
              <FileDown size={16} /> Unduh Portfolio
            </Btn>
          </div>
        </div>
      </Card>
    </div>
  );
}
