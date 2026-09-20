/* ============================================================
   PharmaKPE — Tipe data inti
   Data kasus dipisahkan dari UI (JSON-like) sehingga dosen dapat
   memperbarui / menambah kasus tanpa mengubah komponen.
   ============================================================ */

export interface Student {
  nama: string;
  nim: string;
  kelas: string;
  kelompok: string;
  tanggal: string;
  dosen: string;
  consent: boolean;
}

/* ---------- Struktur data kasus ---------- */

export interface ProfileField {
  label: string;
  value: string;
}

export interface ClinicalRow {
  name: string;
  unit?: string;
  values: (string | number | null)[];
  /** jika true, baris divisualisasikan sebagai grafik garis */
  chart?: boolean;
  /** warna garis grafik (opsional) */
  color?: string;
}

export interface ClinicalSerial {
  days: string[];
  rows: ClinicalRow[];
  notes?: string[];
}

export interface LabItem {
  param: string;
  value: string;
  unit: string;
  ref: string;
  /** nilai numerik & rentang referensi — dasar indikator otomatis */
  num?: number | null;
  refMin?: number | null;
  refMax?: number | null;
}

export interface LabGroup {
  title: string;
  date: string;
  items: LabItem[];
}

export interface SupportingExam {
  type: string;
  date: string;
  title: string;
  findings: string[];
}

export interface Medication {
  name: string;
  route: string;
  dose: string;
  freq: string;
  period: string;
  indication: string;
  notes?: string;
}

export interface DevelopmentItem {
  day: string;
  text: string;
}

export interface CaseData {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  diagnosis: string;
  system: string;
  tags: string[];
  estTime: string;
  description: string;
  profile: ProfileField[];
  complaint: string[];
  history: { title: string; items: string[] }[];
  clinical: ClinicalSerial;
  labs: LabGroup[];
  supporting: SupportingExam[];
  medications: Medication[];
  development?: DevelopmentItem[];
  dischargeMeds?: Medication[];
}

/* ---------- Jawaban mahasiswa ---------- */

export interface DRPRow {
  id: string;
  kategori: string;
  masalah: string;
  bukti: string;
  penyebab: string;
  dampak: string;
  prioritas: "" | "Tinggi" | "Sedang" | "Rendah";
}

export interface PlanRow {
  id: string;
  masalah: string;
  tujuan: string;
  target: string;
  pilihan: string;
  regimen: string;
  alasan: string;
  alternatif: string;
  durasi: string;
  monitoring: string;
}

export interface MonitorRow {
  id: string;
  kategori: string;
  parameter: string;
  baseline: string;
  target: string;
  frekuensi: string;
  metode: string;
  tindakan: string;
}

export interface MedAnalysis {
  indikasi: string;
  regimen: string;
  masalah: string;
  monitoring: string;
  efekSamping: string;
}

export interface MedEval {
  status: "" | "tepat" | "perlu-evaluasi" | "tidak-tepat" | "tidak-dapat-dinilai";
  alasan: string;
}

export interface RefItem {
  id: string;
  judul: string;
  tahun: string;
  link: string;
  alasan: string;
}

export interface Bookmark {
  id: string;
  kategori: string;
  label: string;
  bagian: string;
  waktu: string;
}

export interface Education {
  informasi: string;
  cara: string;
  efekSamping: string;
  kembali: string;
  gayaHidup: string;
  tandaBahaya: string;
}

export interface Soap {
  s: string;
  o: string;
  a: string;
  p: string;
  include: boolean;
}

export interface Reflection {
  dipelajari: string;
  tersulit: string;
  dataTambahan: string;
}

export interface CaseAnswers {
  startedAt: string;
  updatedAt: string;
  finished: boolean;
  labInterp: Record<string, string>;
  examInterp: Record<number, string>;
  medAnalysis: Record<number, MedAnalysis>;
  medEval: Record<number, MedEval>;
  masalah: string;
  assessment: string;
  drps: DRPRow[];
  plans: PlanRow[];
  monitors: MonitorRow[];
  education: Education;
  soap: Soap;
  kesimpulan: string;
  refleksi: Reflection;
  catatan: string;
  references: RefItem[];
  bookmarks: Bookmark[];
}

export interface FinalReflection {
  pola: string;
  perbedaan: string;
  lab: string;
  komorbid: string;
  peranApoteker: string;
}

export interface RubricItem {
  key: string;
  label: string;
  weight: number;
}

export const DRP_CATEGORIES = [
  "Indikasi tanpa terapi",
  "Terapi tanpa indikasi",
  "Pemilihan obat",
  "Dosis",
  "Frekuensi",
  "Interaksi obat",
  "Efek samping",
  "Kontraindikasi",
  "Monitoring",
  "Kepatuhan",
  "Masalah lainnya",
] as const;

export const MONITOR_CATEGORIES = [
  "Efektivitas",
  "Keamanan",
  "Laboratorium",
  "Tanda vital",
  "Gejala klinis",
  "Adherence",
] as const;

export const BOOKMARK_CATEGORIES = [
  "Temuan klinis penting",
  "Lab abnormal",
  "Gejala penting",
  "Drug Related Problem",
  "Diagnosis penting",
  "Parameter monitoring",
] as const;

export const EVAL_OPTIONS: { value: MedEval["status"]; label: string }[] = [
  { value: "tepat", label: "Tepat" },
  { value: "perlu-evaluasi", label: "Perlu evaluasi" },
  { value: "tidak-tepat", label: "Tidak tepat" },
  { value: "tidak-dapat-dinilai", label: "Tidak dapat dinilai dari data" },
];
