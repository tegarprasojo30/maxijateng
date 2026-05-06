import { useQuery } from "@tanstack/react-query";
import { type ProgressSKTH, type ProgressNotes, type GrafikData } from "@/lib/sheets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, Target, FolderOpen, CheckCircle, XCircle, ShieldCheck, FileDown, FileText } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ProgressPageProps {
  title: string;
  subtitle: string;
  progressQueryKey: string;
  grafikQueryKey: string;
  fetchProgress: () => Promise<{ data: ProgressSKTH[]; notes: ProgressNotes }>;
  fetchGrafik: () => Promise<GrafikData>;
}

export default function ProgressPage({
  title, subtitle, progressQueryKey, grafikQueryKey, fetchProgress, fetchGrafik,
}: ProgressPageProps) {
  const { data: progressResult, isLoading } = useQuery({
    queryKey: [progressQueryKey],
    queryFn: fetchProgress,
    staleTime: 5 * 60 * 1000,
  });

  const { data: grafikData } = useQuery({
    queryKey: [grafikQueryKey],
    queryFn: fetchGrafik,
    staleTime: 5 * 60 * 1000,
  });

  const progressData = progressResult?.data || [];
  const notes = progressResult?.notes;

  const parseProgress = (val: string) => {
    const num = parseFloat(val.replace(',', '.').replace('%', ''));
    return isNaN(num) ? 0 : num;
  };

  const tableHeaders = ["No", "Kabupaten/Kota", "Target Sampel", "Open", "Submitted by Pencacah", "Approved by Pengawas", "Rejected by Pengawas", "Completed by Admin", "Progres"];

  const tableRows = () => progressData.map((row, i) => {
    const isTotal = row.kabupatenKota.toUpperCase().includes('JAWA TENGAH');
    return [isTotal ? '' : (i + 1), row.kabupatenKota, row.targetSampel, row.open, row.submittedByPencacah, row.approvedByPengawas, row.rejectedByPengawas, row.completedByAdmin, row.progres];
  });

  const handleDownloadXlsx = () => {
    if (!progressData.length) return;
    const ws = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableRows()]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Progres");
    XLSX.writeFile(wb, `${title.replace(/\s+/g, '_')}.xlsx`);
  };

  const handleDownloadPdf = () => {
    if (!progressData.length) return;
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.text(title, 14, 14);
    autoTable(doc, { head: [tableHeaders], body: tableRows() as any[][], startY: 20, styles: { fontSize: 8 } });
    doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="construction-header py-6 px-4 sticky top-0 z-20">
        <div className="max-w-full mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <TrendingUp className="h-7 w-7" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h1>
          </div>
          <p className="text-sm opacity-80 ml-10">{subtitle}</p>
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 py-6 space-y-6">
        {/* Grafik Tiles */}
        {grafikData && <GrafikTiles data={grafikData} />}

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground font-medium">Memuat data progres...</span>
          </div>
        ) : (
          <>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={handleDownloadXlsx} disabled={!progressData.length}>
                <FileDown className="h-4 w-4 mr-1.5" />
                Unduh .xlsx
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadPdf} disabled={!progressData.length}>
                <FileText className="h-4 w-4 mr-1.5" />
                Unduh .pdf
              </Button>
            </div>
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
                    const isTotal = row.kabupatenKota.toUpperCase().includes('JAWA TENGAH');
                    return (
                      <TableRow key={i} className={isTotal ? "bg-muted/50 font-bold" : "table-row-hover"}>
                        <TableCell className={`text-xs border-r ${isTotal ? 'font-bold' : 'text-muted-foreground'}`}>{isTotal ? '' : (i + 1)}</TableCell>
                        <TableCell className={`text-sm border-r ${isTotal ? 'font-bold' : 'font-medium'}`}>{row.kabupatenKota}</TableCell>
                        <TableCell className={`text-sm text-center border-r ${isTotal ? 'font-bold' : ''}`}>{row.targetSampel}</TableCell>
                        <TableCell className={`text-sm text-center border-r ${isTotal ? 'font-bold' : ''}`}>{row.open}</TableCell>
                        <TableCell className={`text-sm text-center border-r ${isTotal ? 'font-bold' : ''}`}>{row.submittedByPencacah}</TableCell>
                        <TableCell className={`text-sm text-center border-r ${isTotal ? 'font-bold' : ''}`}>{row.approvedByPengawas}</TableCell>
                        <TableCell className={`text-sm text-center border-r ${isTotal ? 'font-bold' : ''}`}>{row.rejectedByPengawas}</TableCell>
                        <TableCell className={`text-sm text-center border-r ${isTotal ? 'font-bold' : ''}`}>{row.completedByAdmin}</TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-2">
                            <Progress value={pVal} className="h-2.5 flex-1 bg-muted" />
                            <span className={`text-xs min-w-[42px] text-right ${isTotal ? 'font-bold' : 'font-medium'}`}>{row.progres}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
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
    </div>
  );
}

const TILE_CONFIG = [
  { key: 'targetSampel' as const, label: 'Target Sampel', icon: Target, colorClass: 'border-l-primary' },
  { key: 'open' as const, label: 'Open', icon: FolderOpen, colorClass: 'border-l-amber-500' },
  { key: 'submittedByPencacah' as const, label: 'Submitted by Pencacah', icon: TrendingUp, colorClass: 'border-l-blue-500' },
  { key: 'approvedByPengawas' as const, label: 'Approved by Pengawas', icon: CheckCircle, colorClass: 'border-l-green-500' },
  { key: 'rejectedByPengawas' as const, label: 'Rejected by Pengawas', icon: XCircle, colorClass: 'border-l-red-500' },
  { key: 'completedByAdmin' as const, label: 'Completed by Admin', icon: ShieldCheck, colorClass: 'border-l-purple-500' },
];

function GrafikTiles({ data }: { data: GrafikData }) {
  const [animatedAngle, setAnimatedAngle] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedAngle(eased * 360);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  const pieData = [
    { name: 'Selesai', value: data.completedByAdmin / data.targetSampel },
    { name: 'Belum', value: 1 - (data.completedByAdmin / data.targetSampel) },
  ];

  const PIE_COLORS = ['hsl(var(--primary))', 'hsl(var(--muted-foreground) / 0.3)'];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {TILE_CONFIG.map(tile => {
          const Icon = tile.icon;
          return (
            <Card key={tile.key} className={`border-l-4 ${tile.colorClass}`}>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground truncate">{tile.label}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{data[tile.key]}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="pt-5 pb-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Status Pengumpulan</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  endAngle={animatedAngle}
                  startAngle={0}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(percent: number) => `${(percent * 100).toFixed(2)}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
