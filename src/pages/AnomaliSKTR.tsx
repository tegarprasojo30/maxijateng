import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAnomaliSKTR } from "@/lib/sheets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const PAGE_SIZE = 15;

export default function AnomaliSKTR() {
  const { data: result, isLoading } = useQuery({
    queryKey: ["anomaliSKTR"],
    queryFn: fetchAnomaliSKTR,
    staleTime: 5 * 60 * 1000,
  });

  const anomaliData = result?.data || [];
  const notes = result?.notes;

  const [kabFilter, setKabFilter] = useState("all");
  const [triwulanFilter, setTriwulanFilter] = useState("all");
  const [jenisFilter, setJenisFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const kabOptions = useMemo(() => {
    const s = new Set<string>();
    anomaliData.forEach(d => { if (d.kabupatenKota) s.add(d.kabupatenKota); });
    return Array.from(s).sort();
  }, [anomaliData]);

  const triwulanOptions = useMemo(() => {
    const s = new Set<string>();
    anomaliData.forEach(d => { if (d.triwulan) s.add(d.triwulan); });
    return Array.from(s).sort();
  }, [anomaliData]);

  const jenisOptions = useMemo(() => {
    const s = new Set<string>();
    anomaliData.forEach(d => { if (d.jenisAnomali) s.add(d.jenisAnomali); });
    return Array.from(s).sort();
  }, [anomaliData]);

  const filtered = useMemo(() => {
    let r = anomaliData;
    if (kabFilter !== "all") r = r.filter(d => d.kabupatenKota === kabFilter);
    if (triwulanFilter !== "all") r = r.filter(d => d.triwulan === triwulanFilter);
    if (jenisFilter !== "all") r = r.filter(d => d.jenisAnomali === jenisFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(d =>
        d.namaPenyedia.toLowerCase().includes(q) ||
        d.kodePenyedia.toLowerCase().includes(q) ||
        d.keterangan.toLowerCase().includes(q)
      );
    }
    return r;
  }, [anomaliData, kabFilter, triwulanFilter, jenisFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [kabFilter, triwulanFilter, jenisFilter, search]);

  const fmt = (n: number) => n.toLocaleString('id-ID');

  return (
    <div className="min-h-screen bg-background">
      <header className="construction-header py-6 px-4 sticky top-0 z-20">
        <div className="max-w-full mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <AlertTriangle className="h-7 w-7" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Anomali Data SKTR 2026</h1>
          </div>
          <p className="text-sm opacity-80 ml-10">Data anomali hasil pencacahan Survei Konstruksi Triwulanan</p>
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 py-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari nama/kode penyedia..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="w-56">
            <Select value={kabFilter} onValueChange={setKabFilter}>
              <SelectTrigger><SelectValue placeholder="Kabupaten/Kota" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kabupaten/Kota</SelectItem>
                {kabOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="w-44">
            <Select value={triwulanFilter} onValueChange={setTriwulanFilter}>
              <SelectTrigger><SelectValue placeholder="Triwulan" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Triwulan</SelectItem>
                {triwulanOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="w-52">
            <Select value={jenisFilter} onValueChange={setJenisFilter}>
              <SelectTrigger><SelectValue placeholder="Jenis Anomali" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis Anomali</SelectItem>
                {jenisOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground font-medium">Memuat data anomali...</span>
          </div>
        ) : (
          <>
            <div className="rounded-xl border bg-card shadow-sm overflow-y-auto relative max-h-[calc(100vh-320px)]">
              <Table>
                <TableHeader className="sticky top-0 z-10">
                  <TableRow className="bg-muted">
                    <TableHead className="font-semibold w-12 border-r bg-muted">#</TableHead>
                    <TableHead className="font-semibold border-r bg-muted">Kabupaten/Kota</TableHead>
                    <TableHead className="font-semibold border-r bg-muted">Kode Penyedia</TableHead>
                    <TableHead className="font-semibold border-r bg-muted">Nama Penyedia</TableHead>
                    <TableHead className="font-semibold border-r bg-muted">Triwulan</TableHead>
                    <TableHead className="font-semibold border-r bg-muted">Jenis Anomali</TableHead>
                    <TableHead className="font-semibold bg-muted">Keterangan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">Tidak ada data ditemukan.</TableCell>
                    </TableRow>
                  ) : (
                    paged.map((d, i) => (
                      <TableRow key={i} className="table-row-hover">
                        <TableCell className="text-muted-foreground text-xs border-r">{(page - 1) * PAGE_SIZE + i + 1}</TableCell>
                        <TableCell className="text-sm border-r">{d.kabupatenKota}</TableCell>
                        <TableCell className="text-sm border-r">{d.kodePenyedia}</TableCell>
                        <TableCell className="text-sm font-medium border-r">{d.namaPenyedia}</TableCell>
                        <TableCell className="text-sm border-r">{d.triwulan}</TableCell>
                        <TableCell className="text-sm border-r">{d.jenisAnomali}</TableCell>
                        <TableCell className="text-sm">{d.keterangan}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30">
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

            {notes?.note && (
              <div className="text-sm text-muted-foreground space-y-1 px-1">
                <p className="font-medium">{notes.note}</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
