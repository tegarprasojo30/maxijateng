const SHEET_ID = '1H6HMmjpkiEzyuJBJhepfdRPoIW6pVQSBalZRdcVeTZg';

function parseCSV(csv: string): string[][] {
  const rows: string[][] = [];
  let current = '';
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    if (char === '"') {
      if (inQuotes && csv[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current.trim());
      current = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && csv[i + 1] === '\n') i++;
      row.push(current.trim());
      if (row.some(cell => cell !== '')) rows.push(row);
      row = [];
      current = '';
    } else {
      current += char;
    }
  }
  if (current || row.length) {
    row.push(current.trim());
    if (row.some(cell => cell !== '')) rows.push(row);
  }
  return rows;
}

export interface Perusahaan {
  kodeKabKota: string;
  namaKabKota: string;
  kabupatenKota: string;
  kodePenyedia: string;
  namaPenyedia: string;
  npwpPenyedia: string;
  bentukUsaha: string;
  alamat: string;
  kabupaten: string;
  provinsi: string;
  kodePos: string;
  telepon: string;
  fax: string;
  website: string;
  nomorPKP: string;
  jumlahProyek2025: string;
  jumlahProyekTw1: string;
  skalaUsaha: string;
  totalNilaiProyek2025: string;
}

export interface Proyek {
  kodeKabKota: string;
  namaKabKota: string;
  kabupatenKota: string;
  status: string;
  kodePenyedia: string;
  namaPenyedia: string;
  npwpPenyedia: string;
  bentukUsaha: string;
  alamat: string;
  kabupaten: string;
  provinsi: string;
  kodePos: string;
  telepon: string;
  fax: string;
  website: string;
  nomorPKP: string;
  kodeRUP: string;
  namaPaket: string;
  kelompokDinas: string;
  satuanKerja: string;
  namaLPSE: string;
  nilaiKontrak: string;
  sumberDana: string;
  tanggalPenetapan: string;
}

export interface ProgressSKTH {
  kabupatenKota: string;
  targetSampel: number;
  open: number;
  submittedByPencacah: number;
  approvedByPengawas: number;
  rejectedByPengawas: number;
  completedByAdmin: number;
  progres: string;
}

export interface ProgressNotes {
  note1: string;
  note2: string;
}

export interface DashboardData {
  skthTitle: string;
  skthTargetSampel: string;
  skthSelesai: string;
  skthProgres: string;
  skthFraction: string;
  skthBesar: string;
  skthMenengah: string;
  skthKecil: string;
  sktrTitle: string;
  sktrTriwulan: string;
  sktrTargetSampel: string;
  sktrSelesai: string;
  sktrProgres: string;
  sktrFraction: string;
  sktrBesar: string;
  sktrMenengah: string;
  sktrKecil: string;
}

export interface GrafikData {
  targetSampel: number;
  open: number;
  submittedByPencacah: number;
  approvedByPengawas: number;
  rejectedByPengawas: number;
  completedByAdmin: number;
  pieSelesai: number;
  pieBelum: number;
}

export async function fetchPerusahaan(): Promise<Perusahaan[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=PERUSAHAAN`;
  const res = await fetch(url);
  const csv = await res.text();
  const rows = parseCSV(csv);
  return rows.slice(1).map(r => ({
    kodeKabKota: r[0] || '',
    namaKabKota: r[1] || '',
    kabupatenKota: r[2] || '',
    kodePenyedia: r[3] || '',
    namaPenyedia: r[4] || '',
    npwpPenyedia: r[5] || '',
    bentukUsaha: r[6] || '',
    alamat: r[7] || '',
    kabupaten: r[8] || '',
    provinsi: r[9] || '',
    kodePos: r[10] || '',
    telepon: r[11] || '',
    fax: r[12] || '',
    website: r[13] || '',
    nomorPKP: r[14] || '',
    jumlahProyek2025: r[15] || '0',
    jumlahProyekTw1: r[16] || '0',
    skalaUsaha: r[20] || '',
    totalNilaiProyek2025: r[21] || '',
  }));
}

export async function fetchProyek(): Promise<Proyek[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=PROYEK`;
  const res = await fetch(url);
  const csv = await res.text();
  const rows = parseCSV(csv);
  return rows.slice(1).map(r => ({
    kodeKabKota: r[0] || '',
    namaKabKota: r[1] || '',
    kabupatenKota: r[2] || '',
    status: r[3] || '',
    kodePenyedia: r[4] || '',
    namaPenyedia: r[5] || '',
    npwpPenyedia: r[6] || '',
    bentukUsaha: r[7] || '',
    alamat: r[8] || '',
    kabupaten: r[9] || '',
    provinsi: r[10] || '',
    kodePos: r[11] || '',
    telepon: r[12] || '',
    fax: r[13] || '',
    website: r[14] || '',
    nomorPKP: r[15] || '',
    kodeRUP: r[16] || '',
    namaPaket: r[17] || '',
    kelompokDinas: r[18] || '',
    satuanKerja: r[19] || '',
    namaLPSE: r[20] || '',
    nilaiKontrak: r[21] || '',
    sumberDana: r[29] || '',
    tanggalPenetapan: r[28] || '',
  }));
}

function parseProgressRows(rows: string[][]): { data: ProgressSKTH[]; notes: ProgressNotes } {
  const notes: ProgressNotes = {
    note1: rows[0]?.[9] || '',
    note2: rows[1]?.[9] || '',
  };
  const data = rows.slice(1).map(r => ({
    kabupatenKota: r[0] || '',
    targetSampel: parseInt(r[1] || '0', 10),
    open: parseInt(r[2] || '0', 10),
    submittedByPencacah: parseInt(r[3] || '0', 10),
    approvedByPengawas: parseInt(r[4] || '0', 10),
    rejectedByPengawas: parseInt(r[5] || '0', 10),
    completedByAdmin: parseInt(r[6] || '0', 10),
    progres: r[7] || '0%',
  }));
  return { data, notes };
}

export async function fetchProgressSKTH(): Promise<{ data: ProgressSKTH[]; notes: ProgressNotes }> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=PROGRESSKTH`;
  const res = await fetch(url);
  const csv = await res.text();
  const rows = parseCSV(csv);
  return parseProgressRows(rows);
}

export async function fetchProgressKTR1(): Promise<{ data: ProgressSKTH[]; notes: ProgressNotes }> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=PROGRESSKTR1`;
  const res = await fetch(url);
  const csv = await res.text();
  const rows = parseCSV(csv);
  return parseProgressRows(rows);
}

export async function fetchDashboard(): Promise<DashboardData> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=DASHBOARD`;
  const res = await fetch(url);
  const csv = await res.text();
  const rows = parseCSV(csv);
  return {
    skthTitle: rows[0]?.[0] || '',
    skthTargetSampel: rows[1]?.[14] || '0',
    skthSelesai: rows[3]?.[14] || '0%',
    skthProgres: rows[3]?.[14] || '0%',
    skthFraction: rows[3]?.[6] || '',
    skthBesar: rows[4]?.[14] || '0',
    skthMenengah: rows[5]?.[14] || '0',
    skthKecil: rows[6]?.[14] || '0',
    sktrTitle: rows[9]?.[0] || '',
    sktrTriwulan: rows[9]?.[11] || 'Triwulan II',
    sktrTargetSampel: rows[11]?.[14] || '0',
    sktrSelesai: rows[13]?.[14] || '0%',
    sktrProgres: rows[13]?.[14] || '0%',
    sktrFraction: rows[13]?.[6] || '',
    sktrBesar: rows[14]?.[14] || '0',
    sktrMenengah: rows[15]?.[14] || '0',
    sktrKecil: rows[16]?.[14] || '0',
  };
}

function parseGrafikRows(rows: string[][]): GrafikData {
  return {
    targetSampel: parseInt(rows[1]?.[16] || '0', 10),
    open: parseInt(rows[1]?.[17] || '0', 10),
    submittedByPencacah: parseInt(rows[1]?.[18] || '0', 10),
    approvedByPengawas: parseInt(rows[1]?.[19] || '0', 10),
    rejectedByPengawas: parseInt(rows[1]?.[20] || '0', 10),
    completedByAdmin: parseInt(rows[1]?.[21] || '0', 10),
    //pieSelesai: parseInt(rows[5]?.[1] || '0', 10),
    //pieBelum: parseInt(rows[6]?.[1] || '0', 10),
    pieSelesai: Number(parseFloat(rows[5]?.[1] || '0').toFixed(2)),
    pieBelum: Number(parseFloat(rows[6]?.[1] || '0').toFixed(2)),
  };
}

export async function fetchGrafikSKTH(): Promise<GrafikData> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=GRAFIKSKTH`;
  const res = await fetch(url);
  const csv = await res.text();
  const rows = parseCSV(csv);
  return parseGrafikRows(rows);
}

export async function fetchGrafikSKTR1(): Promise<GrafikData> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=GRAFIKSKTR1`;
  const res = await fetch(url);
  const csv = await res.text();
  const rows = parseCSV(csv);
  return parseGrafikRows(rows);
}

export interface AnomaliSKTR {
  kabupatenKota: string;
  triwulan: string;
  namaPerusahaan: string;
  skalaUsaha: string;
  namaProyek: string;
  jenisAnomali: string;
  catatan: string;
  konfirmasi: string;
}

export interface AnomaliNotes {
  note1: string;
  note2: string;
}

export async function fetchAnomaliSKTR(): Promise<{ data: AnomaliSKTR[]; notes: AnomaliNotes }> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=ANOMALISKTR`;
  const res = await fetch(url);
  const csv = await res.text();
  const rows = parseCSV(csv);
  const notes: AnomaliNotes = {
    note1: rows[0]?.[10] || '',
    note2: rows[1]?.[10] || '',
  };
  const data = rows.slice(1).map(r => ({
    kabupatenKota: r[0] || '',
    triwulan: r[1] || '',
    namaPerusahaan: r[2] || '',
    skalaUsaha: r[3] || '',
    namaProyek: r[4] || '',
    jenisAnomali: r[5] || '',
    catatan: r[6] || '',
    konfirmasi: r[7] || '',
  }));
  return { data, notes };
}

export interface PedomanItem {
  judul: string;
  link: string;
}

export async function fetchPedoman(): Promise<PedomanItem[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=PEDOMAN`;
  const res = await fetch(url);
  const csv = await res.text();
  const rows = parseCSV(csv);
  return rows.slice(1).filter(r => r[0]).map(r => ({
    judul: r[0] || '',
    link: r[1] || '',
  }));
}

export async function fetchMasterNote(): Promise<string> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=MASTER&range=W1`;
  const res = await fetch(url);
  const csv = await res.text();
  const rows = parseCSV(csv);
  return rows[0]?.[0] || '';
}

import { KONFIRM_ANOMALI_URL, KONFIRM_ANOMALI_SKTH_URL } from './config';

export async function submitKonfirmAnomali(payload: {
  kabupatenKota: string; triwulan: string; namaPerusahaan: string;
  skalaUsaha: string; namaProyek: string; jenisAnomali: string;
  catatan: string; konfirmasi: string;
}): Promise<void> {
  if (!KONFIRM_ANOMALI_URL) throw new Error('URL endpoint Google Apps Script belum diisi di src/lib/config.ts');
  await fetch(KONFIRM_ANOMALI_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
}

export interface AnomaliSKTH {
  kabupatenKota: string;
  namaPerusahaan: string;
  skalaUsaha: string;
  jenisAnomali: string;
  catatan: string;
  konfirmasi: string;
}

export async function fetchAnomaliSKTH(): Promise<{ data: AnomaliSKTH[]; notes: AnomaliNotes }> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=ANOMALISKTH`;
  const res = await fetch(url);
  const csv = await res.text();
  const rows = parseCSV(csv);
  const notes: AnomaliNotes = {
    note1: rows[0]?.[10] || '',
    note2: rows[1]?.[10] || '',
  };
  const data = rows.slice(1).map(r => ({
    kabupatenKota: r[0] || '',
    namaPerusahaan: r[1] || '',
    skalaUsaha: r[2] || '',
    jenisAnomali: r[3] || '',
    catatan: r[4] || '',
    konfirmasi: r[5] || '',
  }));
  return { data, notes };
}

export async function submitKonfirmAnomaliSKTH(payload: {
  kabupatenKota: string; namaPerusahaan: string; skalaUsaha: string;
  jenisAnomali: string; catatan: string; konfirmasi: string;
}): Promise<void> {
  if (!KONFIRM_ANOMALI_SKTH_URL) throw new Error('URL endpoint Google Apps Script belum diisi di src/lib/config.ts');
  await fetch(KONFIRM_ANOMALI_SKTH_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ ...payload, sheet: 'KONFIRMANOMALI2', targetSheet: 'KONFIRMANOMALI2' }),
  });
}
