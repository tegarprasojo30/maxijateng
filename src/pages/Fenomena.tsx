import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Newspaper, Loader2, ExternalLink, Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
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

const FALLBACK_NEWS: NewsItem[] = [
  {
    title: "Pembangunan Infrastruktur Jawa Tengah Terus Berjalan di 2026",
    link: "#",
    pubDate: new Date().toISOString(),
    description: "",
    source: "Contoh Berita",
  },
  {
    title: "Investasi Konstruksi di Jateng Meningkat Signifikan",
    link: "#",
    pubDate: new Date().toISOString(),
    description: "",
    source: "Contoh Berita",
  },
];

const GNEWS_RSS = `https://news.google.com/rss/search?q=${encodeURIComponent(QUERY)}&hl=id&gl=ID&ceid=ID:id`;

function parseRss(xmlText: string): NewsItem[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");
  const itemElements = xmlDoc.querySelectorAll("item");
  const items: NewsItem[] = [];

  itemElements.forEach((item, index) => {
    if (index >= 30) return;
    const title = item.querySelector("title")?.textContent?.trim() || "";
    const link = item.querySelector("link")?.textContent?.trim() || "";
    const pubDate = item.querySelector("pubDate")?.textContent?.trim() || "";
    const source = item.querySelector("source")?.textContent?.trim() || "";
    const description = item.querySelector("description")?.innerHTML || "";
    const thumbMatch = description.match(/<img[^>]+src="([^"]+)"/);
    const thumbnail = thumbMatch?.[1] || "";
    if (title && link) items.push({ title, link, pubDate, description: "", source, thumbnail });
  });
  return items;
}

async function fetchViaProxy(proxyUrl: string, signal: AbortSignal): Promise<NewsItem[]> {
  const res = await fetch(proxyUrl, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const json = await res.json();
    // rss2json format
    if (Array.isArray(json.items)) {
      return json.items.slice(0, 30).map((it: any) => ({
        title: it.title || "",
        link: it.link || "",
        pubDate: it.pubDate || "",
        description: "",
        source: it.author || (it.source && it.source.title) || "",
        thumbnail: it.thumbnail || it.enclosure?.link || "",
      })).filter((i: NewsItem) => i.title && i.link);
    }
    // allorigins {contents}
    if (typeof json.contents === "string") return parseRss(json.contents);
  }
  const text = await res.text();
  return parseRss(text);
}

async function fetchNews(): Promise<NewsItem[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  const proxies = [
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(GNEWS_RSS)}&count=30`,
    `https://api.allorigins.win/get?url=${encodeURIComponent(GNEWS_RSS)}`,
    `https://corsproxy.io/?${encodeURIComponent(GNEWS_RSS)}`,
  ];

  let lastErr: unknown = null;
  for (const proxy of proxies) {
    try {
      const items = await fetchViaProxy(proxy, controller.signal);
      if (items.length > 0) {
        clearTimeout(timeoutId);
        const filtered = items.filter(i => {
          if (!i.pubDate) return true;
          const year = new Date(i.pubDate).getFullYear();
          return isNaN(year) || year >= 2025;
        });
        return filtered.length > 0 ? filtered : items;
      }
    } catch (err) {
      lastErr = err;
    }
  }
  clearTimeout(timeoutId);
  throw lastErr instanceof Error ? lastErr : new Error("Gagal memuat berita");
}

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const PAGE_SIZE = 15;

export default function Fenomena() {
  const [bulan, setBulan] = useState<string>("all");
  const [tahun, setTahun] = useState<string>(String(YEAR));
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["fenomena"],
    queryFn: fetchNews,
    staleTime: 30 * 60 * 1000,
    refetchInterval: 6 * 60 * 60 * 1000,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    return data
      .filter((item) => {
        const d = new Date(item.pubDate);
        if (String(d.getFullYear()) !== tahun) return false;
        if (bulan !== "all" && d.getMonth() !== Number(bulan)) return false;
        return true;
      })
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  }, [data, bulan, tahun]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [bulan, tahun]);

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
              <SelectTrigger className="w-40"><SelectValue placeholder="Semua Bulan" /></SelectTrigger>
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
          <div>
            <div className="text-center py-6 text-amber-600 dark:text-amber-400 mb-4">
              Gagal memuat berita terbaru. Menampilkan data contoh.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FALLBACK_NEWS.map((item, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow flex flex-col">
                  <CardContent className="p-4 flex flex-col gap-2 flex-1">
                    <h3 className="font-semibold text-sm leading-snug line-clamp-3">{item.title}</h3>
                    <div className="mt-auto pt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span className="truncate">{item.source}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Tidak ada berita untuk filter ini.</div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paged.map((item, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow flex flex-col">
                  {item.thumbnail && (
                    <img src={item.thumbnail} alt="" className="w-full h-40 object-cover rounded-t-lg" loading="lazy" />
                  )}
                  <CardContent className="p-4 flex flex-col gap-2 flex-1">
                    <h3 className="font-semibold text-sm leading-snug line-clamp-3">{item.title}</h3>
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

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 mt-4">
                <p className="text-sm text-muted-foreground">
                  Menampilkan {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length).toLocaleString("id-ID")}–{Math.min(page * PAGE_SIZE, filtered.length).toLocaleString("id-ID")} dari {filtered.length.toLocaleString("id-ID")} berita
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => setPage(1)} disabled={page === 1}>
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="px-3 text-sm font-medium">
                    {page} / {totalPages}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage(totalPages)} disabled={page === totalPages}>
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
