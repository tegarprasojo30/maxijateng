import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPerusahaan, fetchProyek, type Perusahaan, type Proyek } from "@/lib/sheets";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import CompanyDetailDialog from "@/components/CompanyDetailDialog";
import ProjectListDialog from "@/components/ProjectListDialog";
import { Building2, Eye, FolderOpen, ChevronLeft, ChevronRight, Search, Loader2, HardHat } from "lucide-react";

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
  const [page, setPage] = useState(1);
  const [detailCompany, setDetailCompany] = useState<Perusahaan | null>(null);
  const [projectCompany, setProjectCompany] = useState<Perusahaan | null>(null);

  // Get unique Kabupaten/Kota values (column C)
  const filterOptions = useMemo(() => {
    const set = new Set<string>();
    companies.forEach(c => {
      if (c.kabupatenKota && c.kabupatenKota.startsWith("[")) set.add(c.kabupatenKota);
    });
    return Array.from(set).sort();
  }, [companies]);

  // Filter and search
  const filtered = useMemo(() => {
    let result = companies;
    if (filter !== "all") {
      result = result.filter(c => c.kabupatenKota === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.namaPenyedia.toLowerCase().includes(q) ||
        c.kodePenyedia.toLowerCase().includes(q)
      );
    }
    return result;
  }, [companies, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [filter, search]);

  // Projects for selected company
  const companyProjects = useMemo(() => {
    if (!projectCompany) return [];
    return allProjects.filter(p => p.kodePenyedia === projectCompany.kodePenyedia);
  }, [projectCompany, allProjects]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="construction-header py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <HardHat className="h-8 w-8" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Database Perusahaan Konstruksi
            </h1>
          </div>
          <p className="text-sm opacity-80 ml-11">
            Provinsi Jawa Tengah — Data dari LPSE
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau kode penyedia..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter */}
        <div className="max-w-xs">
          <p className="text-sm font-semibold text-muted-foreground mb-2">Filter Kabupaten/Kota</p>
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

        {/* Table */}
        {loadingCompanies ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground font-medium">Memuat data perusahaan...</span>
          </div>
        ) : (
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold w-12">#</TableHead>
                  <TableHead className="font-semibold">Kabupaten/Kota</TableHead>
                  <TableHead className="font-semibold">Kode Penyedia</TableHead>
                  <TableHead className="font-semibold">Nama Penyedia</TableHead>
                  <TableHead className="font-semibold text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      Tidak ada data ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  paged.map((c, i) => (
                    <TableRow key={c.kodePenyedia + i} className="table-row-hover">
                      <TableCell className="text-muted-foreground text-xs">
                        {(page - 1) * PAGE_SIZE + i + 1}
                      </TableCell>
                      <TableCell className="text-sm">{c.kabupatenKota}</TableCell>
                      <TableCell className="font-mono text-xs">{c.kodePenyedia}</TableCell>
                      <TableCell className="text-sm font-medium">{c.namaPenyedia}</TableCell>
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
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30">
              <p className="text-sm text-muted-foreground">
                Menampilkan {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length} perusahaan
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-3 text-sm font-medium">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
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
