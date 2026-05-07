import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Newspaper, Loader2, ExternalLink, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source?: string;
  thumbnail?: string;
}

const QUERY = 'konstruksi OR "proyek konstruksi" "Jawa Tengah"';
const YEAR = 2026;

async function fetchNews(): Promise<NewsItem[]> {
  // Restrict to current year via Google News when= parameter
  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(QUERY + ` after:${YEAR}-01-01 before:${YEAR}-12-31`)}&hl=id&gl=ID&ceid=ID:id`;
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=50&_=${Date.now()}`;
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error("Gagal memuat berita");
  const json = await res.json();
  const items: NewsItem[] = (json.items || []).map((it: any) => {
    const desc: string = it.description || "";
    const sourceMatch = desc.match(/<font[^>]*>([^<]+)<\/font>/);
    const thumbMatch = desc.match(/<img[^>]+src="([^"]+)"/);
    const cleanDesc = desc.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return {
      title: it.title,
      link: it.link,
      pubDate: it.pubDate,
      description: cleanDesc,
      source: sourceMatch?.[1] || it.author || "",
      thumbnail: thumbMatch?.[1],
    };
  });
  return items.filter((i) => new Date(i.pubDate).getFullYear() === YEAR);
}

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export default function Fenomena() {
  const [bulan, setBulan] = useState<string>("all");
  const [tahun, setTahun] = useState<string>(String(YEAR));

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["fenomena"],
    queryFn: fetchNews,
    staleTime: 30 * 60 * 1000,
    refetchInterval: 6 * 60 * 60 * 1000,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => {
      const d = new Date(item.pubDate);
      if (String(d.getFullYear()) !== tahun) return false;
      if (bulan !== "all" && d.getMonth() !== Number(bulan)) return false;
      return true;
    });
  }, [data, bulan, tahun]);

  return (
    <div className="min-h-screen bg-background">
      <header className="construction-header py-6 px-4 sticky top-0 z-20">
        <div className="max-w-full mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <Newspaper className="h-7 w-7" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Fenomena</h1>
          </div>
          <p className="text-sm opacity-80 ml-10">Berita & artikel bidang konstruksi di Jawa Tengah (tahun {YEAR})</p>
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 py-6 space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Bulan</label>
            <Select value={bulan} onValueChange={setBulan}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Bulan</SelectItem>
                {MONTHS.map((m, i) => <SelectItem key={i} value={String(i)}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Tahun</label>
            <Select value={tahun} onValueChange={setTahun}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={String(YEAR)}>{YEAR}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Refresh
          </Button>
          <div className="ml-auto text-sm text-muted-foreground">{filtered.length} berita</div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground font-medium">Memuat berita...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-destructive">Gagal memuat berita. Coba refresh.</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Tidak ada berita untuk filter ini.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow flex flex-col">
                {item.thumbnail && (
                  <img src={item.thumbnail} alt="" className="w-full h-40 object-cover rounded-t-lg" loading="lazy" />
                )}
                <CardContent className="p-4 flex flex-col gap-2 flex-1">
                  <h3 className="font-semibold text-sm leading-snug line-clamp-3">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-muted-foreground line-clamp-3">{item.description}</p>
                  )}
                  <div className="mt-auto pt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Calendar className="h-3 w-3 shrink-0" />
                      <span className="truncate">
                        {new Date(item.pubDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        {item.source ? ` · ${item.source}` : ""}
                      </span>
                    </div>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-primary inline-flex items-center gap-1 font-medium shrink-0">
                      Baca <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
