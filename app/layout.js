import './globals.css'
export const metadata = {
  title: 'Grow A Garden 2 — Monitor Sahrul',
  description: 'Pantau 200+ Akun & Tas Redfinger',
}
export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-yellow-50 font-sans">{children}</body>
    </html>
  )
}

