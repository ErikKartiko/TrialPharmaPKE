import { useMemo, useState } from "react";
import {
  Activity,
  Beaker,
  ChevronDown,
  FileScan,
  FlaskConical,
  History,
  LineChart as LineChartIcon,
  MessageSquareText,
  Pill as PillIcon,
  ScanHeart,
  Stethoscope,
  UserRound,
} from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CaseAnswers, CaseData, LabItem } from "../../types";
import { BookmarkTag, Card, Empty, Field, FlagBadge, Pill, SectionHead, TextArea, labFlag } from "../ui";
import { cn } from "../../utils/cn";

type Updater = (fn: (a: CaseAnswers) => CaseAnswers) => void;
interface Sec {
  c: CaseData;
  a: CaseAnswers;
  update: Updater;
}

/* ═══════════════ 1. IDENTITAS PASIEN ═══════════════ */

export function PatientSection({ c, update }: Sec) {
  return (
    <div>
      <SectionHead
        icon={<UserRound size={20} />}
        step="Bagian 1 · Data Pasien"
        title="Identitas Pasien"
        desc="Profil pasien sesuai dokumen kasus. Data yang tidak tercantum pada dokumen tidak ditampilkan."
      />
      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-navy-800 to-navy-700 p-4 text-white dark:from-clinical-800 dark:to-navy-800">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 font-serif text-xl font-bold">
              {c.profile[0]?.value?.slice(4, 6) ?? "Px"}
            </div>
            <div>
              <p className="text-base font-extrabold tracking-tight">{c.profile[0]?.value}</p>
              <p className="text-xs text-navy-200">{c.profile[1]?.value} · {c.profile[2]?.value}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Pill tone="teal" className="!bg-white/15 !text-white border border-white/20">{c.system}</Pill>
            <BookmarkTag label={`Diagnosis: ${c.diagnosis}`} bagian="Identitas Pasien" onAdd={(b) => update((x) => ({ ...x, bookmarks: [b, ...x.bookmarks] }))} />
          </div>
        </div>
        <dl className="grid gap-x-8 gap-y-0 sm:grid-cols-2">
          {c.profile.map((f, i) => (
            <div key={f.label} className={cn("flex gap-3 border-t border-navy-100/80 py-3 dark:border-white/[0.06]", i < 2 && "border-t-0")}>
              <dt className="w-[38%] shrink-0 text-xs font-bold uppercase tracking-wide text-navy-400 dark:text-navy-400">{f.label}</dt>
              <dd className="text-sm font-medium leading-relaxed text-navy-800 dark:text-navy-100">{f.value}</dd>
            </div>
          ))}
        </dl>
        {c.profile.length === 0 && <Empty title="Data tidak tersedia dalam kasus." />}
      </Card>
    </div>
  );
}

/* ═══════════════ 2. KELUHAN UTAMA ═══════════════ */

export function ComplaintSection({ c, update }: Sec) {
  return (
    <div>
      <SectionHead
        icon={<MessageSquareText size={20} />}
        step="Bagian 2 · Subjektif"
        title="Keluhan Utama"
        desc="Keluhan dan anamnesis singkat pasien — bahan untuk komponen S pada SOAP note."
      />
      <div className="space-y-3">
        {c.complaint.map((p, i) => (
          <Card key={i} className="flex items-start gap-4 !p-5">
            <span className="num mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-clinical-100 text-xs font-extrabold text-clinical-700 dark:bg-clinical-500/15 dark:text-clinical-300">
              {i + 1}
            </span>
            <p className="flex-1 text-sm leading-relaxed text-navy-700 dark:text-navy-100">{p}</p>
            <BookmarkTag small label={p.length > 90 ? p.slice(0, 90) + "…" : p} bagian="Keluhan Utama" onAdd={(b) => update((x) => ({ ...x, bookmarks: [b, ...x.bookmarks] }))} />
          </Card>
        ))}
        {c.complaint.length === 0 && <Empty title="Data tidak tersedia dalam kasus." />}
        <Card className="border-l-4 !border-l-clinical-500 bg-clinical-50/60 dark:bg-clinical-500/[0.07]">
          <p className="text-xs font-bold uppercase tracking-widest text-clinical-700 dark:text-clinical-300">Pertanyaan pemantik</p>
          <p className="mt-1.5 text-sm leading-relaxed text-navy-700 dark:text-navy-200">
            Keluhan mana yang merupakan gejala utama penyakit, dan apakah terdapat keluhan yang justru berpotensi merupakan
            masalah terkait obat (drug related problem)? Catat pada bagian Analisis Kasus dan DRP.
          </p>
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════ 3. RIWAYAT PENYAKIT ═══════════════ */

export function HistorySection({ c }: Sec) {
  return (
    <div>
      <SectionHead
        icon={<History size={20} />}
        step="Bagian 3 · Anamnesis"
        title="Riwayat Penyakit & Pengobatan"
        desc="Riwayat penyakit dahulu, sekarang, keluarga, dan perkembangan diagnosis selama perawatan."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {c.history.map((h, i) => (
          <Card key={i}>
            <h3 className="flex items-center gap-2 text-sm font-extrabold tracking-tight text-navy-900 dark:text-navy-50">
              <span className="h-2 w-2 rounded-full bg-clinical-500" />
              {h.title}
            </h3>
            <ul className="mt-3 space-y-2">
              {h.items.map((it, ii) => (
                <li key={ii} className="flex gap-2.5 text-sm leading-relaxed text-navy-600 dark:text-navy-200">
                  <span className="mt-[7px] h-1 w-4 shrink-0 rounded-full bg-navy-200 dark:bg-white/20" />
                  {it}
                </li>
              ))}
            </ul>
          </Card>
        ))}
        {c.history.length === 0 && <div className="lg:col-span-2"><Empty title="Data tidak tersedia dalam kasus." /></div>}
      </div>
    </div>
  );
}

/* ═══════════════ 4. DATA KLINIS (tabel + grafik) ═══════════════ */

function chartGroups(rows: CaseData["clinical"]["rows"]) {
  const pick = (kw: string[]) => rows.filter((r) => r.chart && kw.some((k) => r.name.toLowerCase().includes(k)));
  return [
    { title: "Tekanan Darah", unit: "mmHg", rows: pick(["sistol", "diastol"]) },
    { title: "Nadi", unit: "x/menit", rows: pick(["nadi"]) },
    { title: "Pernapasan & Saturasi", unit: "", rows: pick(["pernapasan", "spo"]) },
    { title: "Kesadaran (GCS)", unit: "", rows: pick(["gcs"]) },
  ].filter((g) => g.rows.length > 0);
}

export function ClinicalSection({ c }: Sec) {
  const [showChart, setShowChart] = useState(true);
  const groups = useMemo(() => chartGroups(c.clinical.rows), [c]);

  return (
    <div>
      <SectionHead
        icon={<Activity size={20} />}
        step="Bagian 4 · Objektif"
        title="Data Klinis Serial"
        desc="Parameter klinis harian selama perawatan — bahan untuk komponen O pada SOAP note."
        action={
          c.clinical.rows.some((r) => r.chart) && (
            <button
              onClick={() => setShowChart((s) => !s)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-navy-200 px-3 py-2 text-xs font-bold text-navy-600 transition hover:border-clinical-400 hover:text-clinical-600 dark:border-white/15 dark:text-navy-200 dark:hover:text-clinical-300"
            >
              <LineChartIcon size={14} /> {showChart ? "Sembunyikan grafik" : "Tampilkan grafik"}
            </button>
          )
        }
      />
      {c.clinical.rows.length === 0 ? (
        <Empty title="Data tidak tersedia dalam kasus." />
      ) : (
        <>
          <Card className="!p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="bg-navy-800 text-left text-white dark:bg-white/[0.06]">
                    <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wider">Parameter</th>
                    <th className="px-3 py-3 text-[11px] font-extrabold uppercase tracking-wider">Satuan</th>
                    {c.clinical.days.map((d) => (
                      <th key={d} className="num px-3 py-3 text-center text-[11px] font-extrabold uppercase tracking-wider">{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {c.clinical.rows.map((r, ri) => (
                    <tr key={ri} className={cn("border-t border-navy-100/70 dark:border-white/[0.05]", ri % 2 === 1 && "bg-navy-50/50 dark:bg-white/[0.02]")}>
                      <td className="px-4 py-2.5 font-semibold text-navy-800 dark:text-navy-100">
                        <span className="flex items-center gap-2">
                          {r.chart && <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: r.color }} />}
                          {r.name}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-navy-400 dark:text-navy-400">{r.unit ?? "—"}</td>
                      {r.values.map((v, vi) => (
                        <td key={vi} className="num px-3 py-2.5 text-center font-medium text-navy-700 dark:text-navy-200">
                          {v ?? <span className="text-navy-300">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {(c.clinical.notes ?? []).length > 0 && (
            <Card className="mt-4 border-l-4 !border-l-navy-400">
              <p className="text-xs font-bold uppercase tracking-widest text-navy-400">Catatan klinis</p>
              <ul className="mt-2 space-y-1.5">
                {c.clinical.notes!.map((n, i) => (
                  <li key={i} className="text-sm leading-relaxed text-navy-600 dark:text-navy-200">• {n}</li>
                ))}
              </ul>
            </Card>
          )}

          {showChart && groups.length > 0 && (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {groups.map((g) => {
                const data = c.clinical.days.map((d, i) => {
                  const point: Record<string, string | number> = { day: d };
                  g.rows.forEach((r) => {
                    const v = r.values[i];
                    if (typeof v === "number") point[r.name] = v;
                  });
                  return point;
                });
                return (
                  <Card key={g.title} className="!p-4">
                    <p className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-navy-500 dark:text-navy-300">
                      <LineChartIcon size={13} className="text-clinical-500" /> Grafik {g.title} {g.unit && <span className="text-navy-300">({g.unit})</span>}
                    </p>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -14 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,145,180,0.25)" />
                          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#7d90ad" }} stroke="rgba(120,145,180,0.4)" />
                          <YAxis tick={{ fontSize: 11, fill: "#7d90ad" }} stroke="rgba(120,145,180,0.4)" domain={["dataMin - 8", "dataMax + 8"]} />
                          <Tooltip
                            contentStyle={{ borderRadius: 12, border: "1px solid rgba(120,145,180,0.3)", fontSize: 12, fontWeight: 600 }}
                          />
                          <Legend wrapperStyle={{ fontSize: 11 }} />
                          {g.rows.map((r) => (
                            <Line
                              key={r.name}
                              type="monotone"
                              dataKey={r.name}
                              stroke={r.color ?? "#0fa79c"}
                              strokeWidth={2.4}
                              dot={{ r: 3.5, strokeWidth: 0 }}
                              activeDot={{ r: 5 }}
                            />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ═══════════════ 5. LABORATORIUM ═══════════════ */

function LabRowInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <TextArea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? "Interpretasi hasil laboratorium…"}
      className="!min-h-[68px] !text-xs"
    />
  );
}

export function LabSection({ c, a, update }: Sec) {
  const [open, setOpen] = useState(0);
  if (c.labs.length === 0) return <div><SectionHead icon={<FlaskConical size={20} />} step="Bagian 5 · Objektif" title="Data Laboratorium" /><Empty title="Data tidak tersedia dalam kasus." /></div>;

  return (
    <div>
      <SectionHead
        icon={<FlaskConical size={20} />}
        step="Bagian 5 · Objektif"
        title="Data Laboratorium"
        desc="Indikator status dihitung otomatis berdasarkan nilai dan rentang referensi pada dokumen kasus. Tulis interpretasi klinis Anda untuk tiap parameter relevan."
      />
      <div className="space-y-4">
        {c.labs.map((g, gi) => {
          const abnormal = g.items.filter((it) => {
            const f = labFlag(it.num, it.refMin, it.refMax);
            return f === "low" || f === "high";
          }).length;
          const filled = g.items.filter((_, ii) => (a.labInterp[`${gi}-${ii}`] ?? "").trim()).length;
          return (
            <Card key={gi} className="!p-0 overflow-hidden">
              <button
                onClick={() => setOpen(open === gi ? -1 : gi)}
                className="flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-navy-50/70 dark:hover:bg-white/[0.03]"
              >
                <div className="flex items-center gap-3">
                  <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", abnormal > 0 ? "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300" : "bg-clinical-100 text-clinical-600 dark:bg-clinical-500/15 dark:text-clinical-300")}>
                    <Beaker size={16} />
                  </span>
                  <div>
                    <p className="text-sm font-extrabold text-navy-900 dark:text-navy-50">{g.title}</p>
                    <p className="text-xs text-navy-400">{g.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {abnormal > 0 && <Pill tone="amber">{abnormal} abnormal</Pill>}
                  <Pill tone="gray">{filled}/{g.items.length} interpretasi</Pill>
                  <ChevronDown size={16} className={cn("text-navy-400 transition-transform", open === gi && "rotate-180")} />
                </div>
              </button>
              {open === gi && (
                <div className="overflow-x-auto border-t border-navy-100 dark:border-white/[0.06]">
                  <table className="w-full min-w-[860px] text-sm">
                    <thead>
                      <tr className="bg-navy-50/80 text-left dark:bg-white/[0.04]">
                        <th className="px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-navy-500 dark:text-navy-300">Parameter</th>
                        <th className="px-3 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-navy-500 dark:text-navy-300">Nilai</th>
                        <th className="px-3 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-navy-500 dark:text-navy-300">Satuan</th>
                        <th className="px-3 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-navy-500 dark:text-navy-300">Referensi</th>
                        <th className="px-3 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-navy-500 dark:text-navy-300">Status</th>
                        <th className="w-[36%] px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-navy-500 dark:text-navy-300">Interpretasi Mahasiswa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.items.map((it: LabItem, ii) => {
                        const key = `${gi}-${ii}`;
                        const flag = labFlag(it.num, it.refMin, it.refMax);
                        return (
                          <tr key={ii} className={cn("border-t border-navy-100/60 align-top dark:border-white/[0.05]", (flag === "high" || flag === "low") && "bg-amber-50/50 dark:bg-amber-500/[0.05]")}>
                            <td className="px-4 py-3">
                              <span className="flex items-center gap-2 font-semibold text-navy-800 dark:text-navy-100">
                                {it.param}
                                <BookmarkTag
                                  small
                                  label={`${it.param}: ${it.value} ${it.unit} (ref ${it.ref}) — ${g.date}`}
                                  bagian="Laboratorium"
                                  onAdd={(b) => update((x) => ({ ...x, bookmarks: [b, ...x.bookmarks] }))}
                                />
                              </span>
                            </td>
                            <td className={cn("num px-3 py-3 font-bold", flag === "high" ? "text-red-600 dark:text-red-400" : flag === "low" ? "text-amber-600 dark:text-amber-400" : "text-navy-800 dark:text-navy-100")}>
                              {it.value}
                            </td>
                            <td className="px-3 py-3 text-xs text-navy-400">{it.unit || "—"}</td>
                            <td className="num px-3 py-3 text-xs text-navy-500 dark:text-navy-300">{it.ref}</td>
                            <td className="px-3 py-3"><FlagBadge flag={flag} /></td>
                            <td className="px-4 py-3">
                              <LabRowInput
                                value={a.labInterp[key] ?? ""}
                                onChange={(v) => update((x) => ({ ...x, labInterp: { ...x.labInterp, [key]: v } }))}
                                placeholder={
                                  flag === "high" || flag === "low"
                                    ? "Apa makna klinis penyimpangan nilai ini pada pasien?"
                                    : "Interpretasi hasil laboratorium…"
                                }
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════ 6. PEMERIKSAAN PENUNJANG ═══════════════ */

const EXAM_ICON: Record<string, typeof ScanHeart> = {
  EKG: Activity,
  "MSCT Kepala": FileScan,
  "CT Scan Kepala": FileScan,
  "Foto Thorax": ScanHeart,
  Echocardiography: ScanHeart,
};

export function SupportingSection({ c, a, update }: Sec) {
  return (
    <div>
      <SectionHead
        icon={<ScanHeart size={20} />}
        step="Bagian 6 · Clinical Evidence"
        title="Pemeriksaan Penunjang"
        desc="Bukti klinis objektif dari pemeriksaan penunjang. Jelaskan makna klinis tiap hasil terhadap diagnosis dan terapi."
      />
      {c.supporting.length === 0 ? (
        <Empty title="Data tidak tersedia dalam kasus." />
      ) : (
        <div className="space-y-4">
          {c.supporting.map((ex, i) => {
            const Icon = EXAM_ICON[ex.type] ?? ScanHeart;
            return (
              <Card key={i}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
                      <Icon size={18} />
                    </div>
                    <div>
                      <Pill tone="violet">{ex.type}</Pill>
                      <h3 className="mt-1 text-base font-extrabold tracking-tight text-navy-900 dark:text-navy-50">{ex.title}</h3>
                      <p className="text-xs text-navy-400">{ex.date}</p>
                    </div>
                  </div>
                  <BookmarkTag label={`${ex.type} (${ex.date}): ${ex.findings[0] ?? ""}`} bagian="Pemeriksaan Penunjang" onAdd={(b) => update((x) => ({ ...x, bookmarks: [b, ...x.bookmarks] }))} />
                </div>
                <div className="mt-4 rounded-xl bg-navy-50/80 p-4 dark:bg-white/[0.03]">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-navy-400">Clinical Findings</p>
                  <ul className="mt-2 space-y-1.5">
                    {ex.findings.map((f, fi) => (
                      <li key={fi} className="flex gap-2.5 text-sm leading-relaxed text-navy-700 dark:text-navy-200">
                        <Stethoscope size={13} className="mt-1 shrink-0 text-clinical-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Field label={`Interpretasi Mahasiswa — ${ex.type}`} className="mt-4" hint="Jelaskan makna klinis hasil pemeriksaan penunjang tersebut.">
                  <TextArea
                    value={a.examInterp[i] ?? ""}
                    onChange={(e) => update((x) => ({ ...x, examInterp: { ...x.examInterp, [i]: e.target.value } }))}
                    placeholder="cth: Temuan ini mengkonfirmasi diagnosis… dan berimplikasi pada…"
                  />
                </Field>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════ 7. TERAPI OBAT ═══════════════ */

function MedForm({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <Field label={label}>
      <TextArea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="!min-h-[70px] !text-xs" />
    </Field>
  );
}

export function MedsSection({ c, a, update }: Sec) {
  const [openRow, setOpenRow] = useState<number | null>(0);

  return (
    <div>
      <SectionHead
        icon={<PillIcon size={20} />}
        step="Bagian 7 · Farmakoterapi"
        title="Terapi Obat Pasien"
        desc="Klik baris obat untuk membuka lembar analisis: indikasi, kesesuaian regimen, potensi masalah, monitoring, dan efek samping."
      />

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="bg-navy-800 text-left text-white dark:bg-white/[0.06]">
                {["Nama Obat", "Rute", "Dosis", "Frekuensi", "Periode", "Indikasi", ""].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.medications.map((m, i) => {
                const an = a.medAnalysis[i];
                const answeredCount = an ? [an.indikasi, an.regimen, an.masalah, an.monitoring, an.efekSamping].filter((s) => s.trim()).length : 0;
                return (
                  <FragmentRow
                    key={i}
                    open={openRow === i}
                    onToggle={() => setOpenRow(openRow === i ? null : i)}
                    med={m}
                    badge={
                      answeredCount === 5 ? <Pill tone="green">5/5</Pill> : answeredCount > 0 ? <Pill tone="amber">{answeredCount}/5</Pill> : null
                    }
                    index={i}
                    bookmark={
                      <BookmarkTag small label={`${m.name} ${m.dose} ${m.freq} (${m.route})`} bagian="Terapi Obat" onAdd={(b) => update((x) => ({ ...x, bookmarks: [b, ...x.bookmarks] }))} />
                    }
                    form={
                      <div className="grid gap-3 sm:grid-cols-2">
                        <MedForm
                          label="1. Apa indikasi obat ini pada pasien?"
                          value={an?.indikasi ?? ""}
                          onChange={(v) => update((x) => ({ ...x, medAnalysis: { ...x.medAnalysis, [i]: { ...(x.medAnalysis[i] ?? blankMed()), indikasi: v } } }))}
                          placeholder="Kaitkan dengan kondisi klinis pasien…"
                        />
                        <MedForm
                          label="2. Apakah dosis dan regimen sesuai?"
                          value={an?.regimen ?? ""}
                          onChange={(v) => update((x) => ({ ...x, medAnalysis: { ...x.medAnalysis, [i]: { ...(x.medAnalysis[i] ?? blankMed()), regimen: v } } }))}
                          placeholder="Bandingkan dengan guideline/fungsi organ pasien…"
                        />
                        <MedForm
                          label="3. Apakah terdapat potensi masalah terkait obat?"
                          value={an?.masalah ?? ""}
                          onChange={(v) => update((x) => ({ ...x, medAnalysis: { ...x.medAnalysis, [i]: { ...(x.medAnalysis[i] ?? blankMed()), masalah: v } } }))}
                          placeholder="Interaksi, duplikasi, kontraindikasi…"
                        />
                        <MedForm
                          label="4. Parameter apa yang harus dimonitor?"
                          value={an?.monitoring ?? ""}
                          onChange={(v) => update((x) => ({ ...x, medAnalysis: { ...x.medAnalysis, [i]: { ...(x.medAnalysis[i] ?? blankMed()), monitoring: v } } }))}
                          placeholder="TD, HR, kalium, kreatinin, INR…"
                        />
                        <MedForm
                          label="5. Apa efek samping yang perlu diperhatikan?"
                          value={an?.efekSamping ?? ""}
                          onChange={(v) => update((x) => ({ ...x, medAnalysis: { ...x.medAnalysis, [i]: { ...(x.medAnalysis[i] ?? blankMed()), efekSamping: v } } }))}
                        />
                      </div>
                    }
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {c.development && c.development.length > 0 && (
        <Card className="mt-4">
          <h3 className="text-sm font-extrabold tracking-tight text-navy-900 dark:text-navy-50">Perkembangan Terapi & Kondisi Pasien</h3>
          <ol className="relative mt-4 space-y-5 border-l-2 border-clinical-200 pl-6 dark:border-clinical-500/25">
            {c.development.map((d, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-clinical-500 bg-white dark:bg-navy-900" />
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-clinical-600 dark:text-clinical-400">{d.day}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-navy-600 dark:text-navy-200">{d.text}</p>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {c.dischargeMeds && c.dischargeMeds.length > 0 && (
        <Card className="mt-4 !p-0 overflow-hidden">
          <div className="border-b border-navy-100 bg-navy-50/70 px-5 py-3.5 dark:border-white/[0.06] dark:bg-white/[0.03]">
            <h3 className="text-sm font-extrabold tracking-tight text-navy-900 dark:text-navy-50">Obat Pulang</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="bg-navy-50/80 text-left dark:bg-white/[0.03]">
                  {["Nama Obat", "Rute", "Dosis", "Frekuensi", "Indikasi"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-navy-500 dark:text-navy-300">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.dischargeMeds.map((m, i) => (
                  <tr key={i} className="border-t border-navy-100/60 dark:border-white/[0.05]">
                    <td className="px-4 py-2.5 font-semibold text-navy-800 dark:text-navy-100">{m.name}</td>
                    <td className="px-4 py-2.5 text-navy-600 dark:text-navy-300">{m.route}</td>
                    <td className="num px-4 py-2.5 text-navy-600 dark:text-navy-300">{m.dose}</td>
                    <td className="num px-4 py-2.5 text-navy-600 dark:text-navy-300">{m.freq}</td>
                    <td className="px-4 py-2.5 text-navy-600 dark:text-navy-300">{m.indication}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

function blankMed() {
  return { indikasi: "", regimen: "", masalah: "", monitoring: "", efekSamping: "" };
}

import type { Medication } from "../../types";
import { Fragment, type ReactNode } from "react";

function FragmentRow({
  med,
  open,
  onToggle,
  form,
  badge,
  index,
  bookmark,
}: {
  med: Medication;
  open: boolean;
  onToggle: () => void;
  form: ReactNode;
  badge: ReactNode;
  index: number;
  bookmark: ReactNode;
}) {
  return (
    <Fragment>
      <tr
        onClick={onToggle}
        className={cn(
          "cursor-pointer border-t border-navy-100/70 align-middle transition hover:bg-navy-50/60 dark:border-white/[0.05] dark:hover:bg-white/[0.03]",
          open && "bg-clinical-50/50 dark:bg-clinical-500/[0.06]"
        )}
      >
        <td className="px-4 py-3">
          <span className="flex items-center gap-2 font-bold text-navy-900 dark:text-navy-50">
            <span className="num flex h-6 w-6 items-center justify-center rounded-md bg-navy-100 text-[10px] font-extrabold text-navy-500 dark:bg-white/10 dark:text-navy-300">
              {index + 1}
            </span>
            {med.name}
            {badge}
          </span>
        </td>
        <td className="px-4 py-3 text-navy-600 dark:text-navy-300">{med.route}</td>
        <td className="num px-4 py-3 font-semibold text-navy-700 dark:text-navy-200">{med.dose}</td>
        <td className="num px-4 py-3 text-navy-600 dark:text-navy-300">{med.freq}</td>
        <td className="px-4 py-3 text-xs text-navy-500 dark:text-navy-300">{med.period}</td>
        <td className="px-4 py-3 text-xs text-navy-500 dark:text-navy-300">{med.indication}{med.notes ? <span className="block text-[11px] italic text-navy-400">{med.notes}</span> : null}</td>
        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
          <span className="flex items-center gap-1.5 justify-end">
            {bookmark}
            <ChevronDown size={15} className={cn("text-navy-400 transition-transform", open && "rotate-180")} />
          </span>
        </td>
      </tr>
      {open && (
        <tr className="border-t border-navy-100/50 bg-navy-50/40 dark:border-white/[0.04] dark:bg-white/[0.02]">
          <td colSpan={7} className="px-5 py-4">
            <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-clinical-600 dark:text-clinical-400">
              Lembar Analisis Obat — {med.name}
            </p>
            {form}
          </td>
        </tr>
      )}
    </Fragment>
  );
}
