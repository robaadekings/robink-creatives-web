import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  DollarSign,
  FolderKanban,
  Users,
  Receipt
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"
import api from "../../utils/axios"

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [chartData, setChartData] = useState([])
  const [recentInvoices, setRecentInvoices] = useState([])

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get("/admin/dashboard")

      setStats(data.stats)
      setChartData(data.revenueChart)
      setRecentInvoices(data.recentInvoices)

    } catch (error) {
      console.error("Dashboard error:", error)
    }
  }

  if (!stats) {
    return <div className="text-gray-400">Loading dashboard...</div>
  }

  return (
    <div className="space-y-8">

      {/* ================= STATS CARDS ================= */}
      <div className="grid md:grid-cols-4 gap-6">

        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue}`}
          icon={DollarSign}
        />

        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={FolderKanban}
        />

        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          icon={Users}
        />

        <StatCard
          title="Pending Invoices"
          value={stats.pendingInvoices}
          icon={Receipt}
        />

      </div>

      {/* ================= REVENUE CHART ================= */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold mb-6">Revenue Overview</h3>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#ef4444"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ================= RECENT INVOICES ================= */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold mb-6">Recent Invoices</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-white/10">
                <th className="py-3">Invoice</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentInvoices.map((invoice) => (
                <tr
                  key={invoice._id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="py-3">{invoice.invoiceNumber}</td>
                  <td>{invoice.clientName}</td>
                  <td>${invoice.amount}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        invoice.status === "paid"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </motion.div>

    </div>
  )
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center justify-between"
    >
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h2 className="text-2xl font-bold mt-1">{value}</h2>
      </div>

      <div className="bg-red-600/20 p-3 rounded-lg">
        <Icon className="text-red-500" size={22} />
      </div>
    </motion.div>
  )
}