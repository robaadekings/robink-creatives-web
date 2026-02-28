import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  FileText,
  Receipt,
  MessageSquare,
  FolderOpen
} from "lucide-react"

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Projects", path: "/admin/projects", icon: FolderKanban },
  { name: "Clients", path: "/admin/clients", icon: Users },
  { name: "Invoices", path: "/admin/invoices", icon: Receipt },
  { name: "Quotes", path: "/admin/quotes", icon: FileText },
  { name: "Files", path: "/admin/files", icon: FolderOpen },
  { name: "Messages", path: "/admin/messages", icon: MessageSquare }
]

export default function AdminSidebar({ collapsed }) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3 }}
      className="h-screen bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col fixed left-0 top-0 z-40"
    >
      <div className="p-6 text-xl font-bold tracking-wide text-white">
        {collapsed ? "RC" : "Robink Admin"}
      </div>

      <nav className="flex-1 space-y-2 px-3">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${
                  isActive
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          )
        })}
      </nav>
    </motion.aside>
  )
}