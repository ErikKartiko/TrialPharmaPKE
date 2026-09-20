import { useEffect, useMemo, useState, type ReactElement } from "react";
import {
  Activity,
  AlarmClock,
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FlaskConical,
  GraduationCap,
  History,
  ListChecks,
  MessageSquareText,
  MonitorDot,
  Pill as PillIcon,
  RotateCcw,
  Save,
  ScanHeart,
  StickyNote,
  Tags,
  UserRound,
  CheckSquare,
} from "lucide-react";
import { nav } from "../lib/router";
import { K, progressOf, uid, useCaseAnswers, usePersistent } from "../lib/store";
import type { CaseData } from "../types";
import { BookmarkList, Btn, Card, Confirm, Pill, Progress, TextArea } from "../components/ui";
import {
  ClinicalSection,
  ComplaintSection,
  HistorySection,
  LabSection,
  MedsSection,
  PatientSection,
  SupportingSection,
} from "../components/sections/DataSections";
import {
  AnalysisSection,
  ConclusionSection,
  DRPSection,
  EducationSection,
  MonitoringSection,
  PlanSection,
  ReferenceSection,
  SoapSection,
} from "../components/sections/AnalysisSections";
import { cn } from "../utils/cn";

type Updater = Parameters<ReturnType<typeof useCaseAnswers>["update"]>[0];

interface SectionDef {
  key: string;
  label: string;
  icon: typeof UserRound;
  readonly?: boolean;
  render: (c: CaseData, a: ReturnType<typeof useCaseAnswers>["answers"], update: (fn: Updater) => void) => ReactElement;
}

const SECTIONS: SectionDef[] = [
  { key: "pasien", label: "Identitas Pasien", icon: UserRound, readonly: true, render: (c, a, u) => <PatientSection c={c} a={a} update={u} /> },
  { key: "keluhan", label: "Keluhan Utama", icon: MessageSquareText, readonly: true, render: (c, a, u) => <ComplaintSection c={c} a={a} update={u} /> },
  { key: "riwayat", label: "Riwayat Penyakit", icon: History, readonly: true, render: (c, a) => <HistorySection c={c} a={a} update={() => undefined} /> },
  { key: "klinis", label: "Data Klinis", icon: Activity, readonly: true, render: (c, a) => <ClinicalSection c={c} a={a} update={() => undefined} /> },
  { key: "lab", label: "Laboratorium", icon: FlaskConical, render: (c, a, u) => <LabSection c={c} a={a} update={u} /> },
  { key: "penunjang", label: "Pemeriksaan Penunjang", icon: ScanHeart, render: (c, a, u) => <SupportingSection c={c} a={a} update={u} /> },
  { key: "terapi", label: "Terapi Obat", icon: PillIcon, render: (c, a, u) => <MedsSection c={c} a={a} update={u} /> },
  { key: "analisis", label: "Analisis Kasus", icon: BrainCircuit, render: (c, a, u) => <AnalysisSection c={c} a={a} update={u} /> },
  { key: "drp", label: "DRP", icon: ListChecks, render: (c, a, u) => <DRPSection c={c} a={a} update={u} /> },
  { key: "rencana", label: "Rencana Terapi", icon: ClipboardCheck, render: (c, a, u) => <PlanSection c={c} a={a} update={u} /> },
  { key: "monitoring", label: "Monitoring", icon: MonitorDot, render: (c, a, u) => <MonitoringSection c={c} a={a} update={u} /> },
  {
    key: "edukasi",
    label: "Edukasi, Referensi & SOAP",
    icon: GraduationCap,
    render: (c, a, u) => (
      <>
        <EducationSection c={c} a={a} update={u} />
        <div className="mt-4">
          <ReferenceSection a={a} update={u} />
        </div>
        <SoapSection c={c} a={a} update={u} />
      </>
    ),
  },
  { key: "kesimpulan", label: "Kesimpulan & Refleksi", icon: CheckSquare, render: (c, a, u) => <ConclusionSection c={c} a={a} update={u} /> },
];

/* ---------- timer ---------- */

function fmt(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

function CaseTimer({ caseId }: { caseId: string }) {
  const [t, setT] = usePersistent(K.timer(caseId), { enabled: false, elapsed: 0 });
  useEffect(() => {
    if (!t.enabled) return;
    const iv = window.setInterval(() => setT((p) => ({ ...p, elapsed: p.elapsed + 1 })), 1000);
    return () => window.clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t.enabled, caseId]);
  return (
    <div className="flex items-center gap-2">
      <label className="flex cursor-pointer items-center gap-1.5 text-[11px] font-bold text-navy-500 dark:text-navy-300">
        <input type="checkbox" className="h-3.5 w-3.5 accent-teal-600" checked={t.enabled} onChange={(e) => setT((p) => ({ ...p, enabled: e.target.checked }))} />
        Timer
      </label>
      {t.enabled && (
        <Pill tone="teal" className="num !text-[11px]">
          <AlarmClock size={11} /> {fmt(t.elapsed)}
        </Pill>
      )}
    </div>
  );
}

/* ---------- workspace ---------- */

export default function CaseWorkspace({ caseData, secParam }: { caseData: CaseData; secParam?: string }) {
  const { answers: a, update, reset, savedTick } = useCaseAnswers(caseData.id);
  const [confirmReset, setConfirmReset] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const secIdx = Math.max(0, Math.min(SECTIONS.length - 1, secParam ? parseInt(secParam, 10) || 0 : 0));
  const go = (i: number) => nav(`/kasus/${caseData.id}/${i}`);

  useEffect(() => {
    if (savedTick) {
      setShowSaved(true);
      const t = window.setTimeout(() => setShowSaved(false), 2200);
      return () => window.clearTimeout(t);
    }
  }, [savedTick]);

  const { percent, sections: progSections } = useMemo(() => progressOf(caseData, a), [caseData, a]);
  const doneKeys = useMemo(() => new Set(progSections.filter((s) => s.done).map((s) => s.key)), [progSections]);

  const sec = SECTIONS[secIdx];
  const sectionDone = (key: string, readonly?: boolean) => {
    if (readonly) return undefined;
    if (key === "terapi") return a.finished ? true : doneKeys.has("terapi") || Object.keys(a.medAnalysis).length > 0 || undefined;
    if (key === "edukasi") return doneKeys.has("edukasi");
    if (key === "kesimpulan") return doneKeys.has("kesimpulan") && doneKeys.has("refleksi");
    return doneKeys.has(key);
  };

  return (
    <div className="space-y-5">
      {/* case header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <button onClick={() => nav("/dashboard")} className="mb-1 inline-flex cursor-pointer items-center gap-1 text-xs font-bold text-navy-400 transition hover:text-clinical-600 dark:hover:text-clinical-300">
            <ArrowLeft size={12} /> Dashboard
          </button>
          <h1 className="text-xl font-extrabold tracking-tight text-navy-900 sm:text-2xl dark:text-navy-50">
            <span className="mr-2 inline-flex h-8 w-8 -translate-y-0.5 items-center justify-center rounded-xl bg-navy-800 text-sm font-bold text-clinical-300 dark:bg-clinical-600 dark:text-white">
              {caseData.number}
            </span>
            {caseData.title}
            {a.finished && (
              <Pill tone="green" className="ml-2 align-middle">
                <CheckCircle2 size={11} /> Selesai
              </Pill>
            )}
          </h1>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-navy-500 sm:text-sm dark:text-navy-300">{caseData.diagnosis}</p>
        </div>
        <div className="flex items-center gap-2">
          <CaseTimer caseId={caseData.id} />
          <Btn variant="secondary" size="sm" onClick={() => setConfirmReset(true)}>
            <RotateCcw size={13} /> Reset Jawaban
          </Btn>
          <Btn size="sm" onClick={() => nav(`/kasus/${caseData.id}/review`)}>
            Review & Finish <ChevronRight size={14} />
          </Btn>
        </div>
      </div>

      {/* progress */}
      <Card className="!p-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-extrabold uppercase tracking-widest text-navy-400">
            Case Progress <span className="num ml-1 text-sm font-extrabold text-clinical-600 dark:text-clinical-300">{percent}%</span>
          </p>
          <p
            className={cn(
              "flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 transition-opacity duration-500 dark:text-emerald-400",
              showSaved ? "opacity-100" : "opacity-0"
            )}
          >
            <Save size={12} /> ✓ Tersimpan otomatis
          </p>
        </div>
        <Progress value={percent} className="mt-2" />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {progSections.map((s) => (
            <span
              key={s.key}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
                s.done ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-navy-100/70 text-navy-400 dark:bg-white/[0.06] dark:text-navy-400"
              )}
            >
              {s.done ? "✓" : "○"} {s.label}
            </span>
          ))}
        </div>
      </Card>

      <div className="flex flex-col gap-5 xl:flex-row">
        {/* section nav */}
        <aside className="xl:w-60 xl:shrink-0">
          <Card className="!p-2 xl:sticky xl:top-24">
            <p className="px-3 pb-1.5 pt-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-navy-300 dark:text-navy-500">Bagian Kasus</p>
            <ol className="grid grid-cols-2 gap-0.5 sm:grid-cols-3 xl:grid-cols-1">
              {SECTIONS.map((s, i) => {
                const active = i === secIdx;
                const done = sectionDone(s.key, s.readonly);
                return (
                  <li key={s.key}>
                    <button
                      onClick={() => go(i)}
                      className={cn(
                        "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-bold transition",
                        active
                          ? "bg-gradient-to-r from-clinical-600/15 to-transparent text-clinical-700 dark:text-clinical-300"
                          : "text-navy-500 hover:bg-navy-100/60 dark:text-navy-300 dark:hover:bg-white/[0.05]"
                      )}
                    >
                      <span
                        className={cn(
                          "num flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-extrabold",
                          active ? "bg-clinical-600 text-white" : "bg-navy-100 text-navy-400 dark:bg-white/10 dark:text-navy-400"
                        )}
                      >
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{s.label}</span>
                      {done === true && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                      {done === false && <span className="h-1.5 w-1.5 rounded-full border border-navy-300 dark:border-white/25" />}
                    </button>
                  </li>
                );
              })}
            </ol>
          </Card>
        </aside>

        {/* main content */}
        <div className="min-w-0 flex-1">
          <div key={sec.key} className="animate-fade-up">
            {sec.render(caseData, a, update)}
          </div>

          {/* pager */}
          <div className="sticky bottom-3 z-10 mt-6 flex items-center justify-between gap-2 rounded-2xl border border-navy-100 bg-white/90 p-3 shadow-xl shadow-navy-900/[0.06] backdrop-blur dark:border-white/[0.08] dark:bg-navy-900/90">
            <Btn variant="secondary" size="sm" disabled={secIdx === 0} onClick={() => go(secIdx - 1)}>
              <ArrowLeft size={14} /> <span className="hidden sm:inline">Sebelumnya</span>
            </Btn>
            <p className="hidden text-xs font-bold text-navy-400 md:block">
              Bagian {secIdx + 1} dari {SECTIONS.length} — {sec.label}
            </p>
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1 text-[11px] font-bold text-emerald-600 sm:flex dark:text-emerald-400">
                <Save size={12} /> Save otomatis
              </span>
              {secIdx < SECTIONS.length - 1 ? (
                <Btn size="sm" onClick={() => go(secIdx + 1)}>
                  <span className="hidden sm:inline">Selanjutnya</span> <ArrowRight size={14} />
                </Btn>
              ) : (
                <Btn size="sm" variant="teal" onClick={() => nav(`/kasus/${caseData.id}/review`)}>
                  Review & Finish <ChevronRight size={14} />
                </Btn>
              )}
            </div>
          </div>
        </div>

        {/* right aside: bookmarks + notes */}
        <aside className="space-y-4 xl:w-72 xl:shrink-0">
          <Card className="!p-4 xl:sticky xl:top-24">
            <h3 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-navy-400">
              <Tags size={13} className="text-clinical-500" /> Important Clinical Findings
            </h3>
            <div className="mt-3 max-h-72 overflow-y-auto pr-1">
              <BookmarkList bookmarks={a.bookmarks} onRemove={(id) => update((x) => ({ ...x, bookmarks: x.bookmarks.filter((b) => b.id !== id) }))} />
            </div>
          </Card>
          <Card className="!p-4">
            <h3 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-navy-400">
              <StickyNote size={13} className="text-clinical-500" /> Personal Notes
            </h3>
            <TextArea
              value={a.catatan}
              onChange={(e) => update((x) => ({ ...x, catatan: e.target.value }))}
              placeholder="Catatan pribadi selama mengerjakan kasus (tidak masuk laporan)…"
              className="mt-3 !min-h-[130px] !text-xs"
            />
          </Card>
        </aside>
      </div>

      <Confirm
        open={confirmReset}
        title="Reset seluruh jawaban kasus ini?"
        body="Semua jawaban, DRP, rencana terapi, monitoring, bookmark, dan timer pada kasus ini akan dihapus permanen dari browser. Tindakan tidak dapat dibatalkan."
        confirmLabel="Ya, reset jawaban"
        danger
        onConfirm={() => {
          reset();
        }}
        onClose={() => setConfirmReset(false)}
      />
    </div>
  );
}

export { SECTIONS, uid };
