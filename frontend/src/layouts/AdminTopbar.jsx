import { useState } from "react"
import { Menu, LogOut, Bell, User } from "lucide-react"
import { useAuth } from "../context/AuthContext"

export default function AdminTopbar({ toggleSidebar }) {
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notifications, setNotifications] = useState(5) // Placeholder count

  return (
    <header className="h-16 bg-white/5 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-30">
      
      <button
        onClick={toggleSidebar}
        className="text-gray-400 hover:text-white transition"
        title="Toggle sidebar"
      >
        <Menu size={22} />
      </button>

      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <div className="relative group">
          <button className="relative text-gray-400 hover:text-white transition">
            <Bell size={20} />
            {notifications > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {notifications > 9 ? "9+" : notifications}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <div className="p-4 border-b border-white/10">
              <p className="text-sm font-semibold text-white">Notifications</p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications > 0 ? (
                <div className="p-4 space-y-3">
                  <div className="text-sm border-l-2 border-red-600 pl-3 py-2 hover:bg-white/5 rounded transition cursor-pointer">
                    <p className="text-white font-medium">New Invoice</p>
                    <p className="text-xs text-gray-400">5 minutes ago</p>
                  </div>
                  <div className="text-sm border-l-2 border-blue-600 pl-3 py-2 hover:bg-white/5 rounded transition cursor-pointer">
                    <p className="text-white font-medium">New Project</p>
                    <p className="text-xs text-gray-400">12 minutes ago</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-gray-400">
                  No new notifications
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="text-right">
          <p className="text-sm text-gray-400">Welcome back</p>
          <p className="text-white font-medium text-sm">{user?.name}</p>
        </div>

        {/* User Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center text-white hover:from-red-700 hover:to-red-800 transition-all"
            title="User menu"
          >
            <User size={18} />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl z-50">
              <div className="p-3 border-b border-white/10">
                <p className="text-sm text-gray-400">Logged in as</p>
                <p className="text-white font-semibold text-sm truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  logout()
                  setShowUserMenu(false)
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-600/20 transition-all text-sm"
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