import {
  ArrowRight,
  BookMarked,
  BrainCircuit,
  ClipboardList,
  FileDown,
  FlaskConical,
  HeartPulse,
  MousePointerClick,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { nav } from "../lib/router";
import { Btn, Pill } from "../components/ui";
import { K, usePersistent } from "../lib/store";
import type { Student } from "../types";

const FEATURES = [
  {
    icon: <ClipboardList size={20} />,
    title: "5 Clinical Cases",
    desc: "CVA infark, stroke hemoragik, STEMI, ADHF + atrial fibrilasi, dan infark miokard transmural — lengkap dengan data klinis serial.",
  },
  {
    icon: <MousePointerClick size={20} />,
    title: "Interactive Case Analysis",
    desc: "Tabel vital sign interaktif, grafik tekanan darah–nadi–SpO₂, dan interpretasi laboratorium dengan indikator rentang referensi.",
  },
  {
    icon: <BrainCircuit size={20} />,
    title: "Clinical Reasoning",
    desc: "Alur berpikir terstruktur: identifikasi masalah → assessment → evaluasi terapi → rencana farmakoterapi.",
  },
  {
    icon: <FlaskConical size={20} />,
    title: "Drug Related Problems",
    desc: "Identifikasi DRP per kategori dengan bukti klinis, penyebab, dampak, dan prioritas penanganan.",
  },
  {
    icon: <HeartPulse size={20} />,
    title: "Monitoring & Education",
    desc: "Susun monitoring plan (efektivitas, keamanan, laboratorium) dan edukasi pasien yang komprehensif.",
  },
  {
    icon: <FileDown size={20} />,
    title: "Export Report to Word",
    desc: "Seluruh jawaban terkompilasi otomatis menjadi laporan akademik .docx — per kasus maupun portfolio 5 kasus.",
  },
];

const FLOW = ["Read Case", "Assess", "Identify Problems", "Evaluate Drug Therapy", "Plan", "Monitor", "Educate", "Reflect", "Generate Report"];

export default function Landing() {
  const [student] = usePersistent<Student | null>(K.student, null);
  const start = () => nav(student?.nama ? "/dashboard" : "/identitas");

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <img src="/images/hero-bg.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-950/55 to-navy-950" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_20%,rgba(15,167,156,0.14),transparent)]" />

        <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-navy-700 to-clinical-600 shadow-lg shadow-clinical-900/40">
              <Stethoscope size={18} />
            </div>
            <div>
              <p className="text-sm font-extrabold tracking-tight">PharmaKPE</p>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-clinical-300">Case-Based Learning</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Btn variant="ghost" size="sm" className="text-navy-200 hover:bg-white/10" onClick={() => nav("/pengajar")}>
              Mode Pengajar
            </Btn>
            <Btn variant="teal" size="sm" onClick={start}>
              Mulai <ArrowRight size={14} />
            </Btn>
          </div>
        </header>

        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-14 sm:pt-20">
          <div className="stagger">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="teal" className="!bg-clinical-500/15 !text-clinical-200 border border-clinical-400/30">
                <ShieldCheck size={11} /> Fakultas Farmasi — Universitas Jember
              </Pill>
              <Pill className="!bg-white/10 !text-navy-100 border border-white/15">Semester Praktikum KPE</Pill>
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">
              PharmaKPE
              <span className="block bg-gradient-to-r from-clinical-300 via-clinical-400 to-clinical-200 bg-clip-text text-transparent">
                Case-Based Learning
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-base font-medium text-navy-100/90 sm:text-lg">
              Interactive Clinical Case Analysis — Farmakoterapi Kardiovaskular, Pernapasan, dan Endokrin (KPE)
            </p>

            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-navy-200/75 sm:text-base">
              Platform pembelajaran berbasis kasus yang membantu mahasiswa menganalisis data pasien, mengevaluasi terapi obat,
              mengidentifikasi <em className="font-serif not-italic text-clinical-300">Drug Related Problems</em>, dan menyusun
              rencana pelayanan kefarmasian — lalu mengunduh seluruh hasil analisis sebagai laporan Microsoft Word.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Btn variant="teal" size="lg" onClick={start}>
                Mulai Pembelajaran <ArrowRight size={17} />
              </Btn>
              <Btn
                variant="secondary"
                size="lg"
                className="!border-white/20 !bg-white/[0.06] !text-white hover:!bg-white/10"
                onClick={() => nav("/pengajar")}
              >
                <BookMarked size={16} /> Lihat Rubrik Penilaian
              </Btn>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-xs font-semibold text-navy-200/70">
              <span className="flex items-center gap-2"><span className="num text-xl font-bold text-clinical-300">5</span> Kasus klinis</span>
              <span className="flex items-center gap-2"><span className="num text-xl font-bold text-clinical-300">13</span> Bagian analisis per kasus</span>
              <span className="flex items-center gap-2"><span className="num text-xl font-bold text-clinical-300">100%</span> Tersimpan otomatis di perangkat</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-clinical-400">Alur Pengerjaan Mahasiswa</p>
        <h2 className="mt-2 max-w-2xl text-2xl font-extrabold tracking-tight sm:text-4xl">
          Dari membaca kasus hingga laporan Word akademik
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-clinical-500/40 hover:bg-white/[0.06]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-navy-700 to-navy-800 text-clinical-300 shadow-inner transition-colors group-hover:from-clinical-700 group-hover:to-clinical-800 group-hover:text-white">
                {f.icon}
              </div>
              <h3 className="mt-4 text-base font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-200/70">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WORKFLOW ================= */}
      <section className="border-y border-white/[0.07] bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-clinical-400">Clinical Reasoning Workflow</p>
          <div className="mt-6 flex flex-wrap items-center gap-y-3">
            {FLOW.map((s, i) => (
              <div key={s} className="flex items-center">
                <span className="rounded-full border border-clinical-500/30 bg-clinical-500/10 px-4 py-1.5 text-xs font-bold text-clinical-200">
                  {s}
                </span>
                {i < FLOW.length - 1 && <ArrowRight size={14} className="mx-2 text-navy-500" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="mx-auto max-w-6xl px-6 py-16 text-center sm:py-20">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Siap mengerjakan 5 kasus farmakoterapi?</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-navy-200/70">
          Isi identitas mahasiswa, kerjakan kasus secara bertahap, dan unduh laporan akhir sebagai dokumen Word.
        </p>
        <div className="mt-8 flex justify-center">
          <Btn variant="teal" size="lg" onClick={start}>
            Mulai Pembelajaran <ArrowRight size={17} />
          </Btn>
        </div>
      </section>

      <footer className="border-t border-white/[0.07] px-6 py-8 text-center text-[11px] leading-relaxed text-navy-300/60">
        <p className="font-semibold text-navy-200/80">PharmaKPE Case-Based Learning — Fakultas Farmasi, Universitas Jember</p>
        <p className="mx-auto mt-2 max-w-2xl">
          Data kasus merupakan data klinis untuk keperluan pembelajaran. Seluruh jawaban hanya tersimpan pada browser
          perangkat Anda (local storage) dan tidak dikirim ke server mana pun.
        </p>
      </footer>
    </div>
  );
}
