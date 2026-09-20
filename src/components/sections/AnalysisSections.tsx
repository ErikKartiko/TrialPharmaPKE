import { useState } from "react";
import {
  BookOpen,
  BrainCircuit,
  CheckSquare,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Layers,
  ListChecks,
  MonitorDot,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import type { CaseAnswers, CaseData, DRPRow, MonitorRow, PlanRow, RefItem } from "../../types";
import { DRP_CATEGORIES, EVAL_OPTIONS, MONITOR_CATEGORIES } from "../../types";
import { uid } from "../../lib/store";
import { Btn, Card, Field, Pill, SectionHead, SelectInput, TextArea, TextInput } from "../ui";
import { cn } from "../../utils/cn";

type Updater = (fn: (a: CaseAnswers) => CaseAnswers) => void;
interface Sec {
  c: CaseData;
  a: CaseAnswers;
  update: Updater;
}

/* ═══════════════ 8. ANALISIS KASUS ═══════════════ */

export function AnalysisSection({ c, a, update }: Sec) {
  return (
    <div>
      <SectionHead
        icon={<BrainCircuit size={20} />}
        step="Bagian 8 · Clinical Reasoning"
        title="Analisis Kasus"
        desc="Alur berpikir klinis terstruktur: masalah pasien → assessment → evaluasi terapi obat."
      />

      <div className="space-y-4">
        <Card className="border-l-4 !border-l-clinical-500">
          <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-clinical-600 dark:text-clinical-400">
            <span className="num flex h-6 w-6 items-center justify-center rounded-full bg-clinical-600 text-[11px] text-white">1</span>
            Step 1 — Identifikasi Masalah Pasien
          </p>
          <Field label="Apa saja masalah klinis utama pasien?" hint="Daftar masalah medis aktif, faktor risiko, dan kondisi yang perlu ditangani." className="mt-3">
            <TextArea value={a.masalah} onChange={(e) => update((x) => ({ ...x, masalah: e.target.value }))} placeholder="cth: 1) Stroke iskemik akut … 2) Hipertensi tidak terkontrol…" />
          </Field>
        </Card>

        <Card className="border-l-4 !border-l-navy-500">
          <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-navy-600 dark:text-navy-300">
            <span className="num flex h-6 w-6 items-center justify-center rounded-full bg-navy-700 text-[11px] text-white">2</span>
            Step 2 — Assessment
          </p>
          <Field
            label="Bagaimana kondisi klinis pasien berdasarkan data subjektif, objektif, laboratorium, dan pemeriksaan penunjang?"
            hint="Sintesis seluruh data: tingkat keparahan, stabilitas, fungsi organ, dan target yang belum tercapai."
            className="mt-3"
          >
            <TextArea value={a.assessment} onChange={(e) => update((x) => ({ ...x, assessment: e.target.value }))} className="!min-h-[150px]" />
          </Field>
        </Card>

        <Card className="border-l-4 !border-l-violet-500">
          <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-400">
            <span className="num flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-[11px] text-white">4</span>
            Step 4 — Evaluasi Terapi
          </p>
          <p className="mt-2 text-sm text-navy-500 dark:text-navy-300">
            Untuk setiap obat: <strong>apakah terapi sudah tepat?</strong> Lalu jelaskan alasannya. (Identifikasi DRP rinci dikerjakan pada bagian berikutnya.)
          </p>
          <div className="mt-4 space-y-3">
            {c.medications.map((m, i) => {
              const ev = a.medEval[i] ?? { status: "", alasan: "" };
              return (
                <div key={i} className="rounded-xl border border-navy-100 p-4 dark:border-white/[0.07]">
                  <p className="text-sm font-bold text-navy-900 dark:text-navy-50">
                    {i + 1}. {m.name} <span className="num text-xs font-semibold text-navy-400">· {m.dose} {m.freq} {m.route !== "—" ? `(${m.route})` : ""}</span>
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5" role="radiogroup" aria-label={`Evaluasi ${m.name}`}>
                    {EVAL_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => update((x) => ({ ...x, medEval: { ...x.medEval, [i]: { ...(x.medEval[i] ?? { status: "", alasan: "" }), status: o.value } } }))}
                        className={cn(
                          "cursor-pointer rounded-full border px-3 py-1.5 text-[11px] font-bold transition",
                          ev.status === o.value
                            ? "border-clinical-500 bg-clinical-600 text-white"
                            : "border-navy-200 text-navy-500 hover:border-clinical-400 hover:text-clinical-600 dark:border-white/15 dark:text-navy-300"
                        )}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                  <TextArea
                    value={ev.alasan}
                    onChange={(e) => update((x) => ({ ...x, medEval: { ...x.medEval, [i]: { ...(x.medEval[i] ?? { status: "", alasan: "" }), alasan: e.target.value } } }))}
                    placeholder="Jelaskan alasan penilaian Anda…"
                    className="mt-3 !min-h-[64px] !text-xs"
                  />
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════ 9. DRP ═══════════════ */

const blankDRP = (): DRPRow => ({ id: uid(), kategori: "", masalah: "", bukti: "", penyebab: "", dampak: "", prioritas: "" });

export function DRPSection({ a, update }: Sec) {
  const add = () => update((x) => ({ ...x, drps: [...x.drps, blankDRP()] }));
  const set = (id: string, k: keyof DRPRow, v: string) =>
    update((x) => ({ ...x, drps: x.drps.map((d) => (d.id === id ? { ...d, [k]: v } : d)) }));
  const del = (id: string) => update((x) => ({ ...x, drps: x.drps.filter((d) => d.id !== id) }));

  return (
    <div>
      <SectionHead
        icon={<ListChecks size={20} />}
        step="Bagian 9 · Step 3 — Identifikasi DRP"
        title="Drug Related Problems"
        desc="Identifikasi masalah terkait obat beserta bukti klinis, penyebab, dampak, dan prioritas penanganan."
        action={
          <Btn size="sm" variant="teal" onClick={add}>
            <Plus size={14} /> Tambah DRP
          </Btn>
        }
      />

      {a.drps.length === 0 ? (
        <Card className="py-10 text-center">
          <p className="font-serif italic text-navy-400 dark:text-navy-300">Belum ada DRP yang diidentifikasi.</p>
          <Btn variant="teal" className="mt-4" onClick={add}>
            <Plus size={15} /> Tambah DRP pertama
          </Btn>
        </Card>
      ) : (
        <div className="space-y-4">
          {a.drps.map((d, i) => (
            <Card key={d.id} className="relative">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-sm font-extrabold text-navy-900 dark:text-navy-50">
                  <span className="num flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-xs font-extrabold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                    {i + 1}
                  </span>
                  DRP #{i + 1}
                  {d.prioritas && <Pill tone={d.prioritas === "Tinggi" ? "red" : d.prioritas === "Sedang" ? "amber" : "gray"}>Prioritas {d.prioritas}</Pill>}
                </p>
                <Btn variant="danger" size="sm" onClick={() => del(d.id)} aria-label="Hapus DRP">
                  <Trash2 size={13} /> Hapus
                </Btn>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Kategori DRP">
                  <SelectInput value={d.kategori} onChange={(e) => set(d.id, "kategori", e.target.value)}>
                    <option value="">— pilih kategori —</option>
                    {DRP_CATEGORIES.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="Prioritas">
                  <SelectInput value={d.prioritas} onChange={(e) => set(d.id, "prioritas", e.target.value)}>
                    <option value="">— pilih —</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Rendah">Rendah</option>
                  </SelectInput>
                </Field>
                <Field label="Masalah terkait obat" className="xl:col-span-1 md:col-span-2">
                  <TextInput value={d.masalah} onChange={(e) => set(d.id, "masalah", e.target.value)} placeholder="cth: TD belum mencapai target" />
                </Field>
                <Field label="Bukti klinis" className="md:col-span-2">
                  <TextArea value={d.bukti} onChange={(e) => set(d.id, "bukti", e.target.value)} className="!min-h-[64px] !text-xs" placeholder="cth: TD hari 1–3 masih 160–180/90–100 mmHg…" />
                </Field>
                <Field label="Penyebab">
                  <TextArea value={d.penyebab} onChange={(e) => set(d.id, "penyebab", e.target.value)} className="!min-h-[64px] !text-xs" />
                </Field>
                <Field label="Dampak klinis">
                  <TextArea value={d.dampak} onChange={(e) => set(d.id, "dampak", e.target.value)} className="!min-h-[64px] !text-xs" />
                </Field>
              </div>
            </Card>
          ))}
          <Btn variant="secondary" onClick={add} className="w-full border-dashed">
            <Plus size={15} /> Tambah DRP
          </Btn>
        </div>
      )}
    </div>
  );
}

/* ═══════════════ 10. RENCANA FARMAKOTERAPI ═══════════════ */

const blankPlan = (): PlanRow => ({
  id: uid(),
  masalah: "",
  tujuan: "",
  target: "",
  pilihan: "",
  regimen: "",
  alasan: "",
  alternatif: "",
  durasi: "",
  monitoring: "",
});

export function PlanSection({ a, update }: Sec) {
  const add = () => update((x) => ({ ...x, plans: [...x.plans, blankPlan()] }));
  const set = (id: string, k: keyof PlanRow, v: string) =>
    update((x) => ({ ...x, plans: x.plans.map((p) => (p.id === id ? { ...p, [k]: v } : p)) }));
  const del = (id: string) => update((x) => ({ ...x, plans: x.plans.filter((p) => p.id !== id) }));

  const fields: { key: keyof PlanRow; label: string; wide?: boolean }[] = [
    { key: "masalah", label: "Masalah klinis" },
    { key: "tujuan", label: "Tujuan terapi" },
    { key: "target", label: "Target terapi" },
    { key: "pilihan", label: "Pilihan terapi", wide: true },
    { key: "regimen", label: "Regimen (dosis, rute, frekuensi)", wide: true },
    { key: "alasan", label: "Alasan pemilihan", wide: true },
    { key: "alternatif", label: "Alternatif terapi" },
    { key: "durasi", label: "Durasi terapi" },
    { key: "monitoring", label: "Parameter monitoring", wide: true },
  ];

  return (
    <div>
      <SectionHead
        icon={<ClipboardCheck size={20} />}
        step="Bagian 10 · Plan"
        title="Rencana Farmakoterapi"
        desc="Susun rencana terapi untuk tiap masalah klinis: tujuan, target, pilihan terapi dengan alasannya."
        action={
          <Btn size="sm" variant="teal" onClick={add}>
            <Plus size={14} /> Tambah Rencana
          </Btn>
        }
      />
      {a.plans.length === 0 ? (
        <Card className="py-10 text-center">
          <p className="font-serif italic text-navy-400 dark:text-navy-300">Belum ada rencana farmakoterapi.</p>
          <Btn variant="teal" className="mt-4" onClick={add}>
            <Plus size={15} /> Tambah rencana pertama
          </Btn>
        </Card>
      ) : (
        <div className="space-y-4">
          {a.plans.map((p, i) => (
            <Card key={p.id}>
              <div className="mb-4 flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-extrabold text-navy-900 dark:text-navy-50">
                  <span className="num flex h-7 w-7 items-center justify-center rounded-lg bg-clinical-100 text-xs font-extrabold text-clinical-700 dark:bg-clinical-500/15 dark:text-clinical-300">
                    {i + 1}
                  </span>
                  Rencana #{i + 1} {p.masalah && <span className="text-navy-400">— {p.masalah.slice(0, 60)}</span>}
                </p>
                <Btn variant="danger" size="sm" onClick={() => del(p.id)}>
                  <Trash2 size={13} />
                </Btn>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {fields.map((f) => (
                  <div key={f.key} className={cn(f.wide && "md:col-span-2 xl:col-span-3")}>
                    {f.wide ? (
                      <Field label={f.label}>
                        <TextArea value={p[f.key]} onChange={(e) => set(p.id, f.key, e.target.value)} className="!min-h-[60px] !text-xs" />
                      </Field>
                    ) : (
                      <Field label={f.label}>
                        <TextInput value={p[f.key]} onChange={(e) => set(p.id, f.key, e.target.value)} />
                      </Field>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
          <Btn variant="secondary" onClick={add} className="w-full border-dashed">
            <Plus size={15} /> Tambah Rencana
          </Btn>
        </div>
      )}
    </div>
  );
}

/* ═══════════════ 11. MONITORING PLAN ═══════════════ */

const blankMonitor = (): MonitorRow => ({ id: uid(), kategori: "", parameter: "", baseline: "", target: "", frekuensi: "", metode: "", tindakan: "" });

export function MonitoringSection({ a, update }: Sec) {
  const add = () => update((x) => ({ ...x, monitors: [...x.monitors, blankMonitor()] }));
  const set = (id: string, k: keyof MonitorRow, v: string) =>
    update((x) => ({ ...x, monitors: x.monitors.map((m) => (m.id === id ? { ...m, [k]: v } : m)) }));
  const del = (id: string) => update((x) => ({ ...x, monitors: x.monitors.filter((m) => m.id !== id) }));

  return (
    <div>
      <SectionHead
        icon={<MonitorDot size={20} />}
        step="Bagian 11 · Therapeutic Monitoring"
        title="Monitoring Plan"
        desc="Rencana pemantauan efektivitas dan keamanan terapi, lengkap dengan baseline, target, dan tindakan bila target tidak tercapai."
        action={
          <Btn size="sm" variant="teal" onClick={add}>
            <Plus size={14} /> Tambah Parameter
          </Btn>
        }
      />
      {a.monitors.length === 0 ? (
        <Card className="py-10 text-center">
          <p className="font-serif italic text-navy-400 dark:text-navy-300">Belum ada parameter monitoring.</p>
          <Btn variant="teal" className="mt-4" onClick={add}>
            <Plus size={15} /> Tambah parameter pertama
          </Btn>
        </Card>
      ) : (
        <>
          <Card className="!p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1020px] text-sm">
                <thead>
                  <tr className="bg-navy-800 text-left text-white dark:bg-white/[0.06]">
                    {["Kategori", "Parameter Monitoring", "Baseline", "Target", "Frekuensi", "Metode", "Tindakan jika tidak tercapai", ""].map((h, i) => (
                      <th key={i} className="px-3 py-3 text-[11px] font-extrabold uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {a.monitors.map((m) => (
                    <tr key={m.id} className="border-t border-navy-100/70 align-top dark:border-white/[0.05]">
                      <td className="w-40 px-3 py-2">
                        <SelectInput value={m.kategori} onChange={(e) => set(m.id, "kategori", e.target.value)} className="!text-xs">
                          <option value="">— pilih —</option>
                          {MONITOR_CATEGORIES.map((k) => (
                            <option key={k} value={k}>{k}</option>
                          ))}
                        </SelectInput>
                      </td>
                      {(["parameter", "baseline", "target", "frekuensi", "metode", "tindakan"] as (keyof MonitorRow)[]).map((k) => (
                        <td key={k} className="min-w-[120px] px-3 py-2">
                          <TextArea value={m[k]} onChange={(e) => set(m.id, k, e.target.value)} className="!min-h-[46px] !text-xs" placeholder={k === "tindakan" ? "Tindakan bila target tidak tercapai…" : "…"} />
                        </td>
                      ))}
                      <td className="px-3 py-2">
                        <Btn variant="danger" size="sm" onClick={() => del(m.id)} aria-label="Hapus baris">
                          <Trash2 size={13} />
                        </Btn>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Btn variant="secondary" onClick={add} className="mt-3 w-full border-dashed">
            <Plus size={15} /> Tambah Parameter
          </Btn>
        </>
      )}
    </div>
  );
}

/* ═══════════════ 12. EDUKASI + REFERENSI + SOAP ═══════════════ */

const EDU_FIELDS: { key: keyof CaseAnswers["education"]; q: string }[] = [
  { key: "informasi", q: "Informasi apa yang perlu diberikan kepada pasien?" },
  { key: "cara", q: "Bagaimana cara penggunaan obat?" },
  { key: "efekSamping", q: "Apa efek samping penting yang perlu diketahui?" },
  { key: "kembali", q: "Kapan pasien harus kembali ke fasilitas kesehatan?" },
  { key: "gayaHidup", q: "Apa modifikasi gaya hidup yang relevan?" },
  { key: "tandaBahaya", q: "Apa tanda bahaya yang perlu diketahui pasien?" },
];

export function EducationSection({ a, update }: Sec) {
  return (
    <div>
      <SectionHead
        icon={<GraduationCap size={20} />}
        step="Bagian 12 · Patient Counseling"
        title="Edukasi Pasien"
        desc="Susun konseling komprehensif untuk pasien dan keluarga."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {EDU_FIELDS.map((f, i) => (
          <Card key={f.key}>
            <p className="mb-2.5 flex items-start gap-2.5 text-sm font-bold leading-snug text-navy-800 dark:text-navy-100">
              <span className="num mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-clinical-100 text-[11px] font-extrabold text-clinical-700 dark:bg-clinical-500/15 dark:text-clinical-300">
                {i + 1}
              </span>
              {f.q}
            </p>
            <TextArea
              value={a.education[f.key]}
              onChange={(e) => update((x) => ({ ...x, education: { ...x.education, [f.key]: e.target.value } }))}
              className="!min-h-[90px]"
            />
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------- Referensi / Clinical Evidence ---------- */

export function ReferenceSection({ a, update }: { a: CaseAnswers; update: Updater }) {
  const add = () =>
    update((x) => ({ ...x, references: [...x.references, { id: uid(), judul: "", tahun: "", link: "", alasan: "" } as RefItem] }));
  const set = (id: string, k: keyof RefItem, v: string) =>
    update((x) => ({ ...x, references: x.references.map((r) => (r.id === id ? { ...r, [k]: v } : r)) }));
  const del = (id: string) => update((x) => ({ ...x, references: x.references.filter((r) => r.id !== id) }));

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <BookOpen size={18} className="text-clinical-600 dark:text-clinical-400" />
          <div>
            <h3 className="text-sm font-extrabold text-navy-900 dark:text-navy-50">Clinical Evidence / Reference</h3>
            <p className="text-xs text-navy-400 dark:text-navy-400">Guideline, jurnal, atau buku yang menjadi dasar analisis Anda — otomatis masuk daftar pustaka laporan.</p>
          </div>
        </div>
        <Btn size="sm" variant="secondary" onClick={add}>
          <Plus size={13} /> Tambah Referensi
        </Btn>
      </div>
      {a.references.length === 0 && <p className="text-sm italic text-navy-400">Belum ada referensi ditambahkan.</p>}
      <div className="space-y-3">
        {a.references.map((r, i) => (
          <div key={r.id} className="rounded-xl border border-navy-100 p-4 dark:border-white/[0.07]">
            <div className="mb-3 flex items-center justify-between">
              <p className="num text-xs font-extrabold text-navy-400">REFERENSI #{i + 1}</p>
              <button onClick={() => del(r.id)} aria-label="Hapus referensi" className="cursor-pointer rounded-md p-1.5 text-navy-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10">
                <X size={14} />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Judul / Reference">
                <TextInput value={r.judul} onChange={(e) => set(r.id, "judul", e.target.value)} placeholder="cth: AHA/ASA Guidelines for the Early Management of Stroke" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Tahun">
                  <TextInput value={r.tahun} onChange={(e) => set(r.id, "tahun", e.target.value)} placeholder="2021" />
                </Field>
                <Field label="Link / DOI">
                  <TextInput value={r.link} onChange={(e) => set(r.id, "link", e.target.value)} placeholder="doi.org/…" />
                </Field>
              </div>
              <Field label="Alasan penggunaan referensi" className="sm:col-span-2">
                <TextArea value={r.alasan} onChange={(e) => set(r.id, "alasan", e.target.value)} className="!min-h-[52px] !text-xs" />
              </Field>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------- SOAP NOTE generator ---------- */

export function SoapSection({ c, a, update }: Sec) {
  const [generated, setGenerated] = useState(false);
  const generate = () => {
    const s = c.complaint.map((p) => `- ${p}`).join("\n");
    const vit = c.clinical.rows
      .slice(0, 6)
      .map((r) => `${r.name}: ${r.values.map((v) => v ?? "-").join(" / ")} ${r.unit ?? ""}`.trim())
      .join("; ");
    const abnormalLabs = c.labs
      .flatMap((g) => g.items)
      .filter((it) => {
        if (it.num == null) return false;
        if (it.refMin != null && it.num < it.refMin) return true;
        if (it.refMax != null && it.num > it.refMax) return true;
        return false;
      })
      .map((it) => `${it.param} ${it.value} ${it.unit} (ref ${it.ref})`)
      .join("; ");
    const o = `Tanda vital serial — ${vit}.\nLaboratorium abnormal: ${abnormalLabs || "—"}.\nPenunjang: ${c.supporting.map((e) => `${e.type} (${e.date})`).join(", ") || "—"}.`;
    const plan = a.plans
      .filter((p) => p.pilihan.trim())
      .map((p, i) => `${i + 1}. ${p.masalah || "Masalah"}: ${p.pilihan} — ${p.regimen}. Monitoring: ${p.monitoring || "-"}`)
      .join("\n");
    const mon = a.monitors
      .filter((m) => m.parameter.trim())
      .map((m) => `- ${m.parameter} (${m.kategori || "umum"}): target ${m.target || "-"}, ${m.frekuensi || "-"}`)
      .join("\n");
    const p = `${plan || "(Isi Rencana Farmakoterapi terlebih dahulu untuk menyusun Plan otomatis.)"}${mon ? `\n\nMonitoring:\n${mon}` : ""}\n\nEdukasi pasien dan keluarga sesuai bagian Patient Counseling.`;
    update((x) => ({ ...x, soap: { ...x.soap, s, o, a: x.assessment, p, include: true } }));
    setGenerated(true);
  };

  const soapBox = (k: "s" | "o" | "a" | "p", label: string, hint: string) => (
    <Field label={label} hint={hint}>
      <TextArea
        value={a.soap[k]}
        onChange={(e) => update((x) => ({ ...x, soap: { ...x.soap, [k]: e.target.value } }))}
        className="!min-h-[110px] !text-[13px] leading-relaxed"
      />
    </Field>
  );

  return (
    <Card className="mt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <FileText size={18} className="text-clinical-600 dark:text-clinical-400" />
          <div>
            <h3 className="text-sm font-extrabold text-navy-900 dark:text-navy-50">Generate SOAP Note</h3>
            <p className="text-xs text-navy-400 dark:text-navy-400">
              S & O disusun dari data kasus; A & P diambil dari jawaban Anda — semua tetap dapat diedit.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-navy-500 dark:text-navy-300">
            <input
              type="checkbox"
              className="h-4 w-4 accent-teal-600"
              checked={a.soap.include}
              onChange={(e) => update((x) => ({ ...x, soap: { ...x.soap, include: e.target.checked } }))}
            />
            Sertakan di laporan Word
          </label>
          <Btn size="sm" variant="teal" onClick={generate}>
            <Sparkles size={14} /> {generated || a.soap.s ? "Perbarui dari jawaban" : "Generate SOAP"}
          </Btn>
        </div>
      </div>
      {a.soap.s ? (
        <div className="report-paper mt-4 grid gap-4 rounded-xl p-5 sm:grid-cols-2">
          {soapBox("s", "S — Subjective", "Auto: keluhan utama pasien dari dokumen kasus.")}
          {soapBox("o", "O — Objective", "Auto: ringkasan tanda vital, lab abnormal, dan penunjang.")}
          {soapBox("a", "A — Assessment", "Berasal dari jawaban Assessment Anda (bagian Analisis Kasus).")}
          {soapBox("p", "P — Plan", "Berasal dari Rencana Farmakoterapi & Monitoring Plan Anda.")}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-navy-200 p-6 text-center text-sm text-navy-400 dark:border-white/10 dark:text-navy-400">
          Tekan <strong>Generate SOAP</strong> untuk menyusun template S-O-A-P dari data kasus dan jawaban Anda, lalu lakukan preview di sini sebelum masuk laporan.
        </div>
      )}
    </Card>
  );
}

/* ═══════════════ 13. KESIMPULAN & REFLEKSI ═══════════════ */

export function ConclusionSection({ a, update }: Sec) {
  return (
    <div>
      <SectionHead
        icon={<CheckSquare size={20} />}
        step="Bagian 13 · Wrap-up"
        title="Kesimpulan & Clinical Reflection"
        desc="Simpulkan analisis farmakoterapi Anda dan refleksikan proses pembelajaran dari kasus ini."
      />
      <Card>
        <Field label="Berikan kesimpulan farmakoterapi pasien berdasarkan hasil analisis." hint="Wajib diisi — akan menjadi BAB 12 laporan Anda.">
          <TextArea value={a.kesimpulan} onChange={(e) => update((x) => ({ ...x, kesimpulan: e.target.value }))} className="!min-h-[140px]" />
        </Field>
      </Card>

      <Card className="mt-4">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-navy-900 dark:text-navy-50">
          <Layers size={16} className="text-clinical-600 dark:text-clinical-400" /> Clinical Reflection
        </h3>
        <div className="space-y-4">
          <Field label="Apa hal terpenting yang Anda pelajari dari kasus ini?">
            <TextArea value={a.refleksi.dipelajari} onChange={(e) => update((x) => ({ ...x, refleksi: { ...x.refleksi, dipelajari: e.target.value } }))} className="!min-h-[80px]" />
          </Field>
          <Field label="Apa bagian kasus yang paling sulit dianalisis?">
            <TextArea value={a.refleksi.tersulit} onChange={(e) => update((x) => ({ ...x, refleksi: { ...x.refleksi, tersulit: e.target.value } }))} className="!min-h-[80px]" />
          </Field>
          <Field label="Apa data tambahan yang Anda perlukan untuk membuat keputusan farmakoterapi yang lebih baik?">
            <TextArea value={a.refleksi.dataTambahan} onChange={(e) => update((x) => ({ ...x, refleksi: { ...x.refleksi, dataTambahan: e.target.value } }))} className="!min-h-[80px]" />
          </Field>
        </div>
      </Card>
    </div>
  );
}
