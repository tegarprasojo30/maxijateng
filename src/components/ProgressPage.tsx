import { useQuery } from "@tanstack/react-query";
import { type ProgressSKTH, type ProgressNotes, type GrafikData } from "@/lib/sheets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, TrendingUp, Target, FolderOpen, CheckCircle, XCircle, ShieldCheck } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useMemo } from "react";

interface ProgressPageProps {
  title: string;
  subtitle: string;
  progressQueryKey: string;
  grafikQueryKey: string;
  fetchProgress: () => Promise<{ data: ProgressSKTH[]; notes: ProgressNotes }>;
  fetchGrafik: () => Promise<GrafikData>;
}

const TILE_CONFIG = [
  { key: 'targetSampel' as const, label: 'Target Sampel', icon: Target, colorClass: 'border-l-primary' },
  { key: 'open' as const, label: 'Open', icon: FolderOpen, colorClass: 'border-l-amber-500' },
  { key: 'submittedByPencacah' as const, label: 'Submitted by Pencacah', icon: TrendingUp, colorClass: 'border-l-blue-500' },
  { key: 'approvedByPengawas' as const, label: 'Approved by Pengawas', icon: CheckCircle, colorClass: 'border-l-green-500' },
  { key: 'rejectedByPengawas' as const, label: 'Rejected by Pengawas', icon: XCircle, colorClass: 'border-l-red-500' },
  { key: 'completedByAdmin' as const, label: 'Completed by Admin', icon: ShieldCheck, colorClass: 'border-l-purple-500' },
];

export default function ProgressPage({
  title, subtitle, progressQueryKey, grafikQueryKey, fetchProgress, fetchGrafik
}: ProgressPageProps) {

  const { data: progressResult, isLoading } = useQuery({
    queryKey: [progressQueryKey],
    queryFn: fetchProgress,
  });

  const { data: grafikData } = useQuery({
    queryKey: [grafikQueryKey],
    queryFn: fetchGrafik,
  });

  const progressData = progressResult?.data || [];
  const notes = progressResult?.notes;

  const totalRow = useMemo(() => {
    return progressData.find(r => r.kabupatenKota.toUpperCase().includes("JAWA TENGAH"));
  }, [progressData]);

  const progress = useMemo(() => {
    if (!totalRow) return 0;
    const completed = Number(totalRow.completedByAdmin);
    const target = Number(totalRow.targetSampel);
    if (!target) return 0;
    return (completed / target) * 100;
  }, [totalRow]);

  const pieData = useMemo(() => {
    const selesai = Number(progress.toFixed(2));
    const belum = Number((100 - progress).toFixed(2));
    return [
      { name: "Selesai", value: selesai },
      { name: "Belum", value: belum }
    ];
  }, [progress]);

  const parseProgress = (val: string) => {
    const num = parseFloat(val.replace(',', '.').replace('%', ''));
    return isNaN(num) ? 0 : num;
  };

  const PIE_COLORS = ['hsl(var(--primary))', 'hsl(var(--muted-foreground) / 0.3)'];

  return (
    <div className="min-h-screen bg-background">
      <header className="construction-header py-6 px-4">
        <div className="max-w-full mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <TrendingUp className="h-7 w-7" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h1>
          </div>
          <p className="text-sm opacity-80 ml-10">{subtitle}</p>
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 py-6 space-y-6">

        {/* ✅ TILES TETAP ADA */}
        {grafikData && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {TILE_CONFIG.map(tile => {
              const Icon = tile.icon;
              return (
                <Card key={tile.key} className={`border-l-4 ${tile.colorClass}`}>
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground truncate">{tile.label}</span>
                    </div>
                    <p className="text-2xl font-bold">{grafikData[tile.key]}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* ✅ PIE FIX */}
        <Card>
          <CardContent className="pt-5 pb-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Status Pengumpulan</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                    label={({ name, value }) => `${name}: ${value.toFixed(2)}%`}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* TABLE */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="rounded-xl border bg-card shadow-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Kabupaten/Kota</TableHead>
                  <TableHead className="text-center">Target</TableHead>
                  <TableHead className="text-center">Completed</TableHead>
                  <TableHead className="text-center">Progres</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {progressData.map((row, i) => {
                  const pVal = parseProgress(row.progres);
                  return (
                    <TableRow key={i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{row.kabupatenKota}</TableCell>
                      <TableCell className="text-center">{row.targetSampel}</TableCell>
                      <TableCell className="text-center">{row.completedByAdmin}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={pVal} className="h-2 flex-1" />
                          <span className="text-xs w-12 text-right">{row.progres}</span>
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
