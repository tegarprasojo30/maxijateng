import { useQuery } from "@tanstack/react-query";
import { fetchProgressSKTH } from "@/lib/sheets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Loader2, TrendingUp } from "lucide-react";

export default function ProgressSKTHPage() {
  const { data: progressData = [], isLoading } = useQuery({
    queryKey: ["progressSKTH"],
    queryFn: fetchProgressSKTH,
    staleTime: 5 * 60 * 1000,
  });

  const parseProgress = (val: string) => {
    const num = parseFloat(val.replace(',', '.').replace('%', ''));
    return isNaN(num) ? 0 : num;
  };

  const totals = progressData.reduce(
    (acc, r) => ({
      targetSampel: acc.targetSampel + r.targetSampel,
      open: acc.open + r.open,
      submittedByPencacah: acc.submittedByPencacah + r.submittedByPencacah,
      approvedByPengawas: acc.approvedByPengawas + r.approvedByPengawas,
      rejectedByPengawas: acc.rejectedByPengawas + r.rejectedByPengawas,
      completedByAdmin: acc.completedByAdmin + r.completedByAdmin,
    }),
    { targetSampel: 0, open: 0, submittedByPencacah: 0, approvedByPengawas: 0, rejectedByPengawas: 0, completedByAdmin: 0 }
  );

  const totalProgress = totals.targetSampel > 0
    ? ((totals.completedByAdmin / totals.targetSampel) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="construction-header py-6 px-4">
        <div className="max-w-full mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <TrendingUp className="h-7 w-7" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              Progres SKTH 2025
            </h1>
          </div>
          <p className="text-sm opacity-80 ml-10">
            Survei Konstruksi Tahunan — Progress Pengumpulan Data
          </p>
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground font-medium">Memuat data progres...</span>
          </div>
        ) : (
          <div className="rounded-xl border bg-card shadow-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold w-12 border-r">#</TableHead>
                  <TableHead className="font-semibold border-r">Kabupaten/Kota</TableHead>
                  <TableHead className="font-semibold text-center border-r">Target Sampel</TableHead>
                  <TableHead className="font-semibold text-center border-r">Open</TableHead>
                  <TableHead className="font-semibold text-center border-r">Submitted by Pencacah</TableHead>
                  <TableHead className="font-semibold text-center border-r">Approved by Pengawas</TableHead>
                  <TableHead className="font-semibold text-center border-r">Rejected by Pengawas</TableHead>
                  <TableHead className="font-semibold text-center border-r">Completed by Admin</TableHead>
                  <TableHead className="font-semibold text-center min-w-[180px]">Progres</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {progressData.map((row, i) => {
                  const pVal = parseProgress(row.progres);
                  const isJawaTengah = row.kabupatenKota.toUpperCase().includes('JAWA TENGAH');
                  return (
                    <TableRow key={i} className={isJawaTengah ? "bg-muted/50 font-bold" : "table-row-hover"}>
                      <TableCell className="text-muted-foreground text-xs border-r">{isJawaTengah ? '' : (i + 1)}</TableCell>
                      <TableCell className="text-sm font-medium border-r">{row.kabupatenKota}</TableCell>
                      <TableCell className="text-sm text-center border-r">{row.targetSampel}</TableCell>
                      <TableCell className="text-sm text-center border-r">{row.open}</TableCell>
                      <TableCell className="text-sm text-center border-r">{row.submittedByPencacah}</TableCell>
                      <TableCell className="text-sm text-center border-r">{row.approvedByPengawas}</TableCell>
                      <TableCell className="text-sm text-center border-r">{row.rejectedByPengawas}</TableCell>
                      <TableCell className="text-sm text-center border-r">{row.completedByAdmin}</TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-2">
                          <Progress value={pVal} className="h-2.5 flex-1 bg-muted" />
                          <span className="text-xs font-medium min-w-[42px] text-right">{row.progres}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
}
