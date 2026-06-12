import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, List, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const SHEET_ID = "1H6HMmjpkiEzyuJBJhepfdRPoIW6pVQSBalZRdcVeTZg";
const PAGE_SIZE = 15;

export interface SampelRow {
  kabupatenKota: string;
  kip: string;
  namaPerusahaan: string;
  skalaUsaha: string;
  jenisSampel: string;
  keterangan: string;
}

function parseCSV(csv: string): string[][] {
  const rows: string[][] = [];
  let cur = "", inQ = false, row: string[] = [];
  for (let i = 0; i < csv.length; i++) {
    const c = csv[i];
    if (c === '"') { if (inQ && csv[i + 1] === '"') { cur += '"'; i++; } else inQ = !inQ; }
    else if (c === "," && !inQ) { row.push(cur.trim()); cur = ""; }
    else if ((c === "\n" || c === "\r") && !inQ) {
      if (c === "\r" && csv[i + 1] === "\n") i++;
      row.push(cur.trim());
      if (row.some(x => x !== "")) rows.push(row);
      row = []; cur = "";
    } else cur += c;
  }
  if (cur || row.length) { row.push(cur.trim()); if (row.some(x => x !== "")) rows.push(row); }
  return rows;
}

async function fetchSampel(sheet: string): Promise<SampelRow[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheet}`;
  const res = await fetch(url);
  const csv = await res.text();
  const rows = parseCSV(csv);
  return rows.slice(1).map(r => ({
    kabupatenKota: r[0] || "",
    kip: r[1] || "",
    namaPerusahaan: r[2] || "",
    skalaUsaha: r[3] || "",
    jenisSampel: r[4] || "",
    keterangan: r[5] || "",
  }));
}

interface Props {
  title: string;
  subtitle: string;
  sheet: string;
  queryKey: string;
}

export default function SampelPage({ title, subtitle, sheet, queryKey }: Props) {
  const { data = [], isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchSampel(sheet),
    staleTime: 5 * 60 * 1000,
  });

  const [kabFilter, setKabFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const kabOptions = useMemo(() => {
    const s = new Set<string>();
    data.forEach(d => { if (d.kabupatenKota) s.add(d.kabupatenKota); });
    return Array.from(s).sort();
  }, [data]);

  const filtered = useMemo(() => {
    let r = data;
    if (kabFilter !== "all") r = r.filter(d => d.kabupatenKota === kabFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(d =>
        d.namaPerusahaan.toLowerCase().includes(q) ||
        d.kip.toLowerCase().includes(q) ||
        d.keterangan.toLowerCase().includes(q)
      );
    }
    return r;
  }, [data, kabFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [kabFilter, search]);

  const fmt = (n: number) => n.toLocaleString("id-ID");

  return (
    <div className="min-h-screen bg-background">
      <header className="construction-header py-6 px-4 sticky top-0 z-20">
        <div className="max-w-full mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <List className="h-7 w-7" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h1>
          </div>
          <p className="text-sm opacity-80 ml-10">{subtitle}</p>
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 py-6 space-y-4">
        <div className="sticky top-[96px] z-10 bg-background py-2 flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari nama perusahaan / KIP / keterangan..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="w-64">
            <Select value={kabFilter} onValueChange={setKabFilter}>
              <SelectTrigger><SelectValue placeholder="Kabupaten/Kota" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kabupaten/Kota</SelectItem>
                {kabOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground font-medium">Memuat daftar sampel...</span>
          </div>
        ) : (
          <div className="rounded-xl border bg-card shadow-sm overflow-y-auto relative max-h-[calc(100vh-260px)]">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="bg-muted">
                  <TableHead className="font-semibold w-12 border-r bg-muted">#</TableHead>
                  <TableHead className="font-semibold border-r bg-muted">Kabupaten/Kota</TableHead>
                  <TableHead className="font-semibold border-r bg-muted">KIP</TableHead>
                  <TableHead className="font-semibold border-r bg-muted">Nama Perusahaan</TableHead>
                  <TableHead className="font-semibold border-r bg-muted">Skala Usaha</TableHead>
                  <TableHead className="font-semibold border-r bg-muted">Jenis Sampel</TableHead>
                  <TableHead className="font-semibold bg-muted">Keterangan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">Tidak ada data ditemukan.</TableCell></TableRow>
                ) : (
                  paged.map((d, i) => (
                    <TableRow key={i} className="table-row-hover">
                      <TableCell className="text-muted-foreground text-xs border-r">{(page - 1) * PAGE_SIZE + i + 1}</TableCell>
                      <TableCell className="text-sm border-r">{d.kabupatenKota}</TableCell>
                      <TableCell className="text-sm border-r">{d.kip}</TableCell>
                      <TableCell className="text-sm font-medium border-r">{d.namaPerusahaan}</TableCell>
                      <TableCell className="text-sm border-r">{d.skalaUsaha}</TableCell>
                      <TableCell className="text-sm border-r">{d.jenisSampel}</TableCell>
                      <TableCell className="text-sm">{d.keterangan}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between px-4 py-3 border-t bg-muted sticky bottom-0">
              <p className="text-sm text-muted-foreground">
                Menampilkan {fmt(Math.min((page - 1) * PAGE_SIZE + 1, filtered.length))}–{fmt(Math.min(page * PAGE_SIZE, filtered.length))} dari {fmt(filtered.length)} data
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={() => setPage(1)} disabled={page === 1}><ChevronsLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="h-4 w-4" /></Button>
                <span className="px-3 text-sm font-medium">{page} / {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => setPage(totalPages)} disabled={page === totalPages}><ChevronsRight className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
