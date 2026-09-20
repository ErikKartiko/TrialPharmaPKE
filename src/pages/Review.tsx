import { useMemo } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  FileDown,
  Flag,
  PencilLine,
} from "lucide-react";
import { nav } from "../lib/router";
import { K, progressOf, useCaseAnswers, usePersistent, validateCase } from "../lib/store";
import type { CaseData, Student } from "../types";
import { EVAL_OPTIONS } from "../types";
import { Btn, Card, FlagBadge, Pill, Progress, labFlag } from "../components/ui";
import { downloadCaseReport } from "../lib/docx";
import { cn } from "../utils/cn";

const SECTION_INDEX: Record<string, number> = {
  pasien: 0, keluhan: 1, riwayat: 2, klinis: 3, lab: 4, penunjang: 5, terapi: 6,
  analisis: 7, drp: 8, rencana: 9, monitoring: 10, edukasi: 11, kesimpulan: 12,
};

function RepBlock({ title, children, onEdit }: { title: string; children: React.ReactNode; onEdit?: () => void }) {
  return (
    <section className="mt-8 border-t border-navy-800/10 pt-5 first:mt-0 first:border-0 dark:border-white/10">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-navy-900 dark:text-navy-50">{title}</h2>
        {onEdit && (
          <button onClick={onEdit} className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-navy-200 px-2.5 py-1 text-[11px] font-bold text-navy-500 transition hover:border-clinical-400 hover:text-clinical-600 dark:border-white/15 dark:text-navy-300 dark:hover:text-clinical-300">
            <PencilLine size={11} /> Edit Jawaban
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function MiniTable({ headers, rows }: { headers: string[]; rows: (string | undefined)[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-navy-100 dark:border-white/[0.07]">
      <table className="w-full min-w-[640px] text-[13px]">
        <thead>
          <tr className="bg-navy-50 text-left dark:bg-white/[0.04]">
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 font-bold text-navy-600 dark:text-navy-300">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-navy-100/60 align-top dark:border-white/[0.05]">
              {r.map((cellv, j) => (
                <td key={j} className="whitespace-pre-wrap px-3 py-2 text-navy-700 dark:text-navy-200">{cellv?.trim() ? cellv : <span className="text-navy-300">—</span>}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Review({ caseData }: { caseData: CaseData }) {
  const { answers: a, update } = useCaseAnswers(caseData.id);
  const [student] = usePersistent<Student | null>(K.student, null);
  const { percent } = progressOf(caseData, a);
  const missing = useMemo(() => validateCase(student, caseData, a), [student, caseData, a]);
  const goSection = (k: string) => nav(`/kasus/${caseData.id}/${SECTION_INDEX[k] ?? 0}`);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <button onClick={() => nav(`/kasus/${caseData.id}`)} className="mb-1 inline-flex cursor-pointer items-center gap-1 text-xs font-bold text-navy-400 transition hover:text-clinical-600 dark:hover:text-clinical-300">
            <ArrowLeft size={12} /> Kembali ke kasus
          </button>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy-900 dark:text-navy-50">Review Jawaban</h1>
          <p className="text-sm text-navy-500 dark:text-navy-300">Kasus {caseData.number}: {caseData.title} · progress {percent}%</p>
        </div>
        <div className="flex gap-2">
          {a.finished ? (
            <Pill tone="green" className="!px-3 !py-1.5 !text-xs">
              <BadgeCheck size={13} /> Sudah difinalisasi
            </Pill>
          ) : null}
          <Btn variant="teal" onClick={() => downloadCaseReport(caseData, a, student)}>
            <FileDown size={15} /> Download Word
          </Btn>
        </div>
      </div>

      {/* validation banner */}
      <Card className={cn("border-l-4", missing.length === 0 ? "!border-l-emerald-500" : "!border-l-amber-500")}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="flex items-center gap-2 text-base font-extrabold text-navy-900 dark:text-navy-50">
              {missing.length === 0 ? <CheckCircle2 size={18} className="text-emerald-500" /> : <AlertTriangle size={18} className="text-amber-500" />}
              {missing.length === 0 ? "Semua bagian wajib sudah lengkap." : "Masih terdapat bagian yang belum lengkap."}
            </h3>
            {missing.length > 0 && (
              <ul className="mt-2.5 space-y-1">
                {missing.map((m) => (
                  <li key={m} className="flex items-center gap-2 text-sm text-navy-600 dark:text-navy-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> {m}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-xs text-navy-400">Jawaban yang sudah diisi tidak akan terhapus — Anda dapat kembali mengedit kapan saja.</p>
          </div>
          <div className="w-full sm:w-64">
            <Progress value={percent} />
            <p className="num mt-1 text-right text-xs font-bold text-navy-400">{percent}% lengkap</p>
            {!a.finished ? (
              <Btn
                className="mt-3 w-full"
                disabled={missing.length > 0}
                onClick={() => update((x) => ({ ...x, finished: true }))}
              >
                <Flag size={14} /> Finalisasi Kasus
              </Btn>
            ) : (
              <Btn variant="secondary" className="mt-3 w-full" onClick={() => update((x) => ({ ...x, finished: false }))}>
                Buka kembali (batalkan finalisasi)
              </Btn>
            )}
          </div>
        </div>
      </Card>

      {/* report preview */}
      <div className="report-paper card-surface overflow-hidden !p-0">
        <div className="border-b border-navy-100 bg-navy-800 px-6 py-4 text-white dark:border-white/10">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-clinical-300">Pratinjau Laporan Word</p>
          <p className="mt-1 text-lg font-bold">Laporan Analisis Kasus — {caseData.title}</p>
          <p className="text-xs text-navy-200">{student?.nama || "—"} · NIM {student?.nim || "—"} · Kelas {student?.kelas || "—"} · {student?.kelompok || "—"}</p>
        </div>
        <div className="px-6 py-6 sm:px-10">
          <RepBlock title="Bab 1 — Profil Pasien" onEdit={() => goSection("pasien")}>
            <MiniTable headers={["Field", "Data"]} rows={caseData.profile.map((p) => [p.label, p.value])} />
          </RepBlock>

          <RepBlock title="Bab 3 — Interpretasi Laboratorium" onEdit={() => goSection("lab")}>
            {caseData.labs.map((g, gi) => (
              <div key={gi} className="mb-4">
                <p className="mb-2 text-sm font-bold text-navy-700 dark:text-navy-200">{g.title} — {g.date}</p>
                <MiniTable
                  headers={["Parameter", "Nilai", "Ref", "Status", "Interpretasi"]}
                  rows={g.items.map((it, ii) => [
                    it.param,
                    `${it.value} ${it.unit}`,
                    it.ref,
                    undefined,
                    a.labInterp[`${gi}-${ii}`],
                  ])}
                />
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {g.items.map((it, ii) => {
                    const f = labFlag(it.num, it.refMin, it.refMax);
                    return f === "high" || f === "low" ? <FlagBadge key={ii} flag={f} /> : null;
                  })}
                </div>
              </div>
            ))}
          </RepBlock>

          <RepBlock title="Bab 5 — Analisis Terapi Obat" onEdit={() => goSection("terapi")}>
            <MiniTable
              headers={["Obat", "Indikasi pada pasien", "Kesesuaian regimen", "Potensi masalah", "Monitoring", "Efek samping"]}
              rows={caseData.medications.map((m, i) => [
                m.name,
                a.medAnalysis[i]?.indikasi,
                a.medAnalysis[i]?.regimen,
                a.medAnalysis[i]?.masalah,
                a.medAnalysis[i]?.monitoring,
                a.medAnalysis[i]?.efekSamping,
              ])}
            />
          </RepBlock>

          <RepBlock title="Bab 6 — Analisis Masalah" onEdit={() => goSection("analisis")}>
            <p className="text-sm font-bold text-navy-700 dark:text-navy-200">Identifikasi masalah klinis</p>
            <p className="mb-3 whitespace-pre-wrap text-sm leading-relaxed text-navy-700 dark:text-navy-200">{a.masalah || "—"}</p>
            <p className="text-sm font-bold text-navy-700 dark:text-navy-200">Assessment</p>
            <p className="mb-3 whitespace-pre-wrap text-sm leading-relaxed text-navy-700 dark:text-navy-200">{a.assessment || "—"}</p>
            <p className="mb-2 text-sm font-bold text-navy-700 dark:text-navy-200">Evaluasi terapi per obat</p>
            <MiniTable
              headers={["Obat", "Penilaian", "Alasan"]}
              rows={caseData.medications.map((m, i) => [
                m.name,
                EVAL_OPTIONS.find((o) => o.value === a.medEval[i]?.status)?.label,
                a.medEval[i]?.alasan,
              ])}
            />
          </RepBlock>

          <RepBlock title="Bab 7 — Drug Related Problems" onEdit={() => goSection("drp")}>
            <MiniTable
              headers={["No", "Kategori", "Masalah", "Bukti", "Penyebab", "Dampak", "Prioritas"]}
              rows={a.drps.map((d, i) => [String(i + 1), d.kategori, d.masalah, d.bukti, d.penyebab, d.dampak, d.prioritas])}
            />
          </RepBlock>

          <RepBlock title="Bab 8 — Rencana Farmakoterapi" onEdit={() => goSection("rencana")}>
            <MiniTable
              headers={["Masalah", "Tujuan & Target", "Pilihan Terapi", "Regimen", "Alasan", "Durasi", "Monitoring"]}
              rows={a.plans.map((p) => [p.masalah, `${p.tujuan}\nTarget: ${p.target}`, p.pilihan, p.regimen, p.alasan, p.durasi, p.monitoring])}
            />
          </RepBlock>

          <RepBlock title="Bab 9 — Monitoring Plan" onEdit={() => goSection("monitoring")}>
            <MiniTable
              headers={["Kategori", "Parameter", "Baseline", "Target", "Frekuensi", "Metode", "Tindakan"]}
              rows={a.monitors.map((m) => [m.kategori, m.parameter, m.baseline, m.target, m.frekuensi, m.metode, m.tindakan])}
            />
          </RepBlock>

          <RepBlock title="Bab 10–13 — Edukasi, SOAP, Kesimpulan & Refleksi" onEdit={() => goSection("edukasi")}>
            <MiniTable
              headers={["Aspek Edukasi", "Jawaban"]}
              rows={[
                ["Informasi untuk pasien", a.education.informasi],
                ["Cara penggunaan obat", a.education.cara],
                ["Efek samping penting", a.education.efekSamping],
                ["Kapan kembali ke faskes", a.education.kembali],
                ["Modifikasi gaya hidup", a.education.gayaHidup],
                ["Tanda bahaya", a.education.tandaBahaya],
              ]}
            />
            {a.soap.include && a.soap.s && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-bold text-navy-700 dark:text-navy-200">SOAP Note</p>
                <MiniTable headers={["Komponen", "Isi"]} rows={[["S — Subjective", a.soap.s], ["O — Objective", a.soap.o], ["A — Assessment", a.soap.a], ["P — Plan", a.soap.p]]} />
              </div>
            )}
            <p className="mt-4 text-sm font-bold text-navy-700 dark:text-navy-200">Kesimpulan farmakoterapi</p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-navy-700 dark:text-navy-200">{a.kesimpulan || "—"}</p>
            <p className="mt-4 text-sm font-bold text-navy-700 dark:text-navy-200">Refleksi pembelajaran</p>
            <MiniTable
              headers={["Pertanyaan", "Refleksi"]}
              rows={[
                ["Hal terpenting yang dipelajari", a.refleksi.dipelajari],
                ["Bagian paling sulit dianalisis", a.refleksi.tersulit],
                ["Data tambahan yang diperlukan", a.refleksi.dataTambahan],
              ]}
            />
          </RepBlock>

          {a.references.some((r) => r.judul.trim()) && (
            <RepBlock title="Daftar Pustaka">
              <ol className="list-decimal space-y-1 pl-5 text-sm text-navy-700 dark:text-navy-200">
                {a.references.filter((r) => r.judul.trim()).map((r) => (
                  <li key={r.id}>
                    {r.judul} {r.tahun && `(${r.tahun})`} {r.link && `— ${r.link}`}
                    {r.alasan && <span className="block text-xs italic text-navy-400">Alasan: {r.alasan}</span>}
                  </li>
                ))}
              </ol>
            </RepBlock>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-3">
        <Btn variant="secondary" onClick={() => nav(`/kasus/${caseData.id}/12`)}>
          <PencilLine size={14} /> Edit Jawaban
        </Btn>
        <div className="flex gap-2">
          {!a.finished && (
            <Btn disabled={missing.length > 0} onClick={() => update((x) => ({ ...x, finished: true }))}>
              <Flag size={14} /> Finalisasi
            </Btn>
          )}
          <Btn variant="teal" onClick={() => downloadCaseReport(caseData, a, student)}>
            <FileDown size={14} /> Download Word (.docx)
          </Btn>
        </div>
      </div>
    </div>
  );
}
