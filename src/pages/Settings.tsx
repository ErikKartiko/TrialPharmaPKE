import { useState } from "react";
import { Database, Info, Moon, ShieldCheck, Sun, Trash2 } from "lucide-react";
import { Btn, Card, Confirm } from "../components/ui";
import { useTheme } from "../components/Layout";
import { CASES } from "../data/cases";
import { K, removeKey } from "../lib/store";
import { cn } from "../utils/cn";
import { nav } from "../lib/router";

export default function Settings() {
  const [theme, toggle] = useTheme();
  const [confirm, setConfirm] = useState(false);

  const resetAll = () => {
    removeKey(K.student);
    removeKey(K.finalReflection);
    removeKey(K.rubric);
    CASES.forEach((c) => {
      removeKey(K.answers(c.id));
      removeKey(K.timer(c.id));
    });
    nav("/");
    window.location.reload();
  };

  let storageKB = "0";
  try {
    const bytes = Object.keys(localStorage)
      .filter((k) => k.startsWith("pharmakpe"))
      .reduce((acc, k) => acc + (localStorage.getItem(k)?.length ?? 0) * 2, 0);
    storageKB = (bytes / 1024).toFixed(1);
  } catch {
    /* ignore */
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-clinical-600 dark:text-clinical-400">Preferensi</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl dark:text-navy-50">Pengaturan</h1>
      </div>

      {/* theme */}
      <Card>
        <h2 className="text-sm font-extrabold text-navy-900 dark:text-navy-50">Tampilan</h2>
        <p className="mb-4 text-xs text-navy-400 dark:text-navy-400">Pilih mode terang atau gelap sesuai kenyamanan Anda.</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => theme === "dark" && toggle()}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 text-left transition",
              theme === "light" ? "border-clinical-500 bg-clinical-50/60" : "border-navy-100 dark:border-white/10"
            )}
          >
            <Sun size={18} className="text-amber-500" />
            <div>
              <p className="text-sm font-bold text-navy-900 dark:text-navy-50">Light Mode</p>
              <p className="text-xs text-navy-400">Latar terang, kontras tinggi</p>
            </div>
          </button>
          <button
            onClick={() => theme === "light" && toggle()}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 text-left transition",
              theme === "dark" ? "border-clinical-500 bg-clinical-500/10" : "border-navy-100 dark:border-white/10"
            )}
          >
            <Moon size={18} className="text-navy-500 dark:text-indigo-300" />
            <div>
              <p className="text-sm font-bold text-navy-900 dark:text-navy-50">Dark Mode</p>
              <p className="text-xs text-navy-400">Nyaman di ruang minim cahaya</p>
            </div>
          </button>
        </div>
      </Card>

      {/* storage */}
      <Card>
        <h2 className="flex items-center gap-2 text-sm font-extrabold text-navy-900 dark:text-navy-50">
          <Database size={15} className="text-clinical-500" /> Penyimpanan Data
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-navy-50 p-4 dark:bg-white/[0.04]">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-navy-400">Ukuran data</p>
            <p className="num mt-1 text-xl font-extrabold text-navy-900 dark:text-navy-50">{storageKB} KB</p>
          </div>
          <div className="rounded-xl bg-navy-50 p-4 dark:bg-white/[0.04]">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-navy-400">Lokasi</p>
            <p className="mt-1 text-sm font-bold text-navy-900 dark:text-navy-50">Browser (localStorage)</p>
          </div>
          <div className="rounded-xl bg-navy-50 p-4 dark:bg-white/[0.04]">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-navy-400">Sinkronisasi server</p>
            <p className="mt-1 text-sm font-bold text-navy-900 dark:text-navy-50">Tidak aktif</p>
          </div>
        </div>
      </Card>

      {/* privacy */}
      <Card className="border-l-4 !border-l-clinical-500">
        <h2 className="flex items-center gap-2 text-sm font-extrabold text-navy-900 dark:text-navy-50">
          <ShieldCheck size={15} className="text-clinical-500" /> Privasi & Data Klinis
        </h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-navy-600 dark:text-navy-300">
          <li className="flex gap-2"><Info size={14} className="mt-0.5 shrink-0 text-clinical-500" /> Seluruh jawaban hanya tersimpan pada browser / perangkat ini (local storage). Tidak ada data yang dikirim ke server.</li>
          <li className="flex gap-2"><Info size={14} className="mt-0.5 shrink-0 text-clinical-500" /> Bila browser ditutup, jawaban tetap tersedia saat Anda membuka kembali aplikasi pada perangkat yang sama.</li>
          <li className="flex gap-2"><Info size={14} className="mt-0.5 shrink-0 text-clinical-500" /> Data kasus merupakan data klinis untuk keperluan pembelajaran praktikum — tidak untuk disebarluaskan sebagai data publik.</li>
          <li className="flex gap-2"><Info size={14} className="mt-0.5 shrink-0 text-clinical-500" /> Identitas pasien menggunakan inisial sebagaimana tercantum pada dokumen kasus; aplikasi tidak menambahkan identitas baru.</li>
        </ul>
      </Card>

      {/* danger zone */}
      <Card className="border-red-200 dark:border-red-500/20">
        <h2 className="text-sm font-extrabold text-red-600 dark:text-red-400">Zona Berbahaya</h2>
        <p className="mt-1 text-xs leading-relaxed text-navy-500 dark:text-navy-300">
          Menghapus identitas mahasiswa, seluruh jawaban 5 kasus, timer, refleksi akhir, dan pengaturan dari browser ini.
        </p>
        <Btn variant="danger" size="sm" className="mt-4" onClick={() => setConfirm(true)}>
          <Trash2 size={14} /> Hapus Semua Data
        </Btn>
      </Card>

      <Confirm
        open={confirm}
        title="Hapus seluruh data aplikasi?"
        body="Semua jawaban kasus, identitas, dan pengaturan akan dihapus permanen dari browser ini. Tindakan tidak dapat dibatalkan."
        confirmLabel="Ya, hapus semua"
        danger
        onConfirm={resetAll}
        onClose={() => setConfirm(false)}
      />
    </div>
  );
}
