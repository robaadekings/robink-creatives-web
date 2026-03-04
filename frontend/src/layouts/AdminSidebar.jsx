import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  FileText,
  Receipt,
  Mail,
  Settings,
  LogOut,
  Menu
} from "lucide-react"

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Projects", path: "/admin/projects", icon: FolderKanban },
  { name: "Clients", path: "/admin/clients", icon: Users },
  { name: "Invoices", path: "/admin/invoices", icon: Receipt },
  { name: "Quotes", path: "/admin/quotes", icon: FileText },
  { name: "Messages", path: "/admin/messages", icon: Mail },
]

export default function AdminSidebar({ collapsed }) {
  const { logout, user } = useAuth()

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3 }}
      className="h-screen bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col fixed left-0 top-0 z-40"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-wide text-red-500">
          {collapsed ? "RC" : "Robink"}
        </h1>
        <p className="text-xs text-gray-400 mt-1">{collapsed ? "Admin" : "Admin Panel"}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              {!collapsed && <span className="text-sm">{item.name}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-white/10 p-3">
        {/* User Info */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-3">
          {!collapsed && (
            <>
              <p className="text-xs text-gray-400">Logged in as</p>
              <p className="text-sm font-semibold truncate">{user?.name}</p>
            </>
          )}
        </div>

        {/* Settings & Logout */}
        <div className="space-y-1">
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Settings size={20} />
            {!collapsed && <span className="text-sm">Settings</span>}
          </NavLink>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-600/20 hover:text-red-400 transition-all"
          >
            <LogOut size={20} />
            {!collapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  )
}