import { Outlet, useLocation, NavLink as RouterNavLink } from "react-router-dom"
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

  const NavLink = ({ icon: Icon, label, href }) => (
    <RouterNavLink
      to={href}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
          isActive
            ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
            : "text-gray-300 hover:bg-white/10 hover:text-white"
        }`
      }
    >
      <Icon size={20} />
      {!collapsed && <span>{label}</span>}
    </RouterNavLink>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1220] text-white flex">
      
      {/* Sidebar */}
      <aside className={`transition-all duration-300 ${
        collapsed ? "w-[80px]" : "w-[260px]"
      } bg-white/5 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col fixed left-0 top-0 h-screen z-40`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
          {!collapsed && <h2 className="text-xl font-bold tracking-wide text-red-500">RobinK</h2>}
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
            <p className="text-xs text-gray-400 uppercase tracking-wide">Welcome,</p>
            <p className="font-semibold truncate text-white">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
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
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-all"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 flex-1 ${collapsed ? "ml-[80px]" : "ml-[260px]"}`}>
        <div className="p-8 min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  )
}