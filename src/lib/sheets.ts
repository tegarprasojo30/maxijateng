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
  skalaUsaha: string;
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
    skalaUsaha: r[20] || '', // Column U (index 20)
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
    sumberDana: r[29] || '', // Column AD (index 29)
    tanggalPenetapan: r[28] || '', // Column AC (index 28)
  }));
}
