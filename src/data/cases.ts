import type { CaseData } from "../types";

/* ============================================================
   DATA KASUS — FARMAKOTERAPI KPE
   Struktur JSON-like; dapat diganti/ditambah oleh dosen tanpa
   menyentuh komponen UI. Semua nilai bersumber dari dokumen
   kasus praktikum (lihat pengaturan untuk mengganti sumber).
   ============================================================ */

export const CASES: CaseData[] = [
  /* ================= CASE 1 — CVA INFARK ================= */
  {
    id: "case-1",
    number: 1,
    title: "CVA Infark",
    shortTitle: "Case 1",
    diagnosis: "Cerebrovascular Accident (CVA) Infark + Hipertensi Stadium 2 + Dislipidemia",
    system: "Neurologi / Serebrovaskular",
    tags: ["Neurologi", "Stroke", "Gawat Darurat"],
    estTime: "± 60 menit",
    description:
      "Pasien geriatri dengan kelemahan anggota gerak kanan mendadak, terkonfirmasi infark serebri pada MSCT kepala.",
    profile: [
      { label: "Nama Pasien", value: "Ny. SM" },
      { label: "Usia", value: "67 tahun" },
      { label: "Jenis Kelamin", value: "Perempuan" },
      { label: "Berat Badan", value: "58 kg" },
      { label: "Tinggi Badan", value: "152 cm" },
      { label: "Nomor RM", value: "08.12.45" },
      { label: "Tanggal MRS", value: "12 April 2022" },
      { label: "Tanggal KRS", value: "20 April 2022" },
      { label: "Diagnosis", value: "CVA Infark; Hipertensi stadium 2; Dislipidemia" },
      { label: "Riwayat Penyakit", value: "Hipertensi sejak ± 5 tahun, pengobatan tidak teratur" },
      { label: "Riwayat Pengobatan", value: "Amlodipin 10 mg 1×1 (tidak teratur diminum)" },
      { label: "Riwayat Alergi", value: "Tidak ada riwayat alergi obat maupun makanan" },
      { label: "Riwayat Sosial", value: "Ibu rumah tangga; tidak merokok; tidak mengonsumsi alkohol" },
    ],
    complaint: [
      "Keluhan utama: kelemahan anggota gerak sebelah kanan (lengan dan tungkai) secara mendadak sejak ± 6 jam sebelum masuk rumah sakit (SMRS).",
      "Disertai bicara pelo (disartria) dan nyeri kepala sedang sejak pagi hari.",
      "Pasien tampak mengantuk tetapi masih dapat dibangunkan; tidak ada kejang; tidak ada muntah.",
    ],
    history: [
      {
        title: "Riwayat Penyakit Sekarang",
        items: [
          "± 6 jam SMRS pasien terjatuh di kamar mandi karena tungkai dan lengan kanan lemas mendadak.",
          "Bicara menjadi pelo dan sulit dipahami sejak kejadian.",
          "Nyeri kepala tumpul menetap, tidak membaik dengan istirahat.",
        ],
      },
      {
        title: "Riwayat Penyakit Dahulu",
        items: [
          "Hipertensi sejak ± 5 tahun, kontrol tidak teratur, mengonsumsi amlodipin 10 mg hanya saat pusing.",
          "Riwayat stroke sebelumnya disangkal; DM disangkal.",
        ],
      },
      {
        title: "Riwayat Penyakit Keluarga",
        items: ["Ayah pasien memiliki riwayat stroke dan hipertensi."],
      },
    ],
    clinical: {
      days: ["Hari 1", "Hari 2", "Hari 3", "Hari 4", "Hari 5"],
      rows: [
        { name: "Tekanan Darah (Sistol)", unit: "mmHg", values: [180, 170, 160, 150, 140], chart: true, color: "#e11d48" },
        { name: "Tekanan Darah (Diastol)", unit: "mmHg", values: [100, 95, 90, 85, 80], chart: true, color: "#f59e0b" },
        { name: "Nadi", unit: "x/menit", values: [88, 84, 82, 80, 78], chart: true, color: "#0fa79c" },
        { name: "Pernapasan (RR)", unit: "x/menit", values: [22, 20, 20, 18, 18], chart: true, color: "#3b82f6" },
        { name: "Suhu", unit: "°C", values: [36.8, 36.5, 36.7, 36.6, 36.5] },
        { name: "SpO₂", unit: "%", values: [96, 97, 98, 98, 98], chart: true, color: "#8b5cf6" },
        { name: "GCS (E4V4M6)", unit: "", values: [14, 14, 14, 14, 14] },
        { name: "Nyeri kepala (VAS)", unit: "", values: ["5", "4", "3", "1", "0"] },
        { name: "Kelemahan ekstremitas kanan", unit: "", values: ["+", "+", "+", "+ (membaik)", "+ (membaik)"] },
        { name: "Disartria", unit: "", values: ["+", "+", "+", "±", "±"] },
      ],
      notes: [
        "Kekuatan motorik ekstremitas kanan: 3/5 pada hari 1, membaik 4/5 pada hari 5.",
        "Pasien dipuasakan sementara hingga fungsi menelan dinilai aman (hari 1–2).",
      ],
    },
    labs: [
      {
        title: "Kimia Klinik & Hematologi — Masuk RS",
        date: "12 April 2022",
        items: [
          { param: "Gula darah sewaktu", value: "168", unit: "mg/dL", ref: "70–140", num: 168, refMin: 70, refMax: 140 },
          { param: "Kolesterol total", value: "240", unit: "mg/dL", ref: "< 200", num: 240, refMin: null, refMax: 200 },
          { param: "LDL kolesterol", value: "160", unit: "mg/dL", ref: "< 100", num: 160, refMin: null, refMax: 100 },
          { param: "HDL kolesterol", value: "42", unit: "mg/dL", ref: "40–60", num: 42, refMin: 40, refMax: 60 },
          { param: "Trigliserida", value: "185", unit: "mg/dL", ref: "< 150", num: 185, refMin: null, refMax: 150 },
          { param: "Ureum (BUN)", value: "18", unit: "mg/dL", ref: "10–50", num: 18, refMin: 10, refMax: 50 },
          { param: "Kreatinin serum", value: "0,9", unit: "mg/dL", ref: "0,6–1,2", num: 0.9, refMin: 0.6, refMax: 1.2 },
          { param: "Natrium", value: "138", unit: "mEq/L", ref: "135–145", num: 138, refMin: 135, refMax: 145 },
          { param: "Kalium", value: "4,2", unit: "mEq/L", ref: "3,5–5,0", num: 4.2, refMin: 3.5, refMax: 5.0 },
          { param: "SGOT", value: "24", unit: "U/L", ref: "< 35", num: 24, refMin: null, refMax: 35 },
          { param: "SGPT", value: "21", unit: "U/L", ref: "< 35", num: 21, refMin: null, refMax: 35 },
        ],
      },
      {
        title: "Hematologi Lengkap — Masuk RS",
        date: "12 April 2022",
        items: [
          { param: "Leukosit", value: "11.200", unit: "/µL", ref: "4.000–10.000", num: 11200, refMin: 4000, refMax: 10000 },
          { param: "Hemoglobin", value: "13,4", unit: "g/dL", ref: "12–16", num: 13.4, refMin: 12, refMax: 16 },
          { param: "Trombosit", value: "250.000", unit: "/µL", ref: "150.000–400.000", num: 250000, refMin: 150000, refMax: 400000 },
          { param: "Hematokrit", value: "40", unit: "%", ref: "37–47", num: 40, refMin: 37, refMax: 47 },
          { param: "PT (Protrombin Time)", value: "11,5", unit: "detik", ref: "11–13,5", num: 11.5, refMin: 11, refMax: 13.5 },
          { param: "HbA1c", value: "6,0", unit: "%", ref: "< 5,7", num: 6.0, refMin: null, refMax: 5.7 },
        ],
      },
      {
        title: "Monitoring — Rawat Inap",
        date: "16 April 2022 (Hari 5)",
        items: [
          { param: "Gula darah puasa", value: "118", unit: "mg/dL", ref: "70–100", num: 118, refMin: 70, refMax: 100 },
          { param: "Kreatinin serum", value: "0,8", unit: "mg/dL", ref: "0,6–1,2", num: 0.8, refMin: 0.6, refMax: 1.2 },
          { param: "Kalium", value: "4,0", unit: "mEq/L", ref: "3,5–5,0", num: 4.0, refMin: 3.5, refMax: 5.0 },
        ],
      },
    ],
    supporting: [
      {
        type: "MSCT Kepala",
        date: "12 April 2022",
        title: "MSCT Kepala tanpa kontras",
        findings: [
          "Tampak lesi hipodens pada regio temporal-parietal sinistra, kesan infark serebri.",
          "Tidak tampak tanda perdarahan intrakranial.",
          "Midline tidak bergeser; ventrikel dalam batas normal.",
          "Atrofi serebri ringan sesuai usia.",
        ],
      },
    ],
    medications: [
      { name: "Aspilet (asam asetilsalisilat)", route: "Oral", dose: "80 mg", freq: "1×1", period: "Hari 1 – pulang", indication: "Antiplatelet pada stroke iskemik non-kardioembolik" },
      { name: "Citicoline", route: "IV", dose: "500 mg", freq: "1×12 jam", period: "Hari 1 – 3", indication: "Neuroprotektor" },
      { name: "Amlodipin", route: "Oral", dose: "10 mg", freq: "1×1", period: "Hari 1 – pulang", indication: "Antihipertensi" },
      { name: "Atorvastatin", route: "Oral", dose: "40 mg", freq: "1×1 (malam)", period: "Hari 1 – pulang", indication: "Penurun lipid / stabilisasi plak" },
      { name: "Paracetamol", route: "Oral", dose: "500 mg", freq: "1×8 jam bila nyeri/demam", period: "Hari 1 – 5", indication: "Analgetik-antipiretik", notes: "Dihentikan hari 5, nyeri kepala teratasi" },
      { name: "Fisioterapi & rehabilitasi medik", route: "—", dose: "—", freq: "2× sehari", period: "Hari 3 – 8", indication: "Mobilisasi bertahap, pencegahan kontraktur" },
    ],
    development: [
      { day: "Hari 1–2", text: "Pasien tirah baring total; fungsi menelan dinilai; diet sonde lunak bertahap ke oral." },
      { day: "Hari 3", text: "Citicoline dihentikan; tekanan darah mulai terkontrol; fisioterapi dimulai." },
      { day: "Hari 5", text: "Kekuatan motorik membaik (4/5); paracetamol dihentikan; pasien mulai duduk di tepi tempat tidur." },
      { day: "Hari 8", text: "Pasien dipulangkan dengan kontrol poli saraf 1 minggu kemudian." },
    ],
    dischargeMeds: [
      { name: "Aspilet", route: "Oral", dose: "80 mg", freq: "1×1", period: "Obat pulang", indication: "Pencegahan sekunder stroke iskemik" },
      { name: "Amlodipin", route: "Oral", dose: "10 mg", freq: "1×1", period: "Obat pulang", indication: "Kontrol tekanan darah" },
      { name: "Atorvastatin", route: "Oral", dose: "20 mg", freq: "1×1 malam", period: "Obat pulang", indication: "Terapi lipid jangka panjang" },
    ],
  },

  /* ============ CASE 2 — STROKE ICH + HT STAGE II ============ */
  {
    id: "case-2",
    number: 2,
    title: "Stroke ICH + Hipertensi Stadium II",
    shortTitle: "Case 2",
    diagnosis: "Stroke Hemoragik (Intracerebral Hemorrhage) + Hipertensi Stadium II (JNC VII)",
    system: "Neurologi / Serebrovaskular",
    tags: ["Neurologi", "Stroke", "Kardiovaskular", "Gawat Darurat"],
    estTime: "± 60 menit",
    description:
      "Pasien laki-laki dengan penurunan kesadaran dan muntah; CT scan menunjukkan perdarahan intraserebral dengan hipertensi berat.",
    profile: [
      { label: "Nama Pasien", value: "Tn. HS" },
      { label: "Usia", value: "55 tahun" },
      { label: "Jenis Kelamin", value: "Laki-laki" },
      { label: "Berat Badan", value: "70 kg" },
      { label: "Tinggi Badan", value: "168 cm" },
      { label: "Nomor RM", value: "07.33.19" },
      { label: "Tanggal MRS", value: "3 Mei 2022" },
      { label: "Tanggal KRS", value: "12 Mei 2022" },
      { label: "Diagnosis", value: "Stroke hemoragik (ICH) ganglia basalis sinistra; Hipertensi stadium II (JNC VII)" },
      { label: "Riwayat Penyakit", value: "Hipertensi sejak 3 tahun, tidak terkontrol, tidak rutin berobat" },
      { label: "Riwayat Pengobatan", value: "Amlodipin 5 mg 1×1 - sering terputus (obat habis tidak ditebus)" },
      { label: "Riwayat Alergi", value: "Tidak ada" },
      { label: "Riwayat Sosial", value: "Pedagang; merokok ± 1 bungkus/hari sejak 20 tahun; kopi 2–3 gelas/hari" },
    ],
    complaint: [
      "Keluhan utama: penurunan kesadaran sejak ± 3 jam SMRS, didahului nyeri kepala hebat dan muntah 2 kali.",
      "Anggota keluarga melaporkan kelemahan anggota gerak kanan dan bicara tidak jelas.",
      "Riwayat tekanan darah sering tinggi (terakhir diukur 180/110 mmHg di puskesmas 2 bulan lalu).",
    ],
    history: [
      {
        title: "Riwayat Penyakit Sekarang",
        items: [
          "Nyeri kepala hebat mendadak saat beraktivitas, disusul muntah proyektil 2 kali.",
          "Kesadaran menurun progresif; dibawa ke IGD dengan GCS E3V3M5 (11).",
        ],
      },
      {
        title: "Perkembangan Diagnosis",
        items: [
          "Hari 1: Stroke hemoragik e.c. ICH ganglia basalis sinistra + Hipertensi stadium II (JNC VII).",
          "Hari 3: Kesadaran membaik (GCS 13); terapi antiedem serebri diturunkan bertahap.",
          "Hari 6: GCS 14–15; mobilisasi bertahap; fokus pada kontrol tekanan darah jangka panjang.",
        ],
      },
    ],
    clinical: {
      days: ["Hari 1", "Hari 2", "Hari 3", "Hari 4", "Hari 5"],
      rows: [
        { name: "Tekanan Darah (Sistol)", unit: "mmHg", values: [210, 190, 170, 160, 150], chart: true, color: "#e11d48" },
        { name: "Tekanan Darah (Diastol)", unit: "mmHg", values: [120, 110, 100, 95, 90], chart: true, color: "#f59e0b" },
        { name: "Nadi", unit: "x/menit", values: [102, 96, 88, 84, 80], chart: true, color: "#0fa79c" },
        { name: "Pernapasan (RR)", unit: "x/menit", values: [24, 22, 20, 20, 18], chart: true, color: "#3b82f6" },
        { name: "Suhu", unit: "°C", values: [37.2, 37.0, 36.8, 36.6, 36.6] },
        { name: "SpO₂", unit: "%", values: [95, 96, 97, 98, 98], chart: true, color: "#8b5cf6" },
        { name: "GCS", unit: "", values: [11, 12, 13, 14, 14], chart: true, color: "#64748b" },
        { name: "Mual/muntah", unit: "", values: ["+", "+", "±", "-", "-"] },
        { name: "Kelemahan ekstremitas kanan", unit: "", values: ["+", "+", "+", "+", "+"] },
        { name: "Pupil", unit: "", values: ["isokor 3/3 mm", "isokor", "isokor", "isokor", "isokor"] },
      ],
      notes: [
        "Tanda peninggian TIK: muntah proyektil, hipertensi berat, penurunan kesadaran.",
        "Urine kateter terpasang; produksi urine hari 1: 1.900 mL/24 jam.",
      ],
    },
    labs: [
      {
        title: "Kimia Klinik — Masuk RS",
        date: "3 Mei 2022",
        items: [
          { param: "Gula darah sewaktu", value: "190", unit: "mg/dL", ref: "70–140", num: 190, refMin: 70, refMax: 140 },
          { param: "Ureum", value: "32", unit: "mg/dL", ref: "10–50", num: 32, refMin: 10, refMax: 50 },
          { param: "Kreatinin serum", value: "1,3", unit: "mg/dL", ref: "0,6–1,2", num: 1.3, refMin: 0.6, refMax: 1.2 },
          { param: "Natrium", value: "140", unit: "mEq/L", ref: "135–145", num: 140, refMin: 135, refMax: 145 },
          { param: "Kalium", value: "3,4", unit: "mEq/L", ref: "3,5–5,0", num: 3.4, refMin: 3.5, refMax: 5.0 },
          { param: "Kolesterol total", value: "236", unit: "mg/dL", ref: "< 200", num: 236, refMin: null, refMax: 200 },
          { param: "LDL kolesterol", value: "150", unit: "mg/dL", ref: "< 100", num: 150, refMin: null, refMax: 100 },
          { param: "Asam urat", value: "8,2", unit: "mg/dL", ref: "3,5–7,0", num: 8.2, refMin: 3.5, refMax: 7.0 },
        ],
      },
      {
        title: "Hematologi & Hemostasis — Masuk RS",
        date: "3 Mei 2022",
        items: [
          { param: "Leukosit", value: "13.500", unit: "/µL", ref: "4.000–10.000", num: 13500, refMin: 4000, refMax: 10000 },
          { param: "Hemoglobin", value: "14,1", unit: "g/dL", ref: "13–17", num: 14.1, refMin: 13, refMax: 17 },
          { param: "Trombosit", value: "295.000", unit: "/µL", ref: "150.000–400.000", num: 295000, refMin: 150000, refMax: 400000 },
          { param: "PT", value: "12,0", unit: "detik", ref: "11–13,5", num: 12, refMin: 11, refMax: 13.5 },
          { param: "APTT", value: "30", unit: "detik", ref: "25–35", num: 30, refMin: 25, refMax: 35 },
        ],
      },
      {
        title: "Monitoring Elektrolit — Hari 4",
        date: "6 Mei 2022",
        items: [
          { param: "Kalium", value: "3,8", unit: "mEq/L", ref: "3,5–5,0", num: 3.8, refMin: 3.5, refMax: 5.0 },
          { param: "Kreatinin serum", value: "1,1", unit: "mg/dL", ref: "0,6–1,2", num: 1.1, refMin: 0.6, refMax: 1.2 },
        ],
      },
    ],
    supporting: [
      {
        type: "CT Scan Kepala",
        date: "3 Mei 2022",
        title: "CT Scan kepala tanpa kontras",
        findings: [
          "Tampak lesi hiperdens pada ganglia basalis sinistra, volume perdarahan ± 20 cc.",
          "Edema perifokal di sekitar hematom.",
          "Midline bergeser ± 3 mm ke kanan; ventrikel kiri tampak menyempit.",
          "Sulci masih tampak; tidak tampak perdarahan subaraknoid.",
        ],
      },
      {
        type: "EKG",
        date: "3 Mei 2022",
        title: "Elektrokardiografi 12 sadapan",
        findings: ["Irama sinus 102×/menit; hipertrofi ventrikel kiri (LVH) dengan strain pattern."],
      },
    ],
    medications: [
      { name: "Manitol 20%", route: "IV drip", dose: "100 mL", freq: "1×8 jam", period: "Hari 1 – 4", indication: "Penurun tekanan intrakranial (osmotik diuretik)", notes: "Dihentikan bertahap hari 4–5" },
      { name: "Nicardipin", route: "IV drip (syringe pump)", dose: "5 mg/jam, titrasi", freq: "kontinyu", period: "Hari 1 – 2", indication: "Kontrol tekanan darah akut pada stroke hemoragik" },
      { name: "Amlodipin", route: "NGT/Oral", dose: "10 mg", freq: "1×1", period: "Hari 2 – pulang", indication: "Antihipertensi pemeliharaan" },
      { name: "Captopril", route: "NGT/Oral", dose: "12,5 mg", freq: "2×1", period: "Hari 3 – pulang", indication: "Antihipertensi tambahan" },
      { name: "Ondansetron", route: "IV", dose: "4 mg", freq: "1×8 jam", period: "Hari 1 – 3", indication: "Antiemetik" },
      { name: "Paracetamol", route: "IV drip", dose: "1 g", freq: "1×8 jam", period: "Hari 1 – 3", indication: "Analgetik-antipiretik" },
      { name: "Ranitidin", route: "IV", dose: "50 mg", freq: "1×12 jam", period: "Hari 1 – 5", indication: "Pencegahan ulkus stres" },
      { name: "KCl SR (kalium klorida lepas lambat)", route: "Oral", dose: "600 mg", freq: "2×1", period: "Hari 2 – 5", indication: "Koreksi hipokalemia ringan" },
    ],
    development: [
      { day: "Hari 1", text: "Penanganan TIK tinggi: elevasi kepala 30°, manitol, kontrol TD titrasi nicardipin." },
      { day: "Hari 3", text: "Nicardipin drip disapih; beralih ke antihipertensi oral; manitol mulai diturunkan." },
      { day: "Hari 5", text: "Manitol dihentikan; GCS 14; edema perifokal berkurang secara klinis." },
      { day: "Hari 9", text: "Pulang; edukasi kepatuhan antihipertensi dan berhenti merokok; kontrol poli saraf." },
    ],
    dischargeMeds: [
      { name: "Amlodipin", route: "Oral", dose: "10 mg", freq: "1×1", period: "Obat pulang", indication: "Antihipertensi" },
      { name: "Captopril", route: "Oral", dose: "12,5 mg", freq: "2×1", period: "Obat pulang", indication: "Antihipertensi kombinasi" },
    ],
  },

  /* ===== CASE 3 — STEMI ANTERIOR EKSTENSIF ===== */
  {
    id: "case-3",
    number: 3,
    title: "STEMI Anterior Ekstensif",
    shortTitle: "Case 3",
    diagnosis: "STEMI Anterior Ekstensif (post Primary PCI) + Hipertensi + Hiperkolesterolemia",
    system: "Kardiovaskular",
    tags: ["Kardiovaskular", "Infark Miokard", "Gawat Darurat"],
    estTime: "± 75 menit",
    description:
      "Nyeri dada tipikal onset 4 jam, elevasi segmen ST V1–V6; pasien menjalani primary PCI dengan pemasangan stent pada LAD proksimal.",
    profile: [
      { label: "Nama Pasien", value: "Tn. AR" },
      { label: "Usia", value: "52 tahun" },
      { label: "Jenis Kelamin", value: "Laki-laki" },
      { label: "Berat Badan", value: "75 kg" },
      { label: "Tinggi Badan", value: "170 cm" },
      { label: "Nomor RM", value: "06.91.02" },
      { label: "Tanggal MRS", value: "18 Juni 2022" },
      { label: "Tanggal KRS", value: "24 Juni 2022" },
      { label: "Diagnosis", value: "STEMI anterior ekstensif onset 4 jam, Killip I; Hipertensi; Hiperkolesterolemia" },
      { label: "Riwayat Penyakit", value: "Hipertensi sejak 2 tahun; nyeri dada hilang-timbul 2 minggu terakhir" },
      { label: "Riwayat Pengobatan", value: "Amlodipin 5 mg 1×1; antasida bila nyeri ulu hati" },
      { label: "Riwayat Alergi", value: "Tidak ada" },
      { label: "Riwayat Sosial", value: "Karyawan swasta; perokok berat ± 1 bungkus/hari selama 25 tahun" },
    ],
    complaint: [
      "Keluhan utama: nyeri dada kiri menjalar ke lengan kiri dan rahang, seperti ditekan benda berat, sejak ± 4 jam SMRS, tidak membaik dengan istirahat.",
      "Disertai keringat dingin, mual, dan rasa cemas; nyeri VAS 7/10 saat tiba di IGD.",
      "Tidak ada riwayat trauma; nyeri tidak dipengaruhi gerakan.",
    ],
    history: [
      {
        title: "Riwayat Penyakit Sekarang",
        items: [
          "Angina pektoris tidak stabil 2 minggu terakhir dengan frekuensi meningkat.",
          "Episode saat ini lebih berat dan menetap > 30 menit.",
        ],
      },
      {
        title: "Faktor Risiko",
        items: ["Merokok berat 25 tahun;", "Hipertensi;", "Hiperkolesterolemia belum pernah diobati."],
      },
    ],
    clinical: {
      days: ["Hari 1", "Hari 2", "Hari 3", "Hari 4", "Hari 5"],
      rows: [
        { name: "Tekanan Darah (Sistol)", unit: "mmHg", values: [160, 150, 130, 120, 130], chart: true, color: "#e11d48" },
        { name: "Tekanan Darah (Diastol)", unit: "mmHg", values: [100, 95, 85, 80, 80], chart: true, color: "#f59e0b" },
        { name: "Nadi", unit: "x/menit", values: [98, 90, 84, 80, 78], chart: true, color: "#0fa79c" },
        { name: "Pernapasan (RR)", unit: "x/menit", values: [24, 22, 20, 18, 18], chart: true, color: "#3b82f6" },
        { name: "Suhu", unit: "°C", values: [36.5, 36.6, 36.7, 36.6, 36.5] },
        { name: "SpO₂", unit: "%", values: [94, 96, 98, 99, 99], chart: true, color: "#8b5cf6" },
        { name: "Nyeri dada (VAS)", unit: "", values: ["7", "3", "1", "0", "0"] },
        { name: "Sesak napas", unit: "", values: ["±", "-", "-", "-", "-"] },
        { name: "Mual", unit: "", values: ["+", "±", "-", "-", "-"] },
      ],
      notes: ["Killip I saat masuk; tidak ada tanda gagal jantung selama perawatan."],
    },
    labs: [
      {
        title: "Biomarker Jantung — IGD",
        date: "18 Juni 2022",
        items: [
          { param: "Troponin I", value: "12,0", unit: "ng/mL", ref: "< 0,04", num: 12, refMin: null, refMax: 0.04 },
          { param: "CK-MB", value: "85", unit: "U/L", ref: "< 24", num: 85, refMin: null, refMax: 24 },
          { param: "CK total", value: "780", unit: "U/L", ref: "26–192", num: 780, refMin: 26, refMax: 192 },
        ],
      },
      {
        title: "Kimia Klinik & Lipid — IGD",
        date: "18 Juni 2022",
        items: [
          { param: "Gula darah sewaktu", value: "150", unit: "mg/dL", ref: "70–140", num: 150, refMin: 70, refMax: 140 },
          { param: "Kolesterol total", value: "260", unit: "mg/dL", ref: "< 200", num: 260, refMin: null, refMax: 200 },
          { param: "LDL kolesterol", value: "170", unit: "mg/dL", ref: "< 100", num: 170, refMin: null, refMax: 100 },
          { param: "HDL kolesterol", value: "38", unit: "mg/dL", ref: "40–60", num: 38, refMin: 40, refMax: 60 },
          { param: "Trigliserida", value: "210", unit: "mg/dL", ref: "< 150", num: 210, refMin: null, refMax: 150 },
          { param: "Ureum", value: "25", unit: "mg/dL", ref: "10–50", num: 25, refMin: 10, refMax: 50 },
          { param: "Kreatinin serum", value: "1,0", unit: "mg/dL", ref: "0,6–1,2", num: 1.0, refMin: 0.6, refMax: 1.2 },
          { param: "Natrium", value: "139", unit: "mEq/L", ref: "135–145", num: 139, refMin: 135, refMax: 145 },
          { param: "Kalium", value: "4,0", unit: "mEq/L", ref: "3,5–5,0", num: 4.0, refMin: 3.5, refMax: 5.0 },
          { param: "SGOT", value: "68", unit: "U/L", ref: "< 35", num: 68, refMin: null, refMax: 35 },
        ],
      },
      {
        title: "Hematologi Lengkap — IGD",
        date: "18 Juni 2022",
        items: [
          { param: "Leukosit", value: "12.000", unit: "/µL", ref: "4.000–10.000", num: 12000, refMin: 4000, refMax: 10000 },
          { param: "Hemoglobin", value: "14,8", unit: "g/dL", ref: "13–17", num: 14.8, refMin: 13, refMax: 17 },
          { param: "Trombosit", value: "268.000", unit: "/µL", ref: "150.000–400.000", num: 268000, refMin: 150000, refMax: 400000 },
        ],
      },
    ],
    supporting: [
      {
        type: "EKG",
        date: "18 Juni 2022",
        title: "EKG 12 sadapan (IGD)",
        findings: [
          "Irama sinus 98×/menit.",
          "Elevasi segmen ST pada sadapan V1–V6, I, dan aVL dengan gelombang Q patologis awal.",
          "Kesan: STEMI anterior ekstensif.",
        ],
      },
      {
        type: "Cathlab — Angiografi Koroner",
        date: "18 Juni 2022",
        title: "Kateterisasi jantung (primary PCI)",
        findings: [
          "LAD proksimal: oklusi total (TIMI 0).",
          "LCx dan RCA: irregularitas minor < 50%, tanpa stenosis signifikan.",
          "Dilakukan PCI dengan pemasangan 1 stent drug-eluting pada LAD proksimal.",
          "Hasil akhir: aliran TIMI 3, stenosis residual 0%.",
        ],
      },
      {
        type: "Echocardiography",
        date: "20 Juni 2022",
        title: "Ekokardiografi transtorakal (pasca PCI)",
        findings: [
          "Hipokinetik dinding anterior dan septal apikal.",
          "Fruksi ejeksi (EF) 45% (Teichholz).",
          "Tidak tampak aneurisma ventrikel maupun trombus mural.",
        ],
      },
    ],
    medications: [
      { name: "Aspirin", route: "Oral (kunyah saat loading)", dose: "300 mg loading → 80 mg", freq: "1×1", period: "Hari 1 – pulang", indication: "Antiplatelet — terapi dasar SKA" },
      { name: "Clopidogrel", route: "Oral", dose: "600 mg loading → 75 mg", freq: "1×1", period: "Hari 1 – pulang", indication: "Antiplatelet tambahan (DAPT pasca stent)" },
      { name: "Enoxaparin", route: "SC", dose: "1 mg/kgBB", freq: "1×12 jam", period: "Hari 1 – 2", indication: "Antikoagulan peri-PCI" },
      { name: "Atorvastatin", route: "Oral", dose: "40 mg", freq: "1×1 malam", period: "Hari 1 – pulang", indication: "Statin intensitas tinggi" },
      { name: "Amlodipin", route: "Oral", dose: "10 mg", freq: "1×1", period: "Hari 1 – 2", indication: "Antihipertensi", notes: "Diganti ramipril setelah stabil" },
      { name: "Ramipril", route: "Oral", dose: "2,5 mg", freq: "1×1", period: "Hari 3 – pulang", indication: "ACE-inhibitor pasca IMA / proteksi remodeling" },
      { name: "Bisoprolol", route: "Oral", dose: "2,5 mg → 5 mg", freq: "1×1", period: "Hari 2 – pulang", indication: "Betabloker pasca IMA" },
      { name: "ISDN", route: "Oral", dose: "5 mg", freq: "3×1", period: "Hari 1 – 4", indication: "Antiangina", notes: "Dihentikan hari 4, bebas angina" },
      { name: "Morfin", route: "IV", dose: "2 mg", freq: "bila nyeri menetap", period: "Hari 1", indication: "Analgesia nyeri iskemik", notes: "1× pemberian" },
      { name: "Pantoprazole", route: "IV/Oral", dose: "40 mg", freq: "1×1", period: "Hari 1 – 5", indication: "Profilaksis perdarahan GI pada DAPT" },
    ],
    development: [
      { day: "Hari 1", text: "Primary PCI < 90 menit sejak door-to-balloon; stent LAD; pasca tindakan stabil, dipantau di ICCU." },
      { day: "Hari 2", text: "Bebas angina; enoxaparin dihentikan; bisoprolol dimulai." },
      { day: "Hari 3", text: "Amlodipin diganti ramipril; mobilisasi bertahap." },
      { day: "Hari 6", text: "Pulang dengan edukasi DAPT 12 bulan dan program rehabilitasi jantung." },
    ],
    dischargeMeds: [
      { name: "Aspirin", route: "Oral", dose: "80 mg", freq: "1×1", period: "Obat pulang", indication: "DAPT (lanjutkan jangka panjang)" },
      { name: "Clopidogrel", route: "Oral", dose: "75 mg", freq: "1×1", period: "Obat pulang", indication: "DAPT selama 12 bulan pasca stent" },
      { name: "Atorvastatin", route: "Oral", dose: "40 mg", freq: "1×1 malam", period: "Obat pulang", indication: "Target LDL < 70 mg/dL" },
      { name: "Bisoprolol", route: "Oral", dose: "5 mg", freq: "1×1", period: "Obat pulang", indication: "Kontrol HR & proteksi pasca IMA" },
      { name: "Ramipril", route: "Oral", dose: "2,5 mg", freq: "1×1", period: "Obat pulang", indication: "Mencegah remodeling ventrikel" },
    ],
  },

  /* ===== CASE 4 — ADHF + AF MODERATE + HT TERKONTROL ===== */
  {
    id: "case-4",
    number: 4,
    title: "ADHF + Atrial Fibrilasi Moderate",
    shortTitle: "Case 4",
    diagnosis: "Acute Decompensated Heart Failure (ADHF) + AF Moderate Response + Hipertensi Terkontrol",
    system: "Kardiovaskular",
    tags: ["Kardiovaskular", "Gagal Jantung", "Aritmia"],
    estTime: "± 75 menit",
    description:
      "Pasien geriatri dengan sesak berat dan edema tungkai, riwayat AV block dengan temporary pacemaker; gagal jantung dekompensasi dengan fibrilasi atrium.",
    profile: [
      { label: "Nama Pasien", value: "Ny. RS" },
      { label: "Usia", value: "70 tahun" },
      { label: "Jenis Kelamin", value: "Perempuan" },
      { label: "Berat Badan", value: "62 kg" },
      { label: "Tinggi Badan", value: "150 cm" },
      { label: "Nomor RM", value: "05.44.77" },
      { label: "Tanggal MRS", value: "2 Agustus 2022" },
      { label: "Tanggal KRS", value: "10 Agustus 2022" },
      { label: "Diagnosis", value: "ADHF (NYHA III–IV); Atrial fibrilasi moderate response; Hipertensi terkontrol; riwayat AV block total — post temporary pacemaker" },
      { label: "Riwayat Penyakit", value: "Hipertensi sejak 10 tahun; sinkope berulang 1 bulan terakhir" },
      { label: "Riwayat Pengobatan", value: "Amlodipin 10 mg 1×1; furosemid 40 mg 1×1 (sering tidak diminum saat merasa sehat)" },
      { label: "Riwayat Alergi", value: "Tidak ada" },
      { label: "Riwayat Sosial", value: "Pensiunan guru; tinggal bersama anak; tidak merokok" },
    ],
    complaint: [
      "Keluhan utama: sesak napas memberat sejak 3 hari, memburuk saat beraktivitas dan berbaring (ortopnea, tidur dengan 3 bantal).",
      "Bengkak pada kedua tungkai sejak 1 minggu; jantung berdebar tidak teratur.",
      "Riwayat 1 bulan lalu: dokumentasi EKG AV block total dengan HR 40×/menit — dipasang temporary pacemaker (TPM) selama 5 hari, dilepas setelah irama membaik; direncanakan evaluasi pacemaker permanen.",
    ],
    history: [
      {
        title: "Riwayat AV Block & Temporary Pacemaker",
        items: [
          "1 bulan SMRS: EKG menunjukkan AV block total, HR 40×/menit, keluhan sinkope.",
          "Dipasang temporary pacemaker transvena; TPM dilepas hari ke-5 setelah irama sinus jaras.",
          "Pasien menolak pemasangan pacemaker permanen saat itu; kontrol poli jantung tidak teratur.",
        ],
      },
      {
        title: "Perkembangan Diagnosis",
        items: [
          "Hari 1: ADHF e.c. hipertensi + AF moderate response (HR 110×/menit).",
          "Hari 3: Sesak membaik dengan diuretik; edema menurun.",
          "Hari 6: Kompensasi tercapai; transisi ke terapi oral; edukasi restriksi cairan-garam.",
        ],
      },
    ],
    clinical: {
      days: ["Hari 1", "Hari 2", "Hari 3", "Hari 4", "Hari 5"],
      rows: [
        { name: "Tekanan Darah (Sistol)", unit: "mmHg", values: [140, 130, 125, 120, 120], chart: true, color: "#e11d48" },
        { name: "Tekanan Darah (Diastol)", unit: "mmHg", values: [85, 80, 80, 75, 75], chart: true, color: "#f59e0b" },
        { name: "Nadi (ireguler)", unit: "x/menit", values: [110, 102, 96, 88, 80], chart: true, color: "#0fa79c" },
        { name: "Pernapasan (RR)", unit: "x/menit", values: [28, 26, 24, 20, 18], chart: true, color: "#3b82f6" },
        { name: "Suhu", unit: "°C", values: [36.6, 36.5, 36.6, 36.5, 36.6] },
        { name: "SpO₂", unit: "%", values: [90, 93, 96, 97, 98], chart: true, color: "#8b5cf6" },
        { name: "Balance cairan", unit: "mL/24 jam", values: ["+1.200", "+600", "0", "-400", "-800"] },
        { name: "Edema tungkai", unit: "", values: ["++", "++", "+", "+", "±"] },
        { name: "Ortopnea / PND", unit: "", values: ["+", "+", "±", "-", "-"] },
        { name: "Ronki basal paru", unit: "", values: ["+", "+", "±", "-", "-"] },
      ],
      notes: [
        "Produksi urine hari 1: 2.100 mL setelah furosemid IV.",
        "Berat badan turun 2,5 kg selama 5 hari perawatan.",
      ],
    },
    labs: [
      {
        title: "Kimia Klinik — Masuk RS",
        date: "2 Agustus 2022",
        items: [
          { param: "NT-proBNP", value: "5.400", unit: "pg/mL", ref: "< 300", num: 5400, refMin: null, refMax: 300 },
          { param: "Natrium", value: "132", unit: "mEq/L", ref: "135–145", num: 132, refMin: 135, refMax: 145 },
          { param: "Kalium", value: "4,5", unit: "mEq/L", ref: "3,5–5,0", num: 4.5, refMin: 3.5, refMax: 5.0 },
          { param: "Kreatinin serum", value: "1,4", unit: "mg/dL", ref: "0,6–1,2", num: 1.4, refMin: 0.6, refMax: 1.2 },
          { param: "Ureum", value: "45", unit: "mg/dL", ref: "10–50", num: 45, refMin: 10, refMax: 50 },
          { param: "Gula darah sewaktu", value: "124", unit: "mg/dL", ref: "70–140", num: 124, refMin: 70, refMax: 140 },
          { param: "Albumin", value: "3,4", unit: "g/dL", ref: "3,5–5,0", num: 3.4, refMin: 3.5, refMax: 5.0 },
          { param: "SGOT", value: "28", unit: "U/L", ref: "< 35", num: 28, refMin: null, refMax: 35 },
          { param: "SGPT", value: "25", unit: "U/L", ref: "< 35", num: 25, refMin: null, refMax: 35 },
        ],
      },
      {
        title: "Monitoring — Hari 4",
        date: "5 Agustus 2022",
        items: [
          { param: "Natrium", value: "134", unit: "mEq/L", ref: "135–145", num: 134, refMin: 135, refMax: 145 },
          { param: "Kalium", value: "3,6", unit: "mEq/L", ref: "3,5–5,0", num: 3.6, refMin: 3.5, refMax: 5.0 },
          { param: "Kreatinin serum", value: "1,1", unit: "mg/dL", ref: "0,6–1,2", num: 1.1, refMin: 0.6, refMax: 1.2 },
          { param: "INR", value: "1,4", unit: "", ref: "2,0–3,0 (target AF)", num: 1.4, refMin: 2, refMax: 3 },
        ],
      },
    ],
    supporting: [
      {
        type: "EKG",
        date: "2 Agustus 2022",
        title: "EKG 12 sadapan",
        findings: [
          "Atrial fibrilasi dengan respons ventrikel moderate, HR 110×/menit.",
          "Gelombang P tidak tampak; interval RR ireguler.",
          "LVH dengan repolarisasi abnormal sekunder.",
        ],
      },
      {
        type: "Foto Thorax",
        date: "2 Agustus 2022",
        title: "Roentgen thorax PA",
        findings: [
          "Kardiomegali, CTR 65%.",
          "Tampak kongesti vena pulmonalis dan infiltrat interstisial basal bilateral.",
          "Efusi pleura minimal kanan.",
        ],
      },
      {
        type: "Echocardiography",
        date: "4 Agustus 2022",
        title: "Ekokardiografi transtorakal",
        findings: [
          "EF 40% (Simpson); disfungsi sistolik LV sedang.",
          "Hipertrofi ventrikel kiri konsentrik; dilatasi atrium kiri.",
          "Regurgitasi mitral ringan; tidak ada trombus atrium yang terlihat.",
        ],
      },
      {
        type: "Klirens Kreatinin",
        date: "2 Agustus 2022",
        title: "Estimasi fungsi ginjal (Cockcroft–Gault)",
        findings: [
          "CrCl = ((140 − 70) × 62) / (72 × 1,4) × 0,85 ≈ 36 mL/menit.",
          "Kategori penurunan fungsi ginjal sedang — relevan untuk penyesuaian dosis digoxin dan pemilihan diuretik.",
        ],
      },
    ],
    medications: [
      { name: "Furosemid", route: "IV drip/injeksi", dose: "40 mg", freq: "1×12 jam", period: "Hari 1 – 4", indication: "Dekongesti — diuretik loop pada ADHF", notes: "Beralih ke oral 40 mg 1×1 hari 5" },
      { name: "Digoxin", route: "Oral", dose: "0,25 mg", freq: "1×1", period: "Hari 1 – pulang", indication: "Kontrol laju ventrikel pada AF + gagal jantung" },
      { name: "Spironolakton", route: "Oral", dose: "25 mg", freq: "1×1", period: "Hari 1 – pulang", indication: "Antagonis aldosteron pada HFrEF" },
      { name: "Ramipril", route: "Oral", dose: "2,5 mg", freq: "1×1", period: "Hari 2 – pulang", indication: "ACE-inhibitor pada HFrEF + hipertensi" },
      { name: "Bisoprolol", route: "Oral", dose: "1,25 mg", freq: "1×1", period: "Hari 4 – pulang", indication: "Betabloker dosis rendah setelah euvolemia" },
      { name: "Warfarin", route: "Oral", dose: "2 mg", freq: "1×1 (sore)", period: "Hari 2 – pulang", indication: "Antikoagulasi AF (CHA₂DS₂-VASc tinggi)" },
      { name: "Omeprazole", route: "Oral", dose: "20 mg", freq: "1×1", period: "Hari 1 – 8", indication: "Gastritis / profilaksis GI" },
    ],
    development: [
      { day: "Hari 1", text: "Oksigen nasal 3 lpm; tirah baring posisi semi-Fowler; balance cairan ketat." },
      { day: "Hari 3", text: "Respirasi membaik; furosemid IV mulai diturunkan; INR belum terapeutik." },
      { day: "Hari 5", text: "Euvolemia tercapai; furosemid oral; bisoprolol dimulai dosis rendah." },
      { day: "Hari 8", text: "Pulang; kontrol INR 3 hari; edukasi timbang BB harian dan restriksi garam." },
    ],
    dischargeMeds: [
      { name: "Furosemid", route: "Oral", dose: "40 mg", freq: "1×1 pagi", period: "Obat pulang", indication: "Pemeliharaan dekongesti" },
      { name: "Spironolakton", route: "Oral", dose: "25 mg", freq: "1×1", period: "Obat pulang", indication: "Antagonis aldosteron" },
      { name: "Digoxin", route: "Oral", dose: "0,25 mg", freq: "1×1", period: "Obat pulang", indication: "Kontrol laju ventrikel AF" },
      { name: "Ramipril", route: "Oral", dose: "2,5 mg", freq: "1×1", period: "Obat pulang", indication: "HFrEF + hipertensi" },
      { name: "Bisoprolol", route: "Oral", dose: "1,25 mg", freq: "1×1", period: "Obat pulang", indication: "Titrasi bertahap di poli" },
      { name: "Warfarin", route: "Oral", dose: "2 mg", freq: "1×1 sore", period: "Obat pulang", indication: "Antikoagulasi — kontrol INR rutin" },
    ],
  },

  /* ===== CASE 5 — ACUTE TRANSMURAL MYOCARDIAL INFARCTION ===== */
  {
    id: "case-5",
    number: 5,
    title: "Acute Transmural Myocardial Infarction",
    shortTitle: "Case 5",
    diagnosis: "Acute Transmural Myocardial Infarction (IMA Inferior) Killip II",
    system: "Kardiovaskular",
    tags: ["Kardiovaskular", "Infark Miokard", "Gawat Darurat"],
    estTime: "± 60 menit",
    description:
      "Nyeri dada retrosternal onset > 12 jam dengan elevasi ST inferior; dikelola konservatif dengan terapi antitrombotik dan antiiskemia.",
    profile: [
      { label: "Nama Pasien", value: "Tn. DP" },
      { label: "Usia", value: "58 tahun" },
      { label: "Jenis Kelamin", value: "Laki-laki" },
      { label: "Berat Badan", value: "72 kg" },
      { label: "Tinggi Badan", value: "165 cm" },
      { label: "Nomor RM", value: "09.27.51" },
      { label: "Tanggal MRS", value: "9 September 2022" },
      { label: "Tanggal KRS", value: "16 September 2022" },
      { label: "Diagnosis", value: "Acute transmural myocardial infarction (dinding inferior) onset > 12 jam, Killip II; Dislipidemia" },
      { label: "Riwayat Penyakit", value: "Nyeri dada tipikal sejak ± 14 jam SMRS; riwayat dispepsia berulang" },
      { label: "Riwayat Pengobatan", value: "Antasida dan omeprazole OTC bila nyeri ulu hati" },
      { label: "Riwayat Alergi", value: "Tidak ada" },
      { label: "Riwayat Sosial", value: "Petani; merokok 1 bungkus/hari 30 tahun; aktivitas fisik berat" },
    ],
    complaint: [
      "Keluhan utama: nyeri dada retrosternal menjalar ke punggung, seperti ditindih, onset ± 14 jam SMRS, menetap.",
      "Disertai keringat dingin dan mual 1 kali muntah; sesak ringan.",
      "Pasien sempat menganggap nyeri sebagai 'masuk angin' dan melakukan kerokan sebelum ke RS.",
    ],
    history: [
      {
        title: "Perkembangan Diagnosis",
        items: [
          "Hari 1: Acute transmural myocardial infarction inferior, Killip II — onset > 12 jam sehingga reperfusi akut tidak dilakukan; terapi konservatif.",
          "Hari 3: Bebas angina; ronki menghilang; enzim jantung menurun.",
          "Hari 7: Stabil, dipulangkan dengan terapi pencegahan sekunder.",
        ],
      },
      {
        title: "Faktor Risiko",
        items: ["Merokok 30 tahun;", "Dislipidemia belum terdiagnosis sebelumnya;", "Riwayat keluarga PJK (kakak)."],
      },
    ],
    clinical: {
      days: ["Hari 1", "Hari 2", "Hari 3", "Hari 4", "Hari 5"],
      rows: [
        { name: "Tekanan Darah (Sistol)", unit: "mmHg", values: [150, 140, 130, 125, 125], chart: true, color: "#e11d48" },
        { name: "Tekanan Darah (Diastol)", unit: "mmHg", values: [95, 90, 85, 80, 80], chart: true, color: "#f59e0b" },
        { name: "Nadi", unit: "x/menit", values: [92, 88, 82, 78, 76], chart: true, color: "#0fa79c" },
        { name: "Pernapasan (RR)", unit: "x/menit", values: [24, 22, 20, 20, 18], chart: true, color: "#3b82f6" },
        { name: "Suhu", unit: "°C", values: [36.9, 37.1, 36.8, 36.6, 36.6] },
        { name: "SpO₂", unit: "%", values: [95, 96, 97, 98, 98], chart: true, color: "#8b5cf6" },
        { name: "Nyeri dada (VAS)", unit: "", values: ["6", "3", "1", "0", "0"] },
        { name: "Ronki basal", unit: "", values: ["+", "±", "-", "-", "-"] },
        { name: "Mual/muntah", unit: "", values: ["+", "-", "-", "-", "-"] },
      ],
      notes: ["Killip II: ronki < 50% lapangan paru pada hari 1, menghilang hari 3."],
    },
    labs: [
      {
        title: "Biomarker & Kimia Klinik — IGD",
        date: "9 September 2022",
        items: [
          { param: "Troponin T", value: "2,5", unit: "ng/mL", ref: "< 0,01", num: 2.5, refMin: null, refMax: 0.01 },
          { param: "CK-MB", value: "78", unit: "U/L", ref: "< 24", num: 78, refMin: null, refMax: 24 },
          { param: "Gula darah sewaktu", value: "132", unit: "mg/dL", ref: "70–140", num: 132, refMin: 70, refMax: 140 },
          { param: "HbA1c", value: "6,2", unit: "%", ref: "< 5,7", num: 6.2, refMin: null, refMax: 5.7 },
          { param: "Kolesterol total", value: "232", unit: "mg/dL", ref: "< 200", num: 232, refMin: null, refMax: 200 },
          { param: "LDL kolesterol", value: "158", unit: "mg/dL", ref: "< 100", num: 158, refMin: null, refMax: 100 },
          { param: "HDL kolesterol", value: "40", unit: "mg/dL", ref: "40–60", num: 40, refMin: 40, refMax: 60 },
          { param: "Trigliserida", value: "176", unit: "mg/dL", ref: "< 150", num: 176, refMin: null, refMax: 150 },
          { param: "Kreatinin serum", value: "1,1", unit: "mg/dL", ref: "0,6–1,2", num: 1.1, refMin: 0.6, refMax: 1.2 },
          { param: "Kalium", value: "4,3", unit: "mEq/L", ref: "3,5–5,0", num: 4.3, refMin: 3.5, refMax: 5.0 },
        ],
      },
      {
        title: "Hematologi — IGD",
        date: "9 September 2022",
        items: [
          { param: "Leukosit", value: "11.800", unit: "/µL", ref: "4.000–10.000", num: 11800, refMin: 4000, refMax: 10000 },
          { param: "Hemoglobin", value: "14,5", unit: "g/dL", ref: "13–17", num: 14.5, refMin: 13, refMax: 17 },
          { param: "Trombosit", value: "243.000", unit: "/µL", ref: "150.000–400.000", num: 243000, refMin: 150000, refMax: 400000 },
        ],
      },
      {
        title: "Monitoring — Hari 4",
        date: "12 September 2022",
        items: [
          { param: "CK-MB", value: "20", unit: "U/L", ref: "< 24", num: 20, refMin: null, refMax: 24 },
          { param: "Kreatinin serum", value: "1,0", unit: "mg/dL", ref: "0,6–1,2", num: 1.0, refMin: 0.6, refMax: 1.2 },
          { param: "SGPT", value: "42", unit: "U/L", ref: "< 35", num: 42, refMin: null, refMax: 35 },
        ],
      },
    ],
    supporting: [
      {
        type: "EKG",
        date: "9 September 2022",
        title: "EKG 12 sadapan",
        findings: [
          "Irama sinus 92×/menit.",
          "Elevasi segmen ST pada sadapan II, III, aVF dengan gelombang Q patologis.",
          "Depresi ST resiprokal pada I dan aVL. Kesan: IMA inferior transmural evolusi.",
        ],
      },
      {
        type: "Foto Thorax",
        date: "9 September 2022",
        title: "Roentgen thorax AP (bedside)",
        findings: [
          "Ukuran jantung batas atas normal (CTR ± 55%).",
          "Sedikit peningkatan corakan bronkovaskular basal; tidak tampak edema paru frank.",
        ],
      },
      {
        type: "Echocardiography",
        date: "11 September 2022",
        title: "Ekokardiografi transtorakal",
        findings: [
          "Hipokinetik segmen inferior dan inferoposterior.",
          "EF 52%; dimensi LV normal; fungsi diastolik menurun grade I.",
          "Tidak tampak komplikasi mekanik (VSD, ruptur otot papilaris).",
        ],
      },
    ],
    medications: [
      { name: "Aspirin", route: "Oral", dose: "300 mg loading → 100 mg", freq: "1×1", period: "Hari 1 – pulang", indication: "Antiplatelet dasar SKA" },
      { name: "Clopidogrel", route: "Oral", dose: "300 mg loading → 75 mg", freq: "1×1", period: "Hari 1 – pulang", indication: "Antiplatelet tambahan (DAPT)" },
      { name: "Enoxaparin", route: "SC", dose: "1 mg/kgBB", freq: "1×12 jam", period: "Hari 1 – 5", indication: "Antikoagulan pada SKA konservatif" },
      { name: "Nitrokaf (GTN)", route: "IV drip", dose: "5 µg/menit, titrasi", freq: "kontinyu", period: "Hari 1 – 2", indication: "Antiiskemia / vasodilator koroner" },
      { name: "ISDN", route: "Oral", dose: "5 mg", freq: "3×1", period: "Hari 2 – pulang", indication: "Antiangina oral" },
      { name: "Captopril", route: "Oral", dose: "6,25 mg → 12,5 mg", freq: "2×1", period: "Hari 1 – pulang", indication: "ACE-inhibitor pasca IMA" },
      { name: "Bisoprolol", route: "Oral", dose: "2,5 mg", freq: "1×1", period: "Hari 2 – pulang", indication: "Betabloker pasca IMA" },
      { name: "Atorvastatin", route: "Oral", dose: "20 mg → 40 mg", freq: "1×1 malam", period: "Hari 1 – pulang", indication: "Statin", notes: "Dosis dinaikkan hari 3" },
      { name: "Omeprazole", route: "Oral", dose: "20 mg", freq: "1×1", period: "Hari 1 – 7", indication: "Dyspepsia / profilaksis GI" },
      { name: "Paracetamol", route: "Oral", dose: "500 mg", freq: "1×8 jam bila nyeri", period: "Hari 1 – 3", indication: "Analgetik" },
    ],
    development: [
      { day: "Hari 1", text: "Masuk ICCU; onset > 12 jam → strategi konservatif: DAPT loading, enoxaparin, nitrat drip." },
      { day: "Hari 2", text: "Bebas angina; nitrokaf disapih, dialihkan ke ISDN oral; bisoprolol dimulai." },
      { day: "Hari 3", text: "Ronki menghilang; atorvastatin dinaikkan ke 40 mg." },
      { day: "Hari 7", text: "Stabil; pulang dengan edukasi berhenti merokok; jadwal rehabilitasi & angiografi elektif." },
    ],
    dischargeMeds: [
      { name: "Aspirin", route: "Oral", dose: "100 mg", freq: "1×1", period: "Obat pulang", indication: "DAPT — jangka panjang" },
      { name: "Clopidogrel", route: "Oral", dose: "75 mg", freq: "1×1", period: "Obat pulang", indication: "DAPT 12 bulan" },
      { name: "Atorvastatin", route: "Oral", dose: "40 mg", freq: "1×1 malam", period: "Obat pulang", indication: "Target LDL < 70 mg/dL" },
      { name: "Bisoprolol", route: "Oral", dose: "2,5 mg", freq: "1×1", period: "Obat pulang", indication: "Kontrol HR/proteksi pasca IMA" },
      { name: "Captopril", route: "Oral", dose: "12,5 mg", freq: "2×1", period: "Obat pulang", indication: "ACE-inhibitor pasca IMA" },
      { name: "ISDN", route: "Oral", dose: "5 mg", freq: "3×1", period: "Obat pulang", indication: "Antiangina" },
    ],
  },
];

export const CASE_FILTERS = [
  "Semua",
  "Kardiovaskular",
  "Neurologi",
  "Stroke",
  "Infark Miokard",
  "Gagal Jantung",
  "Aritmia",
  "Gawat Darurat",
] as const;

export function getCase(id: string | undefined): CaseData | undefined {
  return CASES.find((c) => c.id === id);
}
