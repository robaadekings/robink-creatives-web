import { useState } from "react"
import { Outlet } from "react-router-dom"
import AdminSidebar from "./AdminSidebar"
import AdminTopbar from "./AdminTopbar"

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1220] text-white">

      <AdminSidebar collapsed={collapsed} />

      <div
        className={`transition-all duration-300 ${
          collapsed ? "ml-[80px]" : "ml-[260px]"
        }`}
      >
        <AdminTopbar toggleSidebar={toggleSidebar} />

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}