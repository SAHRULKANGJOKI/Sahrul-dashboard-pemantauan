'use client'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [akunList, setAkunList] = useState([])
  const [akunPilih, setAkunPilih] = useState(null)
  const [cari, setCari] = useState('')
  const [kategori, setKategori] = useState('all')

  useEffect(() => {
    cekLogin()
    ambilData()
    setInterval(ambilData, 30000) // Perbarui otomatis tiap 30 detik
  }, [])

  async function cekLogin() {
    const {data:{session}} = await supabase.auth.getSession()
    if (!session) router.push('/login')
  }

  async function ambilData() {
    const {data} = await supabase.from('akun_redfinger').select('*').order('username')
    if (data) {
      setAkunList(data)
      if (!akunPilih) setAkunPilih(data[0])
    }
  }

  const barangFilter = akunPilih?.tas?.filter(item => 
    item.nama.toLowerCase().includes(cari.toLowerCase()) && 
    (kategori === 'all' || item.jenis === kategori)
  ) || []

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* HEADER UTAMA */}
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-600 tracking-wider">GROW A GARDEN 2 🐾</h1>
        <p className="text-lg mt-2">SAHRUL STORE — Pantau {akunList.length} Akun Redfinger</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* SISI KANAN: DAFTAR AKUN & RINGKASAN */}
        <aside className="w-full lg:w-64 order-2 lg:order-1">
          <div className="bg-white rounded-xl p-4 border-2 border-yellow-400 mb-4">
            <h3 className="font-bold text-lg mb-3">🐱 Accounts & Sheckles List</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {akunList.map(akun => (
                <div key={akun.id} onClick={() => setAkunPilih(akun)}
                  className={`p-2 rounded-lg cursor-pointer flex justify-between items-center ${
                    akunPilih?.id === akun.id ? 'bg-yellow-200 border border-yellow-500' : 'hover:bg-yellow-100'
                  }`}>
                  <span className="text-sm">{akun.username}</span>
                  <span className="text-xs font-bold">💰 {akun.sheckles || 0}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* SISI TENGAH: ISI TAS */}
        <main className="flex-1 order-1 lg:order-2">
          <div className="bg-white rounded-xl p-4 border-2 border-yellow-400 mb-4">
            <h2 className="text-2xl font-bold mb-4">🐾 BACKPACK — {akunPilih?.username || 'Pilih Akun Dulu'}</h2>
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <input type="text" placeholder="Cari barang di tas..." value={cari}
                onChange={e=>setCari(e.target.value)}
                className="flex-1 p-3 rounded-lg border-2 border-yellow-300 bg-yellow-50" />
              <select value={kategori} onChange={e=>setKategori(e.target.value)}
                className="p-3 rounded-lg border-2 border-yellow-300 bg-yellow-50">
                <option value="all">Semua Kategori</option>
                <option value="seed">🌱 Benih</option>
                <option value="tool">🛠️ Alat</option>
                <option value="pet">🐾 Hewan</option>
                <option value="other">📦 Lainnya</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {barangFilter.length === 0 ? (
                <p className="col-span-full text-center text-gray-500 py-10">Tidak ada barang di tas</p>
              ) : barangFilter.map((item, i) => (
                <div key={i} className="card-item">
                  <div className="text-3xl text-center mb-2">{item.icon || '📦'}</div>
                  <h4 className="font-bold text-center">{item.nama}</h4>
                  <p className="text-center text-sm text-gray-600">Jumlah: {item.jumlah}</p>
                  {item.langka && <p className="text-center text-xs text-yellow-600 font-bold">⭐ Langka</p>}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

