import { Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Download,
  LogOut,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"

export default function ClientLayout() {
  const { logout, user } = useAuth()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  const isActive = (path) => location.pathname.startsWith(path)

  const NavLink = ({ icon: Icon, label, href }) => (
    <a
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
        isActive(href)
          ? "bg-red-600 text-white"
          : "text-gray-300 hover:bg-white/5"
      }`}
    >
      <Icon size={20} />
      {!collapsed && <span>{label}</span>}
    </a>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1220] text-white flex">
      
      {/* Sidebar */}
      <aside className={`transition-all duration-300 ${
        collapsed ? "w-[80px]" : "w-[260px]"
      } bg-black/40 border-r border-white/10 p-6 flex flex-col`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {!collapsed && <h2 className="text-xl font-bold text-red-500">RobinK</h2>}
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* User Info */}
        {!collapsed && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-400">Welcome,</p>
            <p className="font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          <NavLink icon={LayoutDashboard} label="Dashboard" href="/client/dashboard" />
          <NavLink icon={FolderKanban} label="Projects" href="/client/projects" />
          <NavLink icon={FileText} label="Invoices" href="/client/invoices" />
          <NavLink icon={Download} label="Files" href="/client/files" />
        </nav>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-600/20 transition"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${collapsed ? "" : ""}`}>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}