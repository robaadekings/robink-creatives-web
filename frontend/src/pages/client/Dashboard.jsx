import { useEffect, useState } from "react"
import api from "../../utils/axios"

export default function ClientDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get("/client/dashboard").then(res => setStats(res.data))
  }, [])

  if (!stats) return <div>Loading...</div>

  return (
    <div className="grid md:grid-cols-4 gap-6">

      <Card title="Active Projects" value={stats.activeProjects} />
      <Card title="Completed" value={stats.completedProjects} />
      <Card title="Pending Invoices" value={stats.pendingInvoices} />
      <Card title="Total Paid" value={`$${stats.totalPaid}`} />

    </div>
  )
}

function Card({ title, value }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  )
}