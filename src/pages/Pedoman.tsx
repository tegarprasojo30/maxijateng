import { useQuery } from "@tanstack/react-query";
import { fetchPedoman } from "@/lib/sheets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, Download } from "lucide-react";

export default function Pedoman() {
  const { data, isLoading } = useQuery({
    queryKey: ["pedoman"],
    queryFn: fetchPedoman,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="construction-header py-6 px-4 sticky top-0 z-20">
        <div className="max-w-full mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <BookOpen className="h-7 w-7" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Pedoman</h1>
          </div>
          <p className="text-sm opacity-80 ml-10">Dokumen pedoman dan panduan survei konstruksi</p>
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground font-medium">Memuat data pedoman...</span>
          </div>
        ) : (
          <div className="rounded-xl border bg-card shadow-sm overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="bg-muted">
                  <TableHead className="font-semibold w-12 border-r bg-muted">#</TableHead>
                  <TableHead className="font-semibold border-r bg-muted">Judul</TableHead>
                  <TableHead className="font-semibold bg-muted w-32 text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!data || data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">Tidak ada data pedoman.</TableCell>
                  </TableRow>
                ) : (
                  data.map((item, i) => (
                    <TableRow key={i} className="table-row-hover">
                      <TableCell className="text-muted-foreground text-xs border-r">{i + 1}</TableCell>
                      <TableCell className="text-sm font-medium border-r">{item.judul}</TableCell>
                      <TableCell className="text-center">
                        {item.link ? (
                          <Button variant="outline" size="sm" asChild>
                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                              <Download className="h-3.5 w-3.5 mr-1.5" />
                              Unduh
                            </a>
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
}
