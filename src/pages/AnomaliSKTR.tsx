import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAnomaliSKTR, submitKonfirmAnomali, type AnomaliSKTR } from "@/lib/sheets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CheckSquare } from "lucide-react";

const PAGE_SIZE = 15;

export default function AnomaliSKTR() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
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

  const [activeRow, setActiveRow] = useState<AnomaliSKTR | null>(null);
  const [konfirmasiVal, setKonfirmasiVal] = useState<string>("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
        d.namaPerusahaan.toLowerCase().includes(q) ||
        d.namaProyek.toLowerCase().includes(q) ||
        d.catatan.toLowerCase().includes(q)
      );
    }
    return r;
  }, [anomaliData, kabFilter, triwulanFilter, jenisFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [kabFilter, triwulanFilter, jenisFilter, search]);

  const fmt = (n: number) => n.toLocaleString('id-ID');

  const openKonfirmasi = (row: AnomaliSKTR) => {
    setActiveRow(row);
    setKonfirmasiVal("");
  };

  const handleSimpan = () => {
    if (!konfirmasiVal) {
      toast({ title: "Pilih konfirmasi terlebih dahulu", variant: "destructive" });
      return;
    }
    setConfirmOpen(true);
  };

  const handleYa = async () => {
    if (!activeRow) return;
    setSubmitting(true);
    try {
      await submitKonfirmAnomali({ ...activeRow, konfirmasi: konfirmasiVal });
      toast({ title: "Konfirmasi tersimpan", description: "Konfirmasi Tersimpan" });
      setConfirmOpen(false);
      setActiveRow(null);
      await queryClient.invalidateQueries({ queryKey: ["anomaliSKTR"] });
    } catch (e: any) {
      toast({ title: "Gagal menyimpan", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const detailFields: { label: string; key: keyof AnomaliSKTR }[] = [
    { label: "Kabupaten/Kota", key: "kabupatenKota" },
    { label: "Triwulan", key: "triwulan" },
    { label: "Nama Perusahaan", key: "namaPerusahaan" },
    { label: "Skala Usaha", key: "skalaUsaha" },
    { label: "Nama Proyek", key: "namaProyek" },
    { label: "Jenis Anomali", key: "jenisAnomali" },
    { label: "Catatan", key: "catatan" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="construction-header py-6 px-4 sticky top-0 z-20">
        <div className="max-w-full mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <AlertTriangle className="h-7 w-7" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Anomali Data SKTR 2026</h1>
          </div>
          <p className="text-sm opacity-80 ml-10">Hasil Pencacahan Survei Perusahaan Konstruksi Triwulanan</p>
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 py-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari nama perusahaan/proyek..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
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
            <span className="ml-3 text-muted-foreground font-medium">Memuat anomali data...</span>
          </div>
        ) : (
          <>
            <div className="rounded-xl border bg-card shadow-sm overflow-y-auto relative max-h-[calc(100vh-320px)]">
              <Table>
                <TableHeader className="sticky top-0 z-10">
                  <TableRow className="bg-muted">
                    <TableHead className="font-semibold w-12 border-r bg-muted">#</TableHead>
                    <TableHead className="font-semibold border-r bg-muted">Kabupaten/Kota</TableHead>
                    <TableHead className="font-semibold border-r bg-muted">Triwulan</TableHead>
                    <TableHead className="font-semibold border-r bg-muted">Nama Perusahaan</TableHead>
                    <TableHead className="font-semibold border-r bg-muted">Skala Usaha</TableHead>
                    <TableHead className="font-semibold border-r bg-muted">Nama Proyek</TableHead>
                    <TableHead className="font-semibold border-r bg-muted">Jenis Anomali</TableHead>
                    <TableHead className="font-semibold border-r bg-muted">Catatan</TableHead>
                    <TableHead className="font-semibold border-r bg-muted">Konfirmasi</TableHead>
                    <TableHead className="font-semibold text-center bg-muted">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">Tidak ada data ditemukan.</TableCell>
                    </TableRow>
                  ) : (
                    paged.map((d, i) => (
                      <TableRow key={i} className="table-row-hover">
                        <TableCell className="text-muted-foreground text-xs border-r">{(page - 1) * PAGE_SIZE + i + 1}</TableCell>
                        <TableCell className="text-sm border-r">{d.kabupatenKota}</TableCell>
                        <TableCell className="text-sm border-r">{d.triwulan}</TableCell>
                        <TableCell className="text-sm font-medium border-r">{d.namaPerusahaan}</TableCell>
                        <TableCell className="text-sm border-r">{d.skalaUsaha}</TableCell>
                        <TableCell className="text-sm border-r">{d.namaProyek}</TableCell>
                        <TableCell className="text-sm border-r">{d.jenisAnomali}</TableCell>
                        <TableCell className="text-sm border-r">{d.catatan}</TableCell>
                        <TableCell className="text-sm border-r">{d.konfirmasi}</TableCell>
                        <TableCell className="text-center">
                          <Button size="sm" variant="outline" onClick={() => openKonfirmasi(d)} className="gap-1.5">
                            <CheckSquare className="h-3.5 w-3.5" />
                            Konfirmasi
                          </Button>
                        </TableCell>
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

            {notes && (notes.note1 || notes.note2) && (
              <div className="text-sm text-muted-foreground space-y-1 px-1">
                {notes.note1 && <p className="font-medium">{notes.note1}</p>}
                {notes.note2 && <p className="italic">{notes.note2}</p>}
              </div>
            )}
          </>
        )}
      </main>

      {/* Detail / Konfirmasi Dialog */}
      <Dialog open={!!activeRow} onOpenChange={(o) => { if (!o) setActiveRow(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Anomali</DialogTitle>
          </DialogHeader>
          {activeRow && (
            <div className="space-y-3">
              {detailFields.map(f => (
                <div key={f.key} className="grid grid-cols-3 gap-2 text-sm">
                  <span className="font-medium text-muted-foreground">{f.label}</span>
                  <span className="col-span-2">{activeRow[f.key] || '-'}</span>
                </div>
              ))}
              <div className="pt-2">
                <label className="text-sm font-medium mb-1.5 block">Konfirmasi</label>
                <Select value={konfirmasiVal} onValueChange={setKonfirmasiVal}>
                  <SelectTrigger><SelectValue placeholder="Pilih konfirmasi" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Perbaikan">Perbaikan</SelectItem>
                    <SelectItem value="Sesuai">Sesuai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveRow(null)}>Batal</Button>
            <Button onClick={handleSimpan}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Apakah Anda yakin?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={submitting}>Tidak</Button>
            <Button onClick={handleYa} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
              Ya
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
