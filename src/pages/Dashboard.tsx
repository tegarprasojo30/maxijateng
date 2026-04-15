import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "@/lib/sheets";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, LayoutDashboard, Target, CheckCircle, TrendingUp, Building2 } from "lucide-react";

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground font-medium">Memuat dashboard...</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="construction-header py-6 px-4 sticky top-0 z-20">
        <div className="max-w-full mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <LayoutDashboard className="h-7 w-7" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Dashboard</h1>
          </div>
          <p className="text-sm opacity-80 ml-10">Monitoring Survei Konstruksi — Provinsi Jawa Tengah</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* SKTH Section */}
        <SurveySection
          title={data.skthTitle}
          targetSampel={data.skthTargetSampel}
          fraction={data.skthFraction}
          progres={data.skthProgres}
          besar={data.skthBesar}
          menengah={data.skthMenengah}
          kecil={data.skthKecil}
        />

        {/* SKTR Section */}
        <SurveySection
          title={data.sktrTitle}
          subtitle={data.sktrTriwulan}
          targetSampel={data.sktrTargetSampel}
          fraction={data.sktrFraction}
          progres={data.sktrProgres}
          besar={data.sktrBesar}
          menengah={data.sktrMenengah}
          kecil={data.sktrKecil}
        />
      </main>
    </div>
  );
}

function SurveySection({
  title, subtitle, targetSampel, fraction, progres, besar, menengah, kecil,
}: {
  title: string; subtitle?: string; targetSampel: string; fraction: string;
  progres: string; besar: string; menengah: string; kecil: string;
}) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Target Sampel</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{targetSampel}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-muted-foreground">Selesai</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{fraction}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-medium text-muted-foreground">Progres</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{progres}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <Building2 className="h-4 w-4" /> Berdasarkan Skala Usaha
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Besar", value: besar, color: "bg-primary/10 text-primary" },
            { label: "Menengah", value: menengah, color: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
            { label: "Kecil", value: kecil, color: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" },
          ].map(s => (
            <Card key={s.label} className="text-center">
              <CardContent className="pt-4 pb-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">Skala {s.label}</p>
                <p className={`text-2xl font-bold rounded-md inline-block px-3 py-1 ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
