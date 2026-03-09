import { Outlet, useLocation, NavLink as RouterNavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Download,
  LogOut,
  Menu,
  X,
  Globe,
  Receipt
} from "lucide-react"
import logo from "../assets/robink-logo.png"
import { useState, useEffect } from "react"

export default function ClientLayout() {
  const { logout, user } = useAuth()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [location])

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  const NavLink = ({ icon: Icon, label, href }) => (
    <RouterNavLink
      to={href}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg scale-[1.02]"
            : "text-gray-300 hover:bg-white/10 hover:text-white"
        }`
      }
    >
      <Icon size={20} className="shrink-0" />
      <span className={`${collapsed ? "hidden lg:hidden" : "block"}`}>{label}</span>
    </RouterNavLink>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1220] text-white flex overflow-x-hidden">
      
      {/* 1. Mobile Overlay (Dimmer) */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 2. Sidebar (Desktop Fixed & Mobile Drawer) */}
      <aside className={`
        fixed left-0 top-0 h-screen z-[70] transition-all duration-300 border-r border-white/10 bg-[#0f172a] lg:bg-white/5 backdrop-blur-xl flex flex-col p-6
        ${isMobileOpen ? "translate-x-0 w-[280px]" : "-translate-x-full lg:translate-x-0"}
        ${collapsed ? "lg:w-[85px]" : "lg:w-[260px]"}
      `}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center gap-2 overflow-hidden">
            <img 
              src={logo} 
              alt="Robink Logo" 
              className="w-8 h-8 shrink-0" 
              style={{ filter: "drop-shadow(0 0 5px rgba(220, 38, 38, 0.5))" }}
            />
            <h2 className={`text-xl font-bold tracking-wide text-red-500 transition-opacity ${collapsed ? "lg:opacity-0" : "opacity-100"}`}>
              Robink
            </h2>
          </div>
          
          {/* Toggle Button - Desktop */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-2 hover:bg-white/10 rounded-lg transition text-gray-400"
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>

          {/* Close Button - Mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition text-gray-400"
          >
            <X size={28} />
          </button>
        </div>

        {/* User Info - Desktop Only */}
        <div className={`bg-white/5 border border-white/10 rounded-lg p-4 mb-8 transition-all ${collapsed ? "lg:opacity-0 lg:p-0 lg:h-0 overflow-hidden" : "opacity-100"}`}>
           <p className="text-xs text-gray-400 uppercase tracking-wide">Welcome,</p>
           <p className="font-semibold truncate text-white">{user?.name}</p>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2 flex-1 overflow-y-auto no-scrollbar">
          <NavLink icon={LayoutDashboard} label="Dashboard" href="/client/dashboard" />
          <NavLink icon={FolderKanban} label="Projects" href="/client/projects" />
          <NavLink icon={Receipt} label="Quotes" href="/client/quotes" />
          <NavLink icon={FileText} label="Invoices" href="/client/invoices" />
          <NavLink icon={Download} label="Files" href="/client/files" />
        </nav>

        {/* Footer Actions */}
        <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all"
          >
            <Globe size={20} className="shrink-0" />
            <span className={`${collapsed ? "lg:hidden" : "block"}`}>Website</span>
          </a>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-all"
          >
            <LogOut size={20} className="shrink-0" />
            <span className={`${collapsed ? "lg:hidden" : "block"}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* 3. Main Body Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "lg:ml-[85px]" : "lg:ml-[260px]"}`}>
        
        {/* Mobile Top Header (Shiny Logo & Menu) */}
        <header className="lg:hidden fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-6 bg-[#0f172a]/95 border-b border-white/10 z-[50] backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="relative flex items-center">
            {/* Subtle glow behind logo */}
            <div className="absolute inset-0 bg-red-600/20 blur-xl rounded-full scale-125" />
            
            <img 
              src={logo} 
              alt="Robink Logo" 
              className="relative w-12 h-12 object-contain brightness-110 contrast-125"
              style={{
                filter: "drop-shadow(0 0 10px rgba(220, 38, 38, 0.6)) brightness(1.2)"
              }}
            />
          </div>
          
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-3 bg-white/5 rounded-xl hover:bg-white/10 border border-white/10 transition-all active:scale-90"
          >
            <Menu size={28} className="text-red-500" />
          </button>
        </header>

        {/* Content Outlet - Adjusted pt-24 for mobile view */}
        <main className="p-4 md:p-8 min-h-screen pt-24 lg:pt-8 max-w-[100vw]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}