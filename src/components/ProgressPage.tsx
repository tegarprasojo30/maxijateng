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

        {/* 🔥 LAYOUT BARU: PIE KIRI, TILES KANAN */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">

          {/* PIE CHART - KIRI */}
          <Card className="lg:col-span-1 h-full">
            <CardContent className="pt-5 pb-4 h-full flex flex-col">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Status Pengumpulan</h3>
              <div className="flex-1 min-h-[260px]">
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

          {/* TILES - KANAN (3x2) */}
          {grafikData && (
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-3">
              {TILE_CONFIG.map(tile => {
                const Icon = tile.icon;
                return (
                  <Card key={tile.key} className={`border-l-4 ${tile.colorClass} h-full`}>
                    <CardContent className="pt-4 pb-3 h-full flex flex-col justify-center">
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
        </div>

        {/* TABLE */}
        <Card>
          <CardContent className="pt-5 pb-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Detail Progress Kabupaten/Kota</h3>

            <div className="overflow-auto">
              <table className="w-full text-sm border">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left">Kabupaten/Kota</th>
                    <th className="p-2 text-right">Target Sampel</th>
                    <th className="p-2 text-right">Open</th>
                    <th className="p-2 text-right">Submitted by Pencacah</th>
                    <th className="p-2 text-right">Approved by Pengawas</th>
                    <th className="p-2 text-right">Rejected by Pengawas</th>
                    <th className="p-2 text-right">Completed by Admin Kab/Kota</th>
                    <th className="p-2 text-right">Progres</th>
                  </tr>
                </thead>

                <tbody>
                  {progressData.map((row, index) => {
                    const progress = row.target
                      ? (row.completed / row.target) * 100
                      : 0;

                    return (
                      <tr key={index} className="border-t hover:bg-muted/50">
                        <td className="p-2">{row.kabupaten}</td>
                        <td className="p-2 text-right">{row.target}</td>
                        <td className="p-2 text-right">{row.open}</td>
                        <td className="p-2 text-right">{row.submitted}</td>
                        <td className="p-2 text-right">{row.approved}</td>
                        <td className="p-2 text-right">{row.rejected}</td>
                        <td className="p-2 text-right font-semibold">{row.completed}</td>
                        <td className="p-2 text-right font-semibold">
                          {progress.toFixed(2)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  export default ProgressPage;
