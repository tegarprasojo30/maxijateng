import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Perusahaan } from "@/lib/sheets";
import { Building2, MapPin, Phone, Globe, FileText } from "lucide-react";

interface Props {
  company: Perusahaan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className="text-sm text-foreground">{value || '-'}</span>
    </div>
  );
}

export default function CompanyDetailDialog({ company, open, onOpenChange }: Props) {
  if (!company) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-[var(--font-heading)] text-lg">
            <Building2 className="h-5 w-5 text-primary" />
            Detail Perusahaan
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          <div className="p-4 rounded-lg bg-accent/40 border">
            <h3 className="font-semibold text-base mb-1">{company.namaPenyedia}</h3>
            <p className="text-sm text-muted-foreground">Kode Penyedia: {company.kodePenyedia}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <MapPin className="h-4 w-4" /> Lokasi
              </div>
              <DetailRow label="Kabupaten/Kota" value={company.kabupatenKota} />
              <DetailRow label="Alamat" value={company.alamat} />
              <DetailRow label="Kabupaten" value={company.kabupaten} />
              <DetailRow label="Provinsi" value={company.provinsi} />
              <DetailRow label="Kode Pos" value={company.kodePos} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <FileText className="h-4 w-4" /> Informasi Usaha
              </div>
              <DetailRow label="NPWP Penyedia" value={company.npwpPenyedia} />
              <DetailRow label="Bentuk Usaha" value={company.bentukUsaha} />
              <DetailRow label="Nomor PKP" value={company.nomorPKP} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Phone className="h-4 w-4" /> Kontak
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailRow label="Telepon" value={company.telepon} />
              <DetailRow label="Fax" value={company.fax} />
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <DetailRow label="Website" value={company.website} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
