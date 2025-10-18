import Button from '../components/atoms/Button'

export default function DashboardPage() {
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-[#4B0713] text-[#D8CCBC] flex items-center justify-center">
      <div className="bg-[#5C0C19] p-8 rounded-lg w-full max-w-xl">
        <h1 className="text-2xl font-semibold mb-2">Welcome{user ? `, ${user.email}` : ''}</h1>
        <p className="mb-6">You are logged in. This is a placeholder dashboard.</p>
        <Button variant="outline" onClick={logout}>Log out</Button>
      </div>
    </div>
  )
}


