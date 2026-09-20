import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  PageBreak,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import type { CaseAnswers, CaseData, FinalReflection, Student } from "../types";
import { EVAL_OPTIONS } from "../types";

/* ============================================================
   DOCX GENERATOR — laporan akademik farmakoterapi.
   Menghasilkan tabel rapi untuk data pasien, laboratorium,
   terapi obat, DRP, dan monitoring plan.
   ============================================================ */

const NAVY = "16304F";
const TEAL = "0D7A72";
const GRAY_BG = "F0F5FB";

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

const safe = (s?: string) => (s && s.trim() ? s.trim() : "—");

/* ---------- primitives ---------- */

function H(text: string, level: 1 | 2 | 3): Paragraph {
  return new Paragraph({
    heading: level === 1 ? HeadingLevel.HEADING_1 : level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
    spacing: { before: level === 1 ? 360 : 240, after: 140 },
    children: [
      new TextRun({
        text,
        bold: true,
        font: "Calibri",
        size: level === 1 ? 30 : level === 2 ? 26 : 23,
        color: level === 1 ? NAVY : level === 2 ? NAVY : TEAL,
      }),
    ],
  });
}

function P(text: string, opts?: { italic?: boolean; bold?: boolean; size?: number; color?: string; spaceAfter?: number }): Paragraph {
  return new Paragraph({
    spacing: { after: opts?.spaceAfter ?? 120, line: 300 },
    alignment: AlignmentType.JUSTIFIED,
    children: [
      new TextRun({
        text,
        font: "Calibri",
        size: opts?.size ?? 22,
        italics: opts?.italic,
        bold: opts?.bold,
        color: opts?.color ?? "222B38",
      }),
    ],
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    spacing: { after: 60, line: 290 },
    bullet: { level: 0 },
    children: [new TextRun({ text, font: "Calibri", size: 22, color: "222B38" })],
  });
}

const NOBORDERS = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

function cell(text: string, opts?: { bold?: boolean; fill?: string; color?: string; width?: number }): TableCell {
  return new TableCell({
    width: opts?.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    shading: opts?.fill ? { type: ShadingType.CLEAR, fill: opts.fill } : undefined,
    margins: { top: 70, bottom: 70, left: 100, right: 100 },
    children: (text || "—").split("\n").map(
      (line) =>
        new Paragraph({
          spacing: { after: 20 },
          children: [
            new TextRun({ text: line, font: "Calibri", size: 18, bold: opts?.bold, color: opts?.color ?? "222B38" }),
          ],
        })
    ),
  });
}

function docTable(headers: string[], rows: string[][]): Table {
  const w = Math.floor(100 / Math.max(headers.length, 1));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((h) => cell(h, { bold: true, fill: NAVY, color: "FFFFFF", width: w })),
      }),
      ...rows.map((r, i) => new TableRow({ children: r.map((c) => cell(safe(c), { width: w, fill: i % 2 ? GRAY_BG : "FFFFFF" })) })),
    ],
  });
}

function kvTable(pairs: { label: string; value: string }[]): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: pairs.map(
      (p, i) =>
        new TableRow({
          children: [cell(p.label, { bold: true, width: 32, fill: i % 2 ? GRAY_BG : "FFFFFF" }), cell(safe(p.value), { width: 68 })],
        })
    ),
  });
}

function spacer(n = 1): Paragraph[] {
  return Array.from({ length: n }, () => new Paragraph({ children: [] }));
}

function cover(student: Student | null, caseTitle: string, caseSubtitle: string, docKind: string): (Paragraph | Table)[] {
  const s = student;
  const nameTable = new Table({
    width: { size: 70, type: WidthType.PERCENTAGE },
    borders: NOBORDERS,
    alignment: AlignmentType.CENTER,
    rows: [
      ["Nama", safe(s?.nama)],
      ["NIM", safe(s?.nim)],
      ["Kelas", safe(s?.kelas)],
      ["Kelompok", safe(s?.kelompok)],
      ["Tanggal Pengerjaan", safe(s?.tanggal)],
      ["Dosen Pengampu", safe(s?.dosen)],
    ].map(
      ([l, v]) =>
        new TableRow({
          children: [
            cell(l, { bold: true, width: 40 }),
            cell(": " + v, { width: 60 }),
          ],
        })
    ),
  });

  return [
    ...spacer(2),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [new TextRun({ text: "FAKULTAS FARMASI", bold: true, size: 34, font: "Calibri", color: NAVY })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: "UNIVERSITAS JEMBER", bold: true, size: 34, font: "Calibri", color: NAVY })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: "FARMAKOTERAPI KARDIOVASKULAR, PERNAPASAN, DAN ENDOKRIN (KPE)",
          bold: true,
          size: 26,
          font: "Calibri",
          color: TEAL,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 500 },
      children: [new TextRun({ text: docKind, bold: true, size: 30, font: "Calibri", color: "222B38" })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [new TextRun({ text: caseTitle, bold: true, size: 30, font: "Calibri", color: NAVY })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [new TextRun({ text: caseSubtitle, size: 22, italics: true, font: "Calibri", color: "55677F" })],
    }),
    nameTable,
  ];
}

/* ---------- pembangun isi per kasus ---------- */

function evalLabel(v: string) {
  return EVAL_OPTIONS.find((o) => o.value === v)?.label ?? "—";
}

function caseBodyChildren(c: CaseData, a: CaseAnswers): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [];

  /* BAB 1 — PROFIL */
  out.push(H("BAB 1 — PROFIL PASIEN", 1));
  out.push(kvTable(c.profile));

  /* BAB 2 — DATA KLINIS */
  out.push(H("BAB 2 — DATA KLINIS", 1));
  out.push(H("2.1 Keluhan Utama", 2));
  c.complaint.forEach((x) => out.push(bullet(x)));
  out.push(H("2.2 Riwayat Penyakit", 2));
  c.history.forEach((h) => {
    out.push(P(h.title, { bold: true, spaceAfter: 60 }));
    h.items.forEach((x) => out.push(bullet(x)));
  });
  out.push(H("2.3 Parameter Klinis Serial", 2));
  out.push(
    docTable(
      ["Parameter", "Satuan", ...c.clinical.days],
      c.clinical.rows.map((r) => [r.name, r.unit ?? "—", ...r.values.map((v) => (v === null || v === undefined ? "—" : String(v)))])
    )
  );
  (c.clinical.notes ?? []).forEach((n) => out.push(P("Catatan: " + n, { italic: true, size: 20, color: "55677F" })));

  /* BAB 3 — LAB */
  out.push(H("BAB 3 — DATA LABORATORIUM", 1));
  c.labs.forEach((g, gi) => {
    out.push(H(`${g.title} (${g.date})`, 2));
    out.push(
      docTable(
        ["Parameter", "Nilai", "Satuan", "Referensi", "Interpretasi Mahasiswa"],
        g.items.map((it, ii) => [it.param, it.value, it.unit || "—", it.ref, a.labInterp[`${gi}-${ii}`] ?? "—"])
      )
    );
  });

  /* BAB 4 — PENUNJANG */
  out.push(H("BAB 4 — PEMERIKSAAN PENUNJANG", 1));
  c.supporting.forEach((ex, i) => {
    out.push(H(`${i + 1}. ${ex.title} — ${ex.type}, ${ex.date}`, 2));
    ex.findings.forEach((f) => out.push(bullet(f)));
    out.push(P("Interpretasi mahasiswa:", { bold: true, spaceAfter: 40 }));
    out.push(P(safe(a.examInterp[i])));
  });

  /* BAB 5 — TERAPI OBAT */
  out.push(H("BAB 5 — TERAPI OBAT", 1));
  out.push(
    docTable(
      ["Nama Obat", "Rute", "Dosis", "Frekuensi", "Periode", "Indikasi"],
      c.medications.map((m) => [m.name, m.route, m.dose, m.freq, m.period, m.indication])
    )
  );
  if (c.development?.length) {
    out.push(H("Perkembangan Terapi", 2));
    out.push(docTable(["Fase", "Perkembangan"], c.development.map((d) => [d.day, d.text])));
  }
  if (c.dischargeMeds?.length) {
    out.push(H("Obat Pulang", 2));
    out.push(
      docTable(
        ["Nama Obat", "Rute", "Dosis", "Frekuensi", "Indikasi"],
        c.dischargeMeds.map((m) => [m.name, m.route, m.dose, m.freq, m.indication])
      )
    );
  }
  out.push(H("Analisis Obat oleh Mahasiswa", 2));
  c.medications.forEach((m, i) => {
    const an = a.medAnalysis[i];
    if (!an) return;
    out.push(P(`${i + 1}. ${m.name}`, { bold: true, spaceAfter: 40 }));
    out.push(
      kvTable([
        { label: "Indikasi pada pasien", value: safe(an.indikasi) },
        { label: "Kesuaian dosis & regimen", value: safe(an.regimen) },
        { label: "Potensi masalah terkait obat", value: safe(an.masalah) },
        { label: "Parameter monitoring", value: safe(an.monitoring) },
        { label: "Efek samping penting", value: safe(an.efekSamping) },
      ])
    );
  });

  /* BAB 6 — ANALISIS MASALAH */
  out.push(H("BAB 6 — ANALISIS MASALAH", 1));
  out.push(P("Identifikasi masalah klinis utama:", { bold: true, spaceAfter: 40 }));
  out.push(P(safe(a.masalah)));
  out.push(P("Assessment kondisi klinis:", { bold: true, spaceAfter: 40 }));
  out.push(P(safe(a.assessment)));
  const evalRows = c.medications
    .map((m, i) => ({ m, e: a.medEval[i] }))
    .filter((x) => x.e && (x.e.status || x.e.alasan));
  if (evalRows.length) {
    out.push(P("Evaluasi terapi per obat:", { bold: true, spaceAfter: 40 }));
    out.push(docTable(["Obat", "Penilaian", "Alasan"], evalRows.map((x) => [x.m.name, evalLabel(x.e.status), x.e.alasan])));
  }

  /* BAB 7 — DRP */
  out.push(H("BAB 7 — DRUG RELATED PROBLEMS (DRP)", 1));
  if (a.drps.length === 0) out.push(P("—"));
  else
    out.push(
      docTable(
        ["No", "Kategori", "Masalah Terkait Obat", "Bukti", "Penyebab", "Dampak Klinis", "Prioritas"],
        a.drps.map((d, i) => [String(i + 1), d.kategori, d.masalah, d.bukti, d.penyebab, d.dampak, d.prioritas || "—"])
      )
    );

  /* BAB 8 — RENCANA FARMAKOTERAPI */
  out.push(H("BAB 8 — RENCANA FARMAKOTERAPI", 1));
  if (a.plans.length === 0) out.push(P("—"));
  else
    out.push(
      docTable(
        ["Masalah Klinis", "Tujuan & Target Terapi", "Pilihan Terapi", "Regimen", "Alasan Pemilihan", "Alternatif", "Durasi", "Monitoring"],
        a.plans.map((p) => [p.masalah, `${p.tujuan}\nTarget: ${p.target}`, p.pilihan, p.regimen, p.alasan, p.alternatif, p.durasi, p.monitoring])
      )
    );

  /* BAB 9 — MONITORING */
  out.push(H("BAB 9 — MONITORING PLAN", 1));
  if (a.monitors.length === 0) out.push(P("—"));
  else
    out.push(
      docTable(
        ["Kategori", "Parameter", "Baseline", "Target", "Frekuensi", "Metode", "Tindakan Bila Tidak Tercapai"],
        a.monitors.map((m) => [m.kategori, m.parameter, m.baseline, m.target, m.frekuensi, m.metode, m.tindakan])
      )
    );

  /* BAB 10 — EDUKASI */
  out.push(H("BAB 10 — EDUKASI PASIEN (PATIENT COUNSELING)", 1));
  out.push(
    kvTable([
      { label: "Informasi penting untuk pasien", value: safe(a.education.informasi) },
      { label: "Cara penggunaan obat", value: safe(a.education.cara) },
      { label: "Efek samping penting", value: safe(a.education.efekSamping) },
      { label: "Kapan kembali ke fasilitas kesehatan", value: safe(a.education.kembali) },
      { label: "Modifikasi gaya hidup", value: safe(a.education.gayaHidup) },
      { label: "Tanda bahaya", value: safe(a.education.tandaBahaya) },
    ])
  );

  /* BAB 11 — SOAP */
  if (a.soap.include) {
    out.push(H("BAB 11 — SOAP NOTE", 1));
    out.push(P("S (Subjective):", { bold: true, spaceAfter: 40 }));
    out.push(P(safe(a.soap.s)));
    out.push(P("O (Objective):", { bold: true, spaceAfter: 40 }));
    out.push(P(safe(a.soap.o)));
    out.push(P("A (Assessment):", { bold: true, spaceAfter: 40 }));
    out.push(P(safe(a.soap.a)));
    out.push(P("P (Plan):", { bold: true, spaceAfter: 40 }));
    out.push(P(safe(a.soap.p)));
  }

  /* BAB 12 — KESIMPULAN */
  out.push(H("BAB 12 — KESIMPULAN", 1));
  out.push(P(safe(a.kesimpulan)));

  /* BAB 13 — REFLEKSI */
  out.push(H("BAB 13 — REFLEKSI PEMBELAJARAN", 1));
  out.push(
    kvTable([
      { label: "Hal terpenting yang dipelajari", value: safe(a.refleksi.dipelajari) },
      { label: "Bagian kasus yang paling sulit dianalisis", value: safe(a.refleksi.tersulit) },
      { label: "Data tambahan yang diperlukan", value: safe(a.refleksi.dataTambahan) },
    ])
  );

  /* REFERENSI */
  out.push(H("DAFTAR PUSTAKA / CLINICAL EVIDENCE", 1));
  const refs = a.references.filter((r) => r.judul.trim());
  if (refs.length === 0) out.push(P("—"));
  else
    refs.forEach((r, i) =>
      out.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({ text: `${i + 1}. ${r.judul}`, font: "Calibri", size: 22, color: "222B38" }),
            new TextRun({
              text: `${r.tahun ? ` (${r.tahun})` : ""}${r.link ? `. ${r.link}` : ""}`,
              font: "Calibri",
              size: 22,
              color: "55677F",
            }),
          ],
        })
      )
    );

  out.push(
    new Paragraph({
      spacing: { before: 500 },
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({
          text: `Dokumen disusun melalui PharmaKPE Case-Based Learning — ${new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}`,
          size: 18,
          italics: true,
          color: "8A9BB5",
          font: "Calibri",
        }),
      ],
    })
  );

  return out;
}

function makeDoc(children: (Paragraph | Table)[]): Document {
  return new Document({
    creator: "PharmaKPE Case-Based Learning",
    title: "Laporan Farmakoterapi KPE",
    styles: { default: { document: { run: { font: "Calibri", size: 22 } } } },
    sections: [
      {
        properties: { page: { margin: { top: 1080, bottom: 1080, left: 1180, right: 1180 } } },
        children,
      },
    ],
  });
}

function pageBreak(): Paragraph {
  return new Paragraph({ children: [new PageBreak()] });
}

/* ---------- export per kasus ---------- */

export async function downloadCaseReport(c: CaseData, a: CaseAnswers, student: Student | null) {
  const headerNote = a.finished
    ? []
    : [
        new Paragraph({
          spacing: { before: 160, after: 160 },
          children: [
            new TextRun({
              text: "STATUS: DRAFT — kasus belum difinalisasi pada aplikasi.",
              bold: true,
              color: "B45309",
              size: 22,
              font: "Calibri",
            }),
          ],
        }),
      ];
  const doc = makeDoc([
    ...cover(student, `KASUS ${c.number}: ${c.title.toUpperCase()}`, c.diagnosis, "LAPORAN ANALISIS KASUS"),
    pageBreak(),
    ...headerNote,
    ...caseBodyChildren(c, a),
  ]);
  const blob = await Packer.toBlob(doc);
  saveBlob(blob, `Laporan_Farmakoterapi_KPE_${student?.nim || "NIM"}_Case${c.number}.docx`);
}

/* ---------- export portfolio ---------- */

export async function downloadPortfolio(
  items: { c: CaseData; a: CaseAnswers }[],
  student: Student | null,
  finalReflection: FinalReflection
) {
  const children: (Paragraph | Table)[] = [
    ...cover(student, "PORTFOLIO ANALISIS 5 KASUS KLINIS", "Farmakoterapi Kardiovaskular, Pernapasan, dan Endokrin", "PORTFOLIO CASE-BASED LEARNING"),
    pageBreak(),
    H("DAFTAR ISI", 1),
    ...items.flatMap(({ c }, i) => [
      new Paragraph({
        spacing: { after: 90 },
        children: [new TextRun({ text: `Kasus ${c.number} — ${c.title}`, font: "Calibri", size: 24, bold: true, color: NAVY })],
      }),
      new Paragraph({
        spacing: { after: 150 },
        children: [new TextRun({ text: `    ${c.diagnosis}`, font: "Calibri", size: 20, italics: true, color: "55677F" })],
      }),
      ...(i === items.length - 1
        ? [
            new Paragraph({
              spacing: { after: 150 },
              children: [new TextRun({ text: "Refleksi Akhir (Final Clinical Reflection)", font: "Calibri", size: 24, bold: true, color: NAVY })],
            }),
          ]
        : []),
    ]),
  ];

  items.forEach(({ c, a }) => {
    children.push(pageBreak());
    children.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [new TextRun({ text: `KASUS ${c.number}`, bold: true, size: 44, color: TEAL, font: "Calibri" })],
      })
    );
    children.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({ text: c.title.toUpperCase(), bold: true, size: 34, color: NAVY, font: "Calibri" })],
      })
    );
    children.push(P(c.diagnosis, { italic: true, color: "55677F" }));
    if (!a.finished)
      children.push(P("STATUS: DRAFT — belum difinalisasi.", { bold: true, color: "B45309" }));
    children.push(...caseBodyChildren(c, a));
  });

  children.push(pageBreak());
  children.push(H("REFLEKSI AKHIR — FINAL CLINICAL REFLECTION", 1));
  children.push(
    kvTable([
      { label: "Pola masalah farmakoterapi yang paling sering ditemukan", value: safe(finalReflection.pola) },
      { label: "Perbedaan pendekatan farmakoterapi antar kasus", value: safe(finalReflection.perbedaan) },
      { label: "Pengaruh data laboratorium terhadap keputusan terapi", value: safe(finalReflection.lab) },
      { label: "Pengaruh komorbid terhadap pemilihan obat", value: safe(finalReflection.komorbid) },
      { label: "Peran apoteker dalam kasus-kasus tersebut", value: safe(finalReflection.peranApoteker) },
    ])
  );

  const doc = makeDoc(children);
  const blob = await Packer.toBlob(doc);
  saveBlob(blob, `Portfolio_Farmakoterapi_KPE_${student?.nim || "NIM"}.docx`);
}

/* ---------- template kosong untuk dosen ---------- */

export async function downloadTemplate() {
  const doc = makeDoc([
    ...cover(null, "[JUDUL KASUS]", "[Diagnosis kasus]", "TEMPLATE LAPORAN ANALISIS KASUS"),
    pageBreak(),
    H("BAB 1 — PROFIL PASIEN", 1),
    kvTable([
      { label: "Nama / Inisial", value: "" },
      { label: "Usia / JK", value: "" },
      { label: "BB / TB", value: "" },
      { label: "Diagnosis", value: "" },
    ]),
    H("BAB 2 — DATA KLINIS", 1),
    P("Keluhan utama, riwayat penyakit, parameter klinis serial."),
    H("BAB 3 — DATA LABORATORIUM", 1),
    docTable(["Parameter", "Nilai", "Satuan", "Referensi", "Interpretasi Mahasiswa"], [["", "", "", "", ""]]),
    H("BAB 7 — DRUG RELATED PROBLEMS", 1),
    docTable(["No", "Kategori", "Masalah", "Bukti", "Penyebab", "Dampak", "Prioritas"], [["1", "", "", "", "", "", ""]]),
    H("BAB 9 — MONITORING PLAN", 1),
    docTable(["Kategori", "Parameter", "Baseline", "Target", "Frekuensi", "Metode", "Tindakan"], [["", "", "", "", "", "", ""]]),
    H("BAB 11 — SOAP NOTE", 1),
    P("S: ..."),
    P("O: ..."),
    P("A: ..."),
    P("P: ..."),
  ]);
  const blob = await Packer.toBlob(doc);
  saveBlob(blob, "Template_Laporan_Farmakoterapi_KPE.docx");
}
