'use client';

import { fetchSheetData } from "@/lib/google-sheets";
import { useState, useEffect } from "react";
import {
  Home, Users, Wallet, ClipboardList, Package, CalendarDays, Megaphone,
  Dumbbell, Settings, Search, Bell, ChevronRight, ArrowUpRight, ArrowDownRight,
  CircleDollarSign, UserRound, CheckCircle2, Clock3, Menu, X, FileSpreadsheet,
  RefreshCw, ShieldCheck, CalendarCheck, Boxes
} from "lucide-react";

const modules = [
  { label: "Dashboard", icon: Home },
  { label: "Data Warga", icon: Users },
  { label: "Struktur Pengurus", icon: UserRound },
  { label: "Laporan Keuangan", icon: Wallet },
  { label: "Program Kerja", icon: ClipboardList },
  { label: "Inventaris & Fasilitas", icon: Package },
  { label: "Peminjaman Fasilitas", icon: CalendarCheck },
  { label: "Agenda & Kegiatan", icon: CalendarDays },
  { label: "Pengumuman & Aspirasi", icon: Megaphone },
  { label: "Karang Taruna", icon: Dumbbell },
];

const descriptions: Record<string, string> = {
  "Data Warga": "Kelola data kepala keluarga dan anggota dengan akses terbatas.",
  "Struktur Pengurus": "Kelola jabatan, periode, dan status pengurus RT.",
  "Laporan Keuangan": "Catat pemasukan, pengeluaran, verifikasi, dan laporan kas.",
  "Program Kerja": "Pantau target, anggaran, penanggung jawab, dan realisasi program.",
  "Inventaris & Fasilitas": "Kelola aset, jumlah barang, kondisi, dan lokasi penyimpanan.",
  "Peminjaman Fasilitas": "Kelola pengajuan, persetujuan, jadwal, dan pengembalian.",
  "Agenda & Kegiatan": "Kelola kalender rapat, kerja bakti, olahraga, dan acara warga.",
  "Pengumuman & Aspirasi": "Publikasikan informasi dan tindak lanjuti aspirasi warga.",
  "Karang Taruna": "Kelola kegiatan pemuda, olahraga, dokumentasi, dan program kerja.",
};

function Metric({ title, value, detail, icon: Icon, tone }: any) {
  return (
    <div className="metric">
      <div className={`metric-icon ${tone}`}><Icon size={19}/></div>
      <div className="metric-title">{title}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-detail">{detail}</div>
    </div>
  );
}

export default function Dashboard() {
  const [active, setActive] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [syncMessage, setSyncMessage] = useState("Mengecek koneksi Google Sheets...");
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    totalWarga: 0,
    pengurusAktif: 0,
    programKerjaCount: 0,
    totalMasuk: 0,
    totalKeluar: 0,
    saldoTerkini: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    setSyncMessage("Menghubungkan ke Google Sheets...");

    try {
      const data = await fetchSheetData();

      if (data && Array.isArray(data)) {
        let masuk = 0;
        let keluar = 0;

        data.forEach((item: any) => {
          const valMasuk = parseFloat(String(item["Kas Masuk (Rp)"] || item["Kas Masuk"] || "0").replace(/[^0-9.-]+/g, ""));
          const valKeluar = parseFloat(String(item["Kas Keluar (Rp)"] || item["Kas Keluar"] || "0").replace(/[^0-9.-]+/g, ""));
          if (!isNaN(valMasuk)) masuk += valMasuk;
          if (!isNaN(valKeluar)) keluar += valKeluar;
        });

        setSummary({
          totalWarga: data.length,
          pengurusAktif: 0,
          programKerjaCount: 0,
          totalMasuk: masuk,
          totalKeluar: keluar,
          saldoTerkini: masuk - keluar,
        });

        setSyncMessage("Tersambung penuh ke Google Spreadsheet (Real-time)");
      } else {
        setSyncMessage("Data berhasil diambil tetapi format tidak sesuai atau kosong.");
      }
    } catch (err) {
      console.error("Error fetching Google Sheets data:", err);
      setSyncMessage("Gagal menyambung. Periksa URL di .env.local");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatRupiah = (num: number) => {
    return "Rp " + num.toLocaleString("id-ID");
  };

  const selectModule = (label: string) => {
    setActive(label);
    setMobileOpen(false);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Home size={22}/></div>
          <div><strong>RT 006</strong><span>Vila Permata</span></div>
          <button className="close-mobile" onClick={() => setMobileOpen(false)} aria-label="Tutup menu"><X size={18}/></button>
        </div>
        <div className="nav-caption">MENU UTAMA</div>
        <nav>
          {modules.map(({label, icon: Icon}) => (
            <button key={label} onClick={() => selectModule(label)} className={`nav-item ${active === label ? "nav-active" : ""}`}>
              <Icon size={18}/><span>{label}</span>{active === label && <ChevronRight className="nav-chevron" size={16}/>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="secure-label"><ShieldCheck size={17}/><span>Portal warga</span><span className="secure-dot"/></div>
          <p>Transparan, tertib, dan bersama.</p>
        </div>
      </aside>

      {mobileOpen && <button className="mobile-scrim" aria-label="Tutup navigasi" onClick={() => setMobileOpen(false)}/>}

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Buka menu"><Menu size={21}/></button>
          <div className="breadcrumb">Portal Warga <span>/</span> <strong>{active}</strong></div>
          <div className="top-actions">
            <label className="search-box"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Cari menu..."/></label>
            <button className="icon-button" aria-label="Notifikasi"><Bell size={18}/><i/></button>
            <div className="avatar">RT</div>
          </div>
        </header>

        {active === "Dashboard" ? (
          <div className="page-content">
            <section className="hero">
              <div className="hero-chip"><span className="live-dot"/> Sistem Informasi Digital RT 006</div>
              <h1>Selamat Datang di Portal Warga<br/><span>RT 006 Vila Permata</span></h1>
              <p>Pusat informasi transparan, pengelolaan keuangan real-time,<br className="desktop-break"/> dan peminjaman fasilitas lingkungan.</p>
              <div className="hero-actions">
                <button className="button button-green" onClick={() => selectModule("Peminjaman Fasilitas")}><CalendarCheck size={16}/> Pesan Lapangan Olahraga</button>
                <button className="button button-yellow" onClick={() => selectModule("Pengumuman & Aspirasi")}><Megaphone size={16}/> Kirim Aspirasi / Laporan</button>
              </div>
              <div className="hero-decoration hero-decoration-one"/><div className="hero-decoration hero-decoration-two"/>
            </section>

<<<<<<< HEAD
        <div className="section-heading finance-heading"><div><h2>Laporan Keuangan RT</h2><p>Ringkasan kas berdasarkan data Google Spreadsheet</p></div><button className="text-link" onClick={() => selectModule("Laporan Keuangan")}>Buka laporan lengkap <ChevronRight size={15}/></button></div>
        <section className="metrics-grid finance-grid">
          <Metric title="Total Uang Masuk" value={loading ? "Rp ..." : formatRupiah(summary.totalMasuk)} detail="Pemasukan terdata di Spreadsheet" icon={ArrowDownRight} tone="green"/>
          <Metric title="Total Uang Keluar" value={loading ? "Rp ..." : formatRupiah(summary.totalKeluar)} detail="Pengeluaran terdata di Spreadsheet" icon={ArrowUpRight} tone="red"/>
          <div className="balance-card"><div className="balance-top"><span>Saldo Terkini Kas RT</span><CircleDollarSign size={20}/></div><strong>{loading ? "Rp ..." : formatRupiah(summary.saldoTerkini)}</strong><small><CheckCircle2 size={13}/> Kalkulasi otomatis dari Spreadsheet</small></div>
        </section>
=======
            <div className="section-heading"><div><h2>Ringkasan Data Warga</h2><p>Informasi singkat administrasi dan kondisi lingkungan RT 006 / RW 050</p></div><span className="updated"><span className="live-dot"/> {loading ? "Memuat Data..." : "Data Sinkron Real-time"}</span></div>
            <section className="metrics-grid">
              <Metric title="Total Warga Terdata" value={loading ? "..." : `${summary.totalWarga} Jiwa`} detail="Data murni dari Google Sheets" icon={Users} tone="blue"/>
              <Metric title="Pengurus Aktif" value={loading ? "..." : `${summary.pengurusAktif} Orang`} detail="Data murni dari Google Sheets" icon={UserRound} tone="green"/>
              <Metric title="Program Kerja Lingkungan" value={loading ? "..." : `${summary.programKerjaCount} Program`} detail="Data murni dari Google Sheets" icon={ClipboardList} tone="amber"/>
            </section>
>>>>>>> aa022987 (Update google-sheets and configuration)

            <div className="section-heading finance-heading"><div><h2>Laporan Keuangan RT</h2><p>Ringkasan kas berdasarkan data Google Spreadsheet</p></div><button className="text-link" onClick={() => selectModule("Laporan Keuangan")}>Buka laporan lengkap <ChevronRight size={15}/></button></div>
            <section className="metrics-grid finance-grid">
              <Metric title="Total Uang Masuk" value={loading ? "Rp ..." : formatRupiah(summary.totalMasuk)} detail="Pemasukan terdata di Spreadsheet" icon={ArrowDownRight} tone="green"/>
              <Metric title="Total Uang Keluar" value={loading ? "Rp ..." : formatRupiah(summary.totalKeluar)} detail="Pengeluaran terdata di Spreadsheet" icon={ArrowUpRight} tone="red"/>
              <div className="balance-card"><div className="balance-top"><span>Saldo Terkini Kas RT</span><CircleDollarSign size={20}/></div><strong>{loading ? "Rp ..." : formatRupiah(summary.saldoTerkini)}</strong><small><CheckCircle2 size={13}/> Kalkulasi otomatis dari Spreadsheet</small></div>
            </section>

            <section className="panel agenda-panel">
              <div className="panel-heading"><div className="panel-title-icon"><CalendarDays size={17}/></div><div><h3>Informasi & Agenda Pengurus RT</h3><p>Agenda dan informasi penting lingkungan</p></div><button className="subtle-button" onClick={() => selectModule("Agenda & Kegiatan")}>Lihat semua <ChevronRight size={14}/></button></div>
              <div className="agenda-grid">
                <div className="agenda-item"><span className="tag tag-blue">Kegiatan Rutin</span><strong>Gotong Royong & Kerja Bakti Kebersihan</strong><p>Kerja bakti pembersihan saluran drainase dan lingkungan RT 006 Vila Permata.</p></div>
                <div className="agenda-item"><span className="tag tag-green">Informasi Warga</span><strong>Informasi Kas dan Kegiatan RT</strong><p>Setiap pengeluaran kas dapat dipantau langsung warga secara transparan di portal ini.</p></div>
              </div>
            </section>

            <section className="panel inventory-panel">
              <div className="panel-heading"><div className="panel-title-icon green-icon"><Boxes size={17}/></div><div><h3>Inventaris, Fasilitas & Lapangan Olahraga</h3><p>Ringkasan fasilitas lingkungan</p></div><button className="subtle-button" onClick={() => selectModule("Inventaris & Fasilitas")}>Kelola inventaris <ChevronRight size={14}/></button></div>
              <div className="inventory-grid">
                {[["Lapangan Olahraga","Jadwal dan peminjaman fasilitas", "green"],["Meja Plastik","Jumlah dan kondisi barang","blue"],["Kursi Plastik","Jumlah dan kondisi barang","indigo"],["Tenda & Terpal","Ketersediaan perlengkapan","orange"]].map(([title,detail,tone])=>(
                  <button className="inventory-card" key={title} onClick={() => selectModule(title === "Lapangan Olahraga" ? "Peminjaman Fasilitas" : "Inventaris & Fasilitas")}>
                    <span className={`inventory-symbol ${tone}`}><Package size={18}/></span>
                    <strong>{title}</strong>
                    <small>{detail}</small>
                    <span className="inventory-link">Kelola <ChevronRight size={13}/></span>
                  </button>
                ))}
              </div>
            </section>

            <section className="panel sync-panel">
              <div className="sync-icon"><FileSpreadsheet size={20}/></div><div className="sync-copy"><h3>Integrasi Google Sheets</h3><p>Status: <strong>{syncMessage}</strong></p></div><button className="button button-outline" onClick={fetchData}><RefreshCw size={15}/> Periksa koneksi</button>
            </section>
            <footer>© {new Date().getFullYear()} Portal Warga RT 006 Vila Permata · Sistem administrasi lingkungan</footer>
          </div>
        ) : (
          <div className="page-content module-page">
            <section className="module-banner"><div className="module-icon"><Settings size={21}/></div><div><div className="eyebrow">MODUL PORTAL WARGA</div><h1>{active}</h1><p>{descriptions[active] || "Kelola informasi dan layanan lingkungan RT 006."}</p></div></section>
            <section className="panel module-placeholder">
              <div className="placeholder-icon"><ClipboardList size={27}/></div>
              <h2>Modul {active}</h2>
              <p>Terhubung ke Google Spreadsheet untuk menampilkan data secara dinamis.</p>
              <div className="module-notice"><Clock3 size={17}/><span>Portal Warga RT 006 Vila Permata terhubung secara real-time.</span></div>
              <button className="button button-primary" onClick={() => selectModule("Dashboard")}><Home size={16}/> Kembali ke Dashboard</button>
            </section>
            <footer>© {new Date().getFullYear()} Portal Warga RT 006 Vila Permata</footer>
          </div>
<<<<<<< HEAD
        </section>

        <section className="panel sync-panel">
          <div className="sync-icon"><FileSpreadsheet size={20}/></div><div className="sync-copy"><h3>Integrasi Google Sheets</h3><p>Status: <strong>{syncMessage}</strong></p></div><button className="button button-outline" onClick={fetchData}><RefreshCw size={15}/> Periksa koneksi</button>
        </section>
        <footer>© {new Date().getFullYear()} Portal Warga RT 006 Vila Permata · Sistem administrasi lingkungan</footer>
      </div> : <div className="page-content module-page">
        <section className="module-banner"><div className="module-icon"><Settings size={21}/></div><div><div className="eyebrow">MODUL PORTAL WARGA</div><h1>{active}</h1><p>{descriptions[active] || "Kelola informasi dan layanan lingkungan RT 006."}</p></div></section>
        <section className="panel module-placeholder">
          <div className="placeholder-icon"><ClipboardList size={27}/></div>
          <h2>Modul {active}</h2>
          <p>Terhubung ke Google Spreadsheet untuk menampilkan data secara dinamis.</p>
          <div className="module-notice"><Clock3 size={17}/><span>Portal Warga RT 006 Vila Permata terhubung secara real-time.</span></div>
          <button className="button button-primary" onClick={() => selectModule("Dashboard")}><Home size={16}/> Kembali ke Dashboard</button>
        </section>
        <footer>© {new Date().getFullYear()} Portal Warga RT 006 Vila Permata</footer>
      </div>}
    </main>
  </div>;
}
=======
        )}
      </main>
    </div>
  );
}
>>>>>>> aa022987 (Update google-sheets and configuration)
