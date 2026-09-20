import { useMemo } from "react";
import {
  Database,
  FileDown,
  GraduationCap,
  Info,
  ListTree,
  Percent,
  RotateCcw,
  Scale,
} from "lucide-react";
import { Btn, Card, Pill, Progress, TextInput } from "../components/ui";
import { DEFAULT_RUBRIC, K, allSummaries, progressOf, saveJSON, usePersistent } from "../lib/store";
import type { RubricItem } from "../types";
import { downloadTemplate } from "../lib/docx";
import { nav } from "../lib/router";

const QUESTION_STRUCTURE = [
  { bagian: "Identitas Pasien", jenis: "Data kasus", item: "13 field profil (sesuai dokumen)" },
  { bagian: "Keluhan Utama & Riwayat", jenis: "Data kasus", item: "Keluhan utama, RPS, RPD, RP keluarga" },
  { bagian: "Data Klinis", jenis: "Data kasus", item: "Tabel serial 5 hari + grafik TD/Nadi/RR/SpO₂" },
  { bagian: "Laboratorium", jenis: "Interpretasi mahasiswa", item: "Textarea interpretasi per parameter + indikator rentang otomatis" },
  { bagian: "Pemeriksaan Penunjang", jenis: "Interpretasi mahasiswa", item: "Clinical findings + makna klinis per pemeriksaan" },
  { bagian: "Terapi Obat", jenis: "Analisis mahasiswa", item: "5 pertanyaan per obat (indikasi, regimen, masalah, monitoring, efek samping)" },
  { bagian: "Analisis Kasus", jenis: "Analisis mahasiswa", item: "Masalah pasien, assessment, evaluasi terapi per obat (4 pilihan + alasan)" },
  { bagian: "DRP", jenis: "Tabel dinamis", item: "Kategori, masalah, bukti, penyebab, dampak, prioritas" },
  { bagian: "Rencana Farmakoterapi", jenis: "Tabel dinamis", item: "9 kolom: masalah→monitoring" },
  { bagian: "Monitoring Plan", jenis: "Tabel dinamis", item: "Kategori efektivitas/keamanan/lab/vital/gejala/adherence" },
  { bagian: "Edukasi & SOAP", jenis: "Analisis mahasiswa", item: "6 poin counseling + SOAP note + referensi evidence" },
  { bagian: "Kesimpulan & Refleksi", jenis: "Analisis mahasiswa", item: "Kesimpulan farmakoterapi + 3 pertanyaan refleksi" },
];

export default function Lecturer() {
  const [rubric, setRubric] = usePersistent<RubricItem[]>(K.rubric, DEFAULT_RUBRIC);
  const summaries = useMemo(() => allSummaries(), []);
  const total = rubric.reduce((acc, r) => acc + (Number(r.weight) || 0), 0);

  const setWeight = (key: string, w: string) => {
    const next = rubric.map((r) => (r.key === key ? { ...r, weight: Number(w.replace(/[^0-9]/g, "")) || 0 } : r));
    setRubric(next);
    saveJSON(K.rubric, next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-clinical-600 dark:text-clinical-400">Lecturer / Instructor Mode</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl dark:text-navy-50">Dashboard Pengajar</h1>
          <p className="mt-1 max-w-2xl text-sm text-navy-500 dark:text-navy-300">
            Struktur pertanyaan tiap kasus, rubrik penilaian yang dapat dikonfigurasi, template laporan, dan ringkasan progress
            mahasiswa yang tersimpan pada perangkat ini.
          </p>
        </div>
        <Btn variant="secondary" onClick={() => downloadTemplate()}>
          <FileDown size={15} /> Template Laporan (.docx)
        </Btn>
      </div>

      {/* rubrik */}
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-clinical-100 text-clinical-700 dark:bg-clinical-500/15 dark:text-clinical-300">
              <Scale size={18} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-navy-900 dark:text-navy-50">Rubrik Penilaian</h2>
              <p className="text-xs text-navy-400">Bobot dapat dikonfigurasi; penilaian klinis tetap dilakukan dosen — tanpa auto-scoring berbasis keyword.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Pill tone={total === 100 ? "green" : "red"}>
              <Percent size={11} /> Total {total}%
            </Pill>
            <Btn size="sm" variant="ghost" onClick={() => setRubric(DEFAULT_RUBRIC)}>
              <RotateCcw size={13} /> Default
            </Btn>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {rubric.map((r) => (
            <div key={r.key} className="flex items-center gap-3 rounded-xl border border-navy-100 p-3 dark:border-white/[0.07]">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-navy-800 dark:text-navy-100">{r.label}</p>
                <Progress value={r.weight} className="mt-1.5" />
              </div>
              <div className="flex items-center gap-1">
                <TextInput
                  value={String(r.weight)}
                  onChange={(e) => setWeight(r.key, e.target.value)}
                  className="num !w-16 !px-2 text-center"
                  aria-label={`Bobot ${r.label}`}
                />
                <span className="text-xs font-bold text-navy-400">%</span>
              </div>
            </div>
          ))}
        </div>
        {total !== 100 && (
          <p className="mt-3 text-xs font-semibold text-red-500">Total bobot harus 100% agar rubrik valid.</p>
        )}
      </Card>

      {/* struktur pertanyaan */}
      <Card className="!p-0 overflow-hidden">
        <div className="flex items-center gap-3 border-b border-navy-100 bg-navy-50/70 px-5 py-4 dark:border-white/[0.06] dark:bg-white/[0.03]">
          <ListTree size={17} className="text-clinical-600 dark:text-clinical-400" />
          <h2 className="text-sm font-extrabold text-navy-900 dark:text-navy-50">Struktur Pertanyaan per Kasus (berlaku untuk seluruh 5 kasus)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="bg-navy-50/80 text-left dark:bg-white/[0.03]">
                <th className="px-5 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-navy-500 dark:text-navy-300">Bagian</th>
                <th className="px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-navy-500 dark:text-navy-300">Jenis</th>
                <th className="px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-navy-500 dark:text-navy-300">Item Analisis</th>
              </tr>
            </thead>
            <tbody>
              {QUESTION_STRUCTURE.map((q, i) => (
                <tr key={i} className="border-t border-navy-100/60 dark:border-white/[0.05]">
                  <td className="px-5 py-2.5 font-bold text-navy-800 dark:text-navy-100">{i + 1}. {q.bagian}</td>
                  <td className="px-4 py-2.5"><Pill tone={q.jenis === "Data kasus" ? "gray" : q.jenis === "Tabel dinamis" ? "violet" : "teal"}>{q.jenis}</Pill></td>
                  <td className="px-4 py-2.5 text-navy-600 dark:text-navy-300">{q.item}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* kasus & progress lokal */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-navy-900 dark:text-navy-50">
            <GraduationCap size={16} className="text-clinical-600 dark:text-clinical-400" /> Daftar Kasus & Kelengkapan Objektif
          </h2>
          <div className="space-y-3">
            {summaries.map(({ c, a, percent, status }) => (
              <button
                key={c.id}
                onClick={() => nav(`/kasus/${c.id}`)}
                className="w-full cursor-pointer rounded-xl border border-navy-100 p-3 text-left transition hover:border-clinical-300 dark:border-white/[0.07] dark:hover:border-clinical-500/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-navy-800 dark:text-navy-100">
                    <span className="num mr-1.5 text-clinical-600">#{c.number}</span> {c.title}
                  </p>
                  <Pill tone={status === "selesai" ? "green" : status === "proses" ? "amber" : "gray"}>{status === "selesai" ? "Selesai" : status === "proses" ? "Proses" : "Belum"}</Pill>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Progress value={progressOf(c, a).percent} className="flex-1" />
                  <span className="num text-xs font-bold text-navy-400">{percent}%</span>
                </div>
                <p className="mt-1.5 text-[11px] text-navy-400">
                  {a.drps.length} DRP · {a.plans.length} rencana · {a.monitors.length} monitoring · {a.references.length} referensi
                </p>
              </button>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-navy-400">
            Kelengkapan objektif dihitung dari terisi/tidaknya kolom jawaban — bukan penilaian kebenaran klinis.
          </p>
        </Card>

        {/* backend readiness */}
        <Card className="flex flex-col">
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-navy-900 dark:text-navy-50">
            <Database size={16} className="text-clinical-600 dark:text-clinical-400" /> Kesiapan Backend (Supabase / Firebase)
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-navy-500 dark:text-navy-300">
            Versi saat ini bersifat <strong>local-first</strong>: seluruh data tersimpan di browser mahasiswa. Struktur penyimpanan
            sudah dipisah per entitas sehingga siap dihubungkan ke backend multi-user:
          </p>
          <div className="num mt-3 rounded-xl bg-navy-900 p-4 text-[12px] leading-relaxed text-clinical-200 dark:bg-black/40">
            {`students/{nim}
  ├── identitas { nama, kelas, kelompok, … }
  ├── answers/{caseId} → labInterp, examInterp,
  │     medAnalysis, drps, plans, monitors,
  │     education, soap, kesimpulan, refleksi
  └── finalReflection`}
          </div>
          <ul className="mt-3 space-y-1.5 text-sm text-navy-600 dark:text-navy-300">
            <li className="flex gap-2"><Info size={14} className="mt-0.5 shrink-0 text-clinical-500" /> Adapter tersedia di <span className="num text-xs">src/lib/store.ts → backend.syncAll()</span></li>
            <li className="flex gap-2"><Info size={14} className="mt-0.5 shrink-0 text-clinical-500" /> Data kasus terpisah dari komponen di <span className="num text-xs">src/data/cases.ts</span> — dosen dapat mengganti sumber data tanpa mengubah UI.</li>
            <li className="flex gap-2"><Info size={14} className="mt-0.5 shrink-0 text-clinical-500" /> Export jawaban mahasiswa saat ini melalui laporan Word per kasus / portfolio.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
