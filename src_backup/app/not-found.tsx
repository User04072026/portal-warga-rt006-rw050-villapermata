import Link from "next/link";
export default function NotFound() {
  return <main style={{padding:48,fontFamily:"Arial"}}><h1>Halaman tidak ditemukan</h1><p>Menu atau halaman yang Anda cari belum tersedia.</p><Link href="/">Kembali ke dashboard</Link></main>;
}
