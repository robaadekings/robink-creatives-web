 import { Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default  function ClientLayout() {
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex">
      <aside className="w-64 bg-black/40 p-6 space-y-6">
        <h2 className="text-xl font-bold">Client Portal</h2>
        <a href="/client/dashboard" className="block hover:text-yellow-400">Dashboard</a>
        <button onClick={logout} className="text-red-500">Logout</button>
      </aside>

      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  )
}