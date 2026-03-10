import { useState, useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import AdminSidebar from "./AdminSidebar"
import AdminTopbar from "./AdminTopbar"

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()

  // Close sidebar automatically when navigating on mobile
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1220] text-white flex">
      
      {/* Sidebar - Positioned via layout props */}
      <AdminSidebar 
        isMobileOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <AdminTopbar 
          toggleSidebar={toggleSidebar} 
          isMobileOpen={isSidebarOpen} 
        />

        <main className="p-4 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}