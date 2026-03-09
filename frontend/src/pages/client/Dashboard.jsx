import { useEffect, useState } from "react"
import { Loader2, TrendingUp, CheckCircle, AlertCircle, DollarSign } from "lucide-react"
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
        
        // DEBUG: Look at your browser console (F12) to see what is arriving
        console.log("Dashboard Raw Response:", res.data)

        const rawData = res.data.data || res.data

        // Defensive mapping: ensures values exist even if backend keys are slightly different
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
      <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-6 py-4 rounded-xl">
        <AlertCircle className="inline mr-2" size={20} />
        {error}
      </div>
    )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-gray-400 mt-2">Here's your project overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="/client/projects"
            className="bg-white/5 border border-white/10 hover:border-white/20 p-4 rounded-xl transition flex items-center justify-between group"
          >
            <div>
              <p className="font-semibold">View Projects</p>
              <p className="text-sm text-gray-400">Check your project status</p>
            </div>
            <TrendingUp size={24} className="text-gray-400 group-hover:text-white transition" />
          </a>
          <a
            href="/client/invoices"
            className="bg-white/5 border border-white/10 hover:border-white/20 p-4 rounded-xl transition flex items-center justify-between group"
          >
            <div>
              <p className="font-semibold">View Invoices</p>
              <p className="text-sm text-gray-400">Manage your billing</p>
            </div>
            <DollarSign size={24} className="text-gray-400 group-hover:text-white transition" />
          </a>
        </div>
      </div>
    </div>
  )
}

function Card({ title, value, icon: Icon, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-lg`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-2 text-white">{value}</h3>
        </div>
        <Icon size={24} className="text-white/40" />
      </div>
    </div>
  )
}