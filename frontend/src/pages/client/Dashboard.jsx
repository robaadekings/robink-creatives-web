import { useEffect, useState } from "react"
import { Loader2, TrendingUp, CheckCircle, AlertCircle, DollarSign, ArrowRight } from "lucide-react"
import api from "../../utils/axios"

export default function ClientDashboard() {
  const [stats, setStats] = useState({
    activeProjects: 0,
    completedProjects: 0,
    pendingInvoices: 0,
    totalPaid: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const res = await api.get("/client/dashboard")
        
        console.log("Dashboard Raw Response:", res.data)
        const rawData = res.data.data || res.data

        setStats({
          activeProjects: rawData.activeProjects ?? rawData.active_projects ?? 0,
          completedProjects: rawData.completedProjects ?? rawData.completed_projects ?? 0,
          pendingInvoices: rawData.pendingInvoices ?? rawData.pending_invoices ?? 0,
          totalPaid: rawData.totalPaid ?? rawData.total_paid ?? 0
        })

        setError("")
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard stats")
        console.error("Dashboard error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-red-500" size={32} />
      </div>
    )

  if (error)
    return (
      <div className="mx-4 mt-6 bg-red-500/20 border border-red-500/40 text-red-200 px-6 py-4 rounded-xl flex items-center gap-3">
        <AlertCircle className="flex-shrink-0" size={20} />
        <span className="text-sm md:text-base">{error}</span>
      </div>
    )

  return (
    <div className="space-y-6 md:space-y-8 px-4 sm:px-6 lg:px-0 pb-10">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome back!</h1>
        <p className="text-gray-400 mt-1 md:mt-2 text-sm md:text-base">Here is your project overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card
          title="Active Projects"
          value={stats.activeProjects}
          icon={TrendingUp}
          color="from-blue-600 to-blue-700"
        />
        <Card
          title="Completed"
          value={stats.completedProjects}
          icon={CheckCircle}
          color="from-green-600 to-green-700"
        />
        <Card
          title="Pending Invoices"
          value={stats.pendingInvoices}
          icon={AlertCircle}
          color="from-yellow-600 to-yellow-700"
        />
        <Card
          title="Total Paid"
          value={`$${Number(stats.totalPaid).toLocaleString()}`}
          icon={DollarSign}
          color="from-red-600 to-red-700"
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-8 md:mt-12">
        <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActionLink
            href="/client/projects"
            title="View Projects"
            description="Check your project status"
            icon={TrendingUp}
          />
          <ActionLink
            href="/client/invoices"
            title="View Invoices"
            description="Manage your billing and payments"
            icon={DollarSign}
          />
        </div>
      </div>
    </div>
  )
}

function Card({ title, value, icon: Icon, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} p-5 md:p-6 rounded-2xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]`}>
      <div className="flex items-start justify-between">
        <div className="max-w-[80%]">
          <p className="text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl md:text-3xl font-bold mt-2 text-white truncate">{value}</h3>
        </div>
        <div className="bg-white/20 p-2 rounded-lg">
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </div>
  )
}

function ActionLink({ href, title, description, icon: Icon }) {
  return (
    <a
      href={href}
      className="bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.08] p-5 rounded-xl transition-all flex items-center justify-between group active:bg-white/10"
    >
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex bg-white/5 p-3 rounded-lg group-hover:bg-white/10 transition">
          <Icon size={24} className="text-gray-400 group-hover:text-white" />
        </div>
        <div>
          <p className="font-semibold text-white text-base md:text-lg">{title}</p>
          <p className="text-sm text-gray-400 line-clamp-1">{description}</p>
        </div>
      </div>
      <ArrowRight size={20} className="text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
    </a>
  )
}