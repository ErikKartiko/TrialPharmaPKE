import { useCallback, useEffect, useRef, useState } from "react";
import type { CaseAnswers, CaseData, FinalReflection, RubricItem, Student } from "../types";
import { CASES } from "../data/cases";

/* ============================================================
   STORE — local-first persistence.
   Semua jawaban disimpan di browser (localStorage) perangkat ini.
   Catatan: struktur sengaja dipisah per-entitas agar mudah
   dimigrasikan ke Supabase/Firebase (lihat fungsi adapter di bawah).
   ============================================================ */

const PREFIX = "pharmakpe";

export const K = {
  student: `${PREFIX}:student`,
  answers: (caseId: string) => `${PREFIX}:answers:${caseId}`,
  timer: (caseId: string) => `${PREFIX}:timer:${caseId}`,
  finalReflection: `${PREFIX}:final-reflection`,
  rubric: `${PREFIX}:rubric`,
  theme: `${PREFIX}:theme`,
};

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) } as T;
  } catch {
    return fallback;
  }
}

export function saveJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    if (key.includes(":answers:")) {
      window.dispatchEvent(new CustomEvent("pharmakpe:saved"));
    }
  } catch {
    /* quota penuh — abaikan */
  }
}

export function removeKey(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/* ---------- answers default ---------- */

export function emptyAnswers(): CaseAnswers {
  const now = new Date().toISOString();
  return {
    startedAt: now,
    updatedAt: now,
    finished: false,
    labInterp: {},
    examInterp: {},
    medAnalysis: {},
    medEval: {},
    masalah: "",
    assessment: "",
    drps: [],
    plans: [],
    monitors: [],
    education: { informasi: "", cara: "", efekSamping: "", kembali: "", gayaHidup: "", tandaBahaya: "" },
    soap: { s: "", o: "", a: "", p: "", include: true },
    kesimpulan: "",
    refleksi: { dipelajari: "", tersulit: "", dataTambahan: "" },
    catatan: "",
    references: [],
    bookmarks: [],
  };
}

export function getAnswers(caseId: string): CaseAnswers {
  return loadJSON(K.answers(caseId), emptyAnswers());
}

/* ---------- hook: answers per kasus dengan autosave ---------- */

export function useCaseAnswers(caseId: string): {
  answers: CaseAnswers;
  update: (fn: (a: CaseAnswers) => CaseAnswers) => void;
  reset: () => void;
  savedTick: number;
} {
  const [answers, setAnswers] = useState<CaseAnswers>(() => getAnswers(caseId));
  const [savedTick, setSavedTick] = useState(0);
  const t = useRef<number | undefined>(undefined);

  const update = useCallback(
    (fn: (a: CaseAnswers) => CaseAnswers) => {
      setAnswers((prev) => {
        const next = { ...fn(prev), updatedAt: new Date().toISOString() };
        window.clearTimeout(t.current);
        t.current = window.setTimeout(() => {
          saveJSON(K.answers(caseId), next);
          setSavedTick(Date.now());
        }, 350);
        return next;
      });
    },
    [caseId]
  );

  useEffect(() => {
    saveJSON(K.answers(caseId), answers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  const reset = useCallback(() => {
    removeKey(K.answers(caseId));
    removeKey(K.timer(caseId));
    setAnswers(emptyAnswers());
    setSavedTick(Date.now());
  }, [caseId]);

  return { answers, update, reset, savedTick };
}

/* ---------- generic persistent hook ---------- */

export function usePersistent<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [val, setVal] = useState<T>(() => loadJSON(key, initial));
  const set = useCallback(
    (v: T | ((p: T) => T)) => {
      setVal((prev) => {
        const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
        saveJSON(key, next);
        return next;
      });
    },
    [key]
  );
  return [val, set];
}

/* ---------- progress & validasi ---------- */

export interface ProgressSection {
  key: string;
  label: string;
  done: boolean;
}

const filled = (s?: string) => !!s && s.trim().length > 0;

export function progressOf(c: CaseData, a: CaseAnswers): { percent: number; sections: ProgressSection[] } {
  const anyLab = Object.values(a.labInterp).some(filled);
  const anyExam = c.supporting.length === 0 || c.supporting.some((_, i) => filled(a.examInterp[i]));
  const anyMed = c.medications.some((_, i) => {
    const m = a.medAnalysis[i];
    return m && (filled(m.indikasi) || filled(m.regimen) || filled(m.masalah) || filled(m.monitoring) || filled(m.efekSamping));
  });
  const edu: string[] = Object.values(a.education);
  const eduDone = edu.filter(filled).length;

  const sections: ProgressSection[] = [
    { key: "lab", label: "Laboratorium", done: anyLab },
    { key: "exam", label: "Penunjang", done: anyExam },
    { key: "med", label: "Terapi Obat", done: anyMed },
    { key: "analisis", label: "Analisis Kasus", done: filled(a.masalah) && filled(a.assessment) },
    { key: "drp", label: "DRP", done: a.drps.some((d) => filled(d.masalah) && filled(d.bukti)) },
    { key: "rencana", label: "Rencana Terapi", done: a.plans.some((p) => filled(p.masalah) && filled(p.pilihan)) },
    { key: "monitoring", label: "Monitoring", done: a.monitors.some((m) => filled(m.parameter) && filled(m.frekuensi)) },
    { key: "edukasi", label: "Edukasi", done: eduDone === 6 },
    { key: "kesimpulan", label: "Kesimpulan", done: filled(a.kesimpulan) },
    { key: "refleksi", label: "Refleksi", done: filled(a.refleksi.dipelajari) },
  ];
  const done = sections.filter((s) => s.done).length;
  return { percent: Math.round((done / sections.length) * 100), sections };
}

export function caseStatus(a: CaseAnswers): "belum" | "proses" | "selesai" {
  if (a.finished) return "selesai";
  const anyInput =
    filled(a.masalah) ||
    a.drps.length > 0 ||
    Object.values(a.labInterp).some(filled) ||
    Object.values(a.examInterp).some(filled) ||
    Object.keys(a.medAnalysis).length > 0;
  return anyInput ? "proses" : "belum";
}

export function validateCase(student: Student | null, _c: CaseData, a: CaseAnswers): string[] {
  const missing: string[] = [];
  if (!student || !filled(student.nama) || !filled(student.nim) || !filled(student.kelas) || !filled(student.kelompok))
    missing.push("Identitas mahasiswa belum lengkap");
  if (!filled(a.masalah)) missing.push("Analisis Kasus — Langkah 1: identifikasi masalah pasien");
  if (!filled(a.assessment)) missing.push("Analisis Kasus — Langkah 2: assessment kondisi klinis");
  if (!a.drps.some((d) => filled(d.masalah) && filled(d.bukti)))
    missing.push("DRP — minimal satu masalah terkait obat dengan bukti klinis");
  if (!a.plans.some((p) => filled(p.masalah) && filled(p.pilihan) && filled(p.regimen)))
    missing.push("Rencana Farmakoterapi — masalah, pilihan terapi, dan regimen");
  if (!a.monitors.some((m) => filled(m.parameter) && filled(m.frekuensi) && filled(m.tindakan)))
    missing.push("Monitoring Plan — parameter, frekuensi, dan tindakan");
  const e = a.education;
  if (!(filled(e.informasi) && filled(e.cara) && filled(e.efekSamping) && filled(e.kembali) && filled(e.gayaHidup) && filled(e.tandaBahaya)))
    missing.push("Edukasi Pasien — seluruh 6 poin counseling");
  if (!filled(a.kesimpulan)) missing.push("Kesimpulan farmakoterapi");
  return missing;
}

/* ---------- agregat dashboard ---------- */

export interface CaseSummary {
  c: CaseData;
  a: CaseAnswers;
  percent: number;
  status: "belum" | "proses" | "selesai";
}

export function allSummaries(): CaseSummary[] {
  return CASES.map((c) => {
    const a = getAnswers(c.id);
    return { c, a, percent: progressOf(c, a).percent, status: caseStatus(a) };
  });
}

/* ---------- final reflection & rubrik ---------- */

export const emptyFinalReflection: FinalReflection = { pola: "", perbedaan: "", lab: "", komorbid: "", peranApoteker: "" };

export const DEFAULT_RUBRIC: RubricItem[] = [
  { key: "assessment", label: "Clinical Assessment", weight: 20 },
  { key: "drp", label: "Drug Related Problems", weight: 20 },
  { key: "evaluasi", label: "Evaluation of Therapy", weight: 20 },
  { key: "rencana", label: "Pharmacotherapy Plan", weight: 20 },
  { key: "monitoring", label: "Monitoring", weight: 10 },
  { key: "edukasi", label: "Patient Education", weight: 5 },
  { key: "refleksi", label: "Clinical Reflection", weight: 5 },
];

/* ---------- tujuan migrasi backend (Supabase/Firebase) ----------
   Ganti implementasi get/save di bawah dengan pemanggilan API.
   Struktur dokumen per mahasiswa:
     students/{nim}
     students/{nim}/answers/{caseId}
     students/{nim}/finalReflection
----------------------------------------------------------------- */
export const backend = {
  async syncAll(student: Student) {
    const payload = {
      student,
      answers: Object.fromEntries(CASES.map((c) => [c.id, getAnswers(c.id)])),
      finalReflection: loadJSON(K.finalReflection, emptyFinalReflection),
      syncedAt: new Date().toISOString(),
    };
    // TODO: kirim `payload` ke Supabase/Firebase di sini.
    return payload;
  },
};

export function formatDate(d?: string) {
  if (!d) return "-";
  try {
    return new Date(d).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return d;
  }
}

export function uid() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
}
