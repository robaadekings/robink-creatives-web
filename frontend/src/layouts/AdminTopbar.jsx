import { useState, useRef, useEffect } from "react"
import { Menu, LogOut, Bell, User, X } from "lucide-react"
import { useAuth } from "../context/AuthContext"

export default function AdminTopbar({ toggleSidebar, isMobileOpen }) {
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notifications] = useState(5)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="h-16 bg-white/5 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      
      {/* Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className="p-2 -ml-2 text-gray-400 hover:text-white transition-all bg-white/5 rounded-lg lg:hidden"
      >
        {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Spacer for desktop since toggle is hidden */}
      <div className="hidden lg:block w-6" />

      <div className="flex items-center gap-3 md:gap-6">
        {/* Notification Bell */}
        <div className="relative group">
          <button className="relative p-2 text-gray-400 hover:text-white transition">
            <Bell size={20} />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold border-2 border-[#0f172a]">
                {notifications > 9 ? "9+" : notifications}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          <div className="absolute right-[-70px] md:right-0 top-full mt-2 w-[calc(100vw-2rem)] md:w-80 bg-[#1e293b] border border-white/10 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/5">
              <p className="text-sm font-semibold text-white">Notifications</p>
            </div>
            <div className="max-h-64 overflow-y-auto p-2">
              <div className="text-sm border-l-2 border-red-600 pl-3 py-2 hover:bg-white/5 rounded transition cursor-pointer">
                <p className="text-white font-medium">New Invoice</p>
                <p className="text-xs text-gray-400">5 minutes ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="hidden sm:block text-right">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Welcome</p>
          <p className="text-white font-medium text-sm truncate max-w-[120px]">{user?.name}</p>
        </div>

        {/* User Menu Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center text-white"
          >
            <User size={18} />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#111827] border border-white/10 rounded-lg shadow-2xl z-50 py-1">
              <div className="p-3 border-b border-white/5 sm:hidden">
                <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
                <p className="text-[10px] text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  logout()
                  setShowUserMenu(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-all text-sm"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}