import { useState } from "react";
import { ArrowRight, BadgeCheck, ClipboardPen, UserRound } from "lucide-react";
import { nav } from "../lib/router";
import { Btn, Card, Field, TextInput } from "../components/ui";
import { K, usePersistent } from "../lib/store";
import type { Student } from "../types";

export function IdentityForm({ embedded, onDone }: { embedded?: boolean; onDone?: () => void }) {
  const [student, setStudent] = usePersistent<Student | null>(K.student, null);
  const [form, setForm] = useState<Student>(
    student ?? {
      nama: "",
      nim: "",
      kelas: "",
      kelompok: "",
      tanggal: new Date().toISOString().slice(0, 10),
      dosen: "",
      consent: false,
    }
  );
  const [touched, setTouched] = useState(false);

  const set = (k: keyof Student) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  const valid =
    form.nama.trim() && form.nim.trim() && form.kelas.trim() && form.kelompok.trim() && form.tanggal.trim() && form.consent;

  const submit = () => {
    setTouched(true);
    if (!valid) return;
    setStudent(form);
    (onDone ?? (() => nav("/dashboard")))();
  };

  const err = (v: string) => touched && !v.trim();

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-clinical-600 text-white">
          <UserRound size={20} />
        </div>
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-navy-900 dark:text-navy-50">Identitas Mahasiswa</h2>
          <p className="text-sm text-navy-500 dark:text-navy-300">Data ini akan tercetak pada sampul laporan Word Anda.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nama Mahasiswa *" className="sm:col-span-2">
          <TextInput value={form.nama} onChange={set("nama")} placeholder="cth: Ratna Dewi Anggraini" aria-invalid={err(form.nama)} className={err(form.nama) ? "border-red-400" : ""} />
        </Field>
        <Field label="NIM *">
          <TextInput value={form.nim} onChange={set("nim")} placeholder="cth: 202210101001" className={err(form.nim) ? "border-red-400" : ""} />
        </Field>
        <Field label="Kelas *">
          <TextInput value={form.kelas} onChange={set("kelas")} placeholder="cth: Farmasi B" className={err(form.kelas) ? "border-red-400" : ""} />
        </Field>
        <Field label="Kelompok *">
          <TextInput value={form.kelompok} onChange={set("kelompok")} placeholder="cth: Kelompok 4" className={err(form.kelompok) ? "border-red-400" : ""} />
        </Field>
        <Field label="Tanggal Pengerjaan *">
          <TextInput type="date" value={form.tanggal} onChange={set("tanggal")} />
        </Field>
        <Field label="Dosen Pengampu" optional className="sm:col-span-2">
          <TextInput value={form.dosen} onChange={set("dosen")} placeholder="cth: apt. Nama Dosen, S.Farm., M.Farm." />
        </Field>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-navy-100 bg-navy-50/60 p-4 transition hover:border-clinical-300 dark:border-white/[0.08] dark:bg-white/[0.03]">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={set("consent")}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-teal-600"
        />
        <span className="text-sm leading-relaxed text-navy-600 dark:text-navy-200">
          Saya memahami bahwa jawaban yang saya masukkan merupakan <strong>hasil analisis saya sendiri</strong>.
          {touched && !form.consent && <span className="block text-xs font-semibold text-red-500">Wajib dicentang untuk melanjutkan.</span>}
        </span>
      </label>

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="hidden items-center gap-1.5 text-xs text-navy-400 sm:flex dark:text-navy-400">
          <BadgeCheck size={13} className="text-clinical-500" /> Data disimpan lokal di browser ini
        </p>
        <Btn size="lg" onClick={submit} disabled={touched && !valid} className="ml-auto">
          {embedded ? "Simpan Profil" : "Mulai Kasus"} <ArrowRight size={16} />
        </Btn>
      </div>
    </Card>
  );
}

export default function Identity() {
  return (
    <div className="flex min-h-screen flex-col bg-navy-50 dark:bg-[#070f1d]">
      <header className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-navy-800 to-clinical-600 text-white">
          <ClipboardPen size={17} />
        </div>
        <div>
          <p className="text-sm font-extrabold text-navy-900 dark:text-white">PharmaKPE Case-Based Learning</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-clinical-600 dark:text-clinical-400">Fakultas Farmasi · Universitas Jember</p>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-16 pt-4">
        <div className="w-full animate-fade-up">
          <div className="mx-auto mb-6 max-w-2xl text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl dark:text-navy-50">Selamat datang,</h1>
            <p className="mt-2 text-sm text-navy-500 sm:text-base dark:text-navy-300">
              Sebelum mengerjakan kasus, lengkapi identitas Anda terlebih dahulu.
            </p>
          </div>
          <IdentityForm />
        </div>
      </main>
    </div>
  );
}
