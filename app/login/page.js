'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [pesan, setPesan] = useState('')
  const supabase = createClientComponentClient()
  const router = useRouter()

  async function masuk(e) {
    e.preventDefault()
    setPesan('Memproses...')
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
    if (error) setPesan('Salah: ' + error.message)
    else router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={masuk} className="w-full max-w-md bg-white p-6 rounded-2xl border-4 border-yellow-400">
        <h1 className="text-3xl font-bold text-center mb-6 text-yellow-600">🐾 GROW A GARDEN 2</h1>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}
          className="w-full p-3 mb-3 rounded-lg border-2 border-yellow-300 bg-yellow-50" required />
        <input type="password" placeholder="Kata Sandi" value={pass} onChange={e=>setPass(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg border-2 border-yellow-300 bg-yellow-50" required />
        <button type="submit" className="w-full bg-yellow-400 font-bold p-3 rounded-lg hover:bg-yellow-500">MASUK</button>
        {pesan && <p className="mt-3 text-center text-red-500 text-sm">{pesan}</p>}
      </form>
    </div>
  )
}

