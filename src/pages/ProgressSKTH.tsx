import { fetchProgressSKTH, fetchGrafikSKTH } from "@/lib/sheets";
import ProgressPage from "@/components/ProgressPage";

export default function ProgressSKTHPage() {
  return (
    <ProgressPage
      title="Progres SKTH 2025"
      subtitle="Survei Konstruksi Tahunan — Progress Pengumpulan Data"
      progressQueryKey="progressSKTH"
      grafikQueryKey="grafikSKTH"
      fetchProgress={fetchProgressSKTH}
      fetchGrafik={fetchGrafikSKTH}
    />
  );
}
