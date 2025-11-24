import { useNavigate } from 'react-router-dom'
import Button from '../components/atoms/Button'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D8E3F3] to-[#9DBBDD] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* 404 Icon */}
        <div className="mb-6">
          <div className="text-8xl font-bold bg-gradient-to-r from-[#4782BE] to-[#1D375B] bg-clip-text text-transparent">
            404
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-neutral-900 mb-3">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-neutral-600 mb-8">
          Maaf, halaman yang Anda cari tidak ada atau sedang dalam pengembangan.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto"
          >
            Kembali ke Beranda
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto bg-white border-2 border-[#4782BE] text-[#4782BE] hover:bg-[#D8E3F3]"
          >
            Kembali
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-neutral-200">
          <p className="text-sm text-neutral-500">
            Jika Anda yakin ini adalah kesalahan, silakan hubungi tim support kami.
          </p>
        </div>
      </div>
    </div>
  )
}
