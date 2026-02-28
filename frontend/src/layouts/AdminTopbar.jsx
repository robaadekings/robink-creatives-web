import { Menu, LogOut } from "lucide-react"
import { useAuth } from "../../../context/AuthContext"

export default function AdminTopbar({ toggleSidebar }) {
  const { user, logout } = useAuth()

  return (
    <header className="h-16 bg-white/5 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6">
      
      <button
        onClick={toggleSidebar}
        className="text-gray-400 hover:text-white transition"
      >
        <Menu size={22} />
      </button>

      <div className="flex items-center gap-6">

        <div className="text-right">
          <p className="text-sm text-gray-400">Welcome back</p>
          <p className="text-white font-medium">{user?.name}</p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-red-400 hover:text-red-500 transition"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>
    </header>
  )
}