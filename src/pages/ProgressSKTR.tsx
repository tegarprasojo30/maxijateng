import { fetchProgressKTR1, fetchGrafikSKTR1 } from "@/lib/sheets";
import ProgressPage from "@/components/ProgressPage";

export default function ProgressSKTRPage() {
  return (
    <ProgressPage
      title="Progres SKTR 2026 - Triwulan II"
      subtitle="Survei Perusahaan Konstruksi Triwulanan — Progress Pengumpulan Data"
      progressQueryKey="progressKTR1"
      grafikQueryKey="grafikSKTR1"
      fetchProgress={fetchProgressKTR1}
      fetchGrafik={fetchGrafikSKTR1}
    />
  );
}
