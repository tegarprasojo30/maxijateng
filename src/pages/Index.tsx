import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPerusahaan, fetchProyek, type Perusahaan } from "@/lib/sheets";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import CompanyDetailDialog from "@/components/CompanyDetailDialog";
import ProjectListDialog from "@/components/ProjectListDialog";
import { Eye, FolderOpen, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Loader2, HardHat } from "lucide-react";

const PAGE_SIZE = 15;

export default function Index() {
  const { data: companies = [], isLoading: loadingCompanies } = useQuery({
    queryKey: ["perusahaan"],
    queryFn: fetchPerusahaan,
    staleTime: 5 * 60 * 1000,
  });

  const { data: allProjects = [], isLoading: loadingProjects } = useQuery({
    queryKey: ["proyek"],
    queryFn: fetchProyek,
    staleTime: 5 * 60 * 1000,
  });

  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [skalaFilter, setSkalaFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [detailCompany, setDetailCompany] = useState<Perusahaan | null>(null);
  const [projectCompany, setProjectCompany] = useState<Perusahaan | null>(null);

  const filterOptions = useMemo(() => {
    const set = new Set<string>();
    companies.forEach(c => {
      if (c.kabupatenKota && c.kabupatenKota.startsWith("[")) set.add(c.kabupatenKota);
    });
    return Array.from(set).sort();
  }, [companies]);

  const skalaOptions = useMemo(() => {
    const order = ["Kecil", "Menengah", "Besar", "-"];
    const available = new Set<string>();
    companies.forEach(c => {
      if (c.skalaUsaha) available.add(c.skalaUsaha);
    });
    return order.filter(o => available.has(o));
  }, [companies]);


  const filtered = useMemo(() => {
    let result = companies;
    if (filter !== "all") {
      result = result.filter(c => c.kabupatenKota === filter);
    }
    if (skalaFilter !== "all") {
      result = result.filter(c => c.skalaUsaha === skalaFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.namaPenyedia.toLowerCase().includes(q) ||
        c.kodePenyedia.toLowerCase().includes(q)
      );
    }
    if (filter === "all") {
      result = [...result].sort((a, b) => a.kabupatenKota.localeCompare(b.kabupatenKota));
    }
    return result;
  }, [companies, filter, skalaFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [filter, skalaFilter, search]);

  const companyProjects = useMemo(() => {
    if (!projectCompany) return [];
    return allProjects.filter(p => p.kodePenyedia === projectCompany.kodePenyedia);
  }, [projectCompany, allProjects]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="construction-header py-6 px-4 sticky top-0 z-20">
        <div className="max-w-full mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <HardHat className="h-7 w-7" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              Database Perusahaan Konstruksi
            </h1>
          </div>
          <p className="text-sm opacity-80 ml-10">
            Provinsi Jawa Tengah — Data dari LPSE
          </p>
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 py-6 space-y-4">
        {/* Search & Filter Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau kode penyedia..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-64">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kabupaten/Kota" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kabupaten/Kota</SelectItem>
                {filterOptions.map(opt => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-52">
            <Select value={skalaFilter} onValueChange={setSkalaFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Skala Usaha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Skala Usaha</SelectItem>
                {skalaOptions.map(opt => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        {loadingCompanies ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground font-medium">Memuat data perusahaan...</span>
          </div>
        ) : (
          <div className="rounded-xl border bg-card shadow-sm overflow-y-auto relative max-h-[calc(100vh-280px)]">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="bg-muted">
                  <TableHead rowSpan={2} className="font-semibold w-12 align-middle border-r bg-muted">#</TableHead>
                  <TableHead rowSpan={2} className="font-semibold align-middle border-r bg-muted">Kabupaten/Kota</TableHead>
                  <TableHead rowSpan={2} className="font-semibold align-middle border-r bg-muted">Nama Penyedia</TableHead>
                  <TableHead rowSpan={2} className="font-semibold align-middle border-r bg-muted">Alamat</TableHead>
                  <TableHead rowSpan={2} className="font-semibold align-middle border-r bg-muted">Skala Usaha</TableHead>
                  <TableHead colSpan={2} className="font-semibold text-center border-r bg-muted">Jumlah Proyek</TableHead>
                  <TableHead rowSpan={2} className="font-semibold align-middle border-r bg-muted">Total Nilai Proyek 2025</TableHead>
                  <TableHead rowSpan={2} className="font-semibold text-center align-middle bg-muted">Aksi</TableHead>
                </TableRow>
                <TableRow className="bg-muted/80">
                  <TableHead className="font-medium text-center text-xs border-r bg-muted">2025</TableHead>
                  <TableHead className="font-medium text-center text-xs border-r bg-muted">2026 Tw I</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                      Tidak ada data ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  paged.map((c, i) => {
                    return (
                      <TableRow key={c.kodePenyedia + i} className="table-row-hover">
                        <TableCell className="text-muted-foreground text-xs border-r">
                          {(page - 1) * PAGE_SIZE + i + 1}
                        </TableCell>
                        <TableCell className="text-sm border-r">{c.kabupatenKota}</TableCell>
                        <TableCell className="text-sm font-medium border-r">{c.namaPenyedia}</TableCell>
                        <TableCell className="text-sm border-r">{c.alamat}</TableCell>
                        <TableCell className="text-sm border-r">{c.skalaUsaha}</TableCell>
                        <TableCell className="text-sm text-center border-r">{c.jumlahProyek2025 || '-'}</TableCell>
                        <TableCell className="text-sm text-center border-r">{c.jumlahProyekTw1 || '-'}</TableCell>
                        <TableCell className="text-sm text-right border-r">{c.totalNilaiProyek2025 || '-'}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDetailCompany(c)}
                              className="gap-1.5"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Detail</span>
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setProjectCompany(c)}
                              className="gap-1.5"
                            >
                              <FolderOpen className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Proyek</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30">
              <p className="text-sm text-muted-foreground">
                Menampilkan {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length).toLocaleString('id-ID')}–{Math.min(page * PAGE_SIZE, filtered.length).toLocaleString('id-ID')} dari {filtered.length.toLocaleString('id-ID')} perusahaan
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={() => setPage(1)} disabled={page === 1}>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-3 text-sm font-medium">
                  {page} / {totalPages}
                </span>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage(totalPages)} disabled={page === totalPages}>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Dialogs */}
      <CompanyDetailDialog
        company={detailCompany}
        open={!!detailCompany}
        onOpenChange={open => { if (!open) setDetailCompany(null); }}
      />
      <ProjectListDialog
        projects={companyProjects}
        loading={loadingProjects}
        companyName={projectCompany?.namaPenyedia || ""}
        open={!!projectCompany}
        onOpenChange={open => { if (!open) setProjectCompany(null); }}
      />
    </div>
  );
}
