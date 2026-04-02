import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Proyek } from "@/lib/sheets";
import { FolderOpen, Loader2 } from "lucide-react";

interface Props {
  projects: Proyek[];
  loading: boolean;
  companyName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface GroupedProject {
  kodeRUP: string;
  namaPaket: string;
  kelompokDinas: string;
  satuanKerja: string;
  namaLPSE: string;
  sumberDana: string;
  tanggalPenetapan: string;
  totalNilaiKontrak: string;
  status: string;
  count: number;
}

function groupByKodeRUP(projects: Proyek[]): GroupedProject[] {
  const map = new Map<string, GroupedProject>();
  for (const p of projects) {
    const existing = map.get(p.kodeRUP);
    if (existing) {
      existing.count++;
    } else {
      map.set(p.kodeRUP, {
        kodeRUP: p.kodeRUP,
        namaPaket: p.namaPaket,
        kelompokDinas: p.kelompokDinas,
        satuanKerja: p.satuanKerja,
        namaLPSE: p.namaLPSE,
        sumberDana: p.sumberDana,
        tanggalPenetapan: p.tanggalPenetapan,
        totalNilaiKontrak: p.nilaiKontrak,
        status: p.status,
        count: 1,
      });
    }
  }
  return Array.from(map.values());
}

export default function ProjectListDialog({ projects, loading, companyName, open, onOpenChange }: Props) {
  const grouped = groupByKodeRUP(projects);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <FolderOpen className="h-5 w-5 text-secondary" />
            Daftar Proyek — {companyName}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Memuat data proyek...</span>
          </div>
        ) : grouped.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Tidak ada proyek ditemukan untuk perusahaan ini.
          </div>
        ) : (
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Kode RUP</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Nama Paket</TableHead>
                  <TableHead className="font-semibold">Kelompok Dinas</TableHead>
                  <TableHead className="font-semibold">Satuan Kerja</TableHead>
                  <TableHead className="font-semibold">Nama LPSE</TableHead>
                  <TableHead className="font-semibold">Sumber Dana</TableHead>
                  <TableHead className="font-semibold">Tgl Penetapan</TableHead>
                  <TableHead className="font-semibold">Nilai Kontrak</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grouped.map((g, i) => (
                  <TableRow key={g.kodeRUP + i} className="table-row-hover">
                    <TableCell className="text-sm">{g.kodeRUP}</TableCell>
                    <TableCell className="text-sm">{g.status}</TableCell>
                    <TableCell className="text-sm max-w-[250px]">{g.namaPaket}</TableCell>
                    <TableCell className="text-sm">{g.kelompokDinas}</TableCell>
                    <TableCell className="text-sm">{g.satuanKerja}</TableCell>
                    <TableCell className="text-sm">{g.namaLPSE}</TableCell>
                    <TableCell className="text-sm">{g.sumberDana}</TableCell>
                    <TableCell className="text-sm">{g.tanggalPenetapan}</TableCell>
                    <TableCell className="text-sm text-right">Rp {g.totalNilaiKontrak}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          Total: {grouped.length} paket proyek (grouped by Kode RUP)
        </p>
      </DialogContent>
    </Dialog>
  );
}
