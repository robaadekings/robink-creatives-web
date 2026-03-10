import { NavLink } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import logo from "../assets/robink-logo.png"
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  FileText,
  Receipt,
  Mail,
  LogOut,
  Globe,
  X
} from "lucide-react"

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Projects", path: "/admin/projects", icon: FolderKanban },
  { name: "Clients", path: "/admin/clients", icon: Users },
  { name: "Invoices", path: "/admin/invoices", icon: Receipt },
  { name: "Quotes", path: "/admin/quotes", icon: FileText },
  { name: "Messages", path: "/admin/messages", icon: Mail },
]

export default function AdminSidebar({ isMobileOpen, toggleSidebar }) {
  const { logout, user } = useAuth()
  const mobileWidth = 280

  return (
    <motion.aside
      initial={false}
      animate={{ 
        x: typeof window !== 'undefined' && window.innerWidth < 1024 
           ? (isMobileOpen ? 0 : -mobileWidth) 
           : 0 
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-[#111827]/95 backdrop-blur-xl border-r border-white/10 flex flex-col fixed left-0 top-0 z-50 lg:sticky lg:top-0 lg:translate-x-0 w-[280px]"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <img src={logo} alt="Robink Logo" className="w-8 h-8 shrink-0" />
          <span className="text-xl font-bold tracking-wide text-red-500 whitespace-nowrap">Admin Panel</span>
        </NavLink>
        
        {/* Close button - Mobile Only */}
        <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-white p-1">
          <X size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                  isActive
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={20} className="shrink-0" />
              <span className="text-sm whitespace-nowrap">{item.name}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-white/10 p-3">
        <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-3 min-h-[50px] flex flex-col justify-center">
          <p className="text-xs text-gray-400">Logged in as</p>
          <p className="text-sm font-semibold truncate text-white">{user?.name || "Admin"}</p>
        </div>

        <div className="space-y-1">
          <a href="/" target="_blank" rel="noopener" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-all">
            <Globe size={20} className="shrink-0" />
            <span className="text-sm">Website</span>
          </a>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-600/20 hover:text-red-400 transition-all"
          >
            <LogOut size={20} className="shrink-0" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </motion.aside>
  )
}