import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  DollarSign,
  FolderKanban,
  Users,
  Receipt,
  Quote,
  Package,
  Image as ImageIcon,
  AlertCircle
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts"
import api from "../../utils/axios"

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [chartData, setChartData] = useState([])
  const [recentInvoices, setRecentInvoices] = useState([])
  const [invoiceStatusChart, setInvoiceStatusChart] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const [dashResponse, invoiceChartResponse] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/invoice-status-chart")
      ])

      setStats(dashResponse.data.stats)
      setChartData(dashResponse.data.revenueChart)
      setRecentInvoices(dashResponse.data.recentInvoices)

      // Format invoice status chart
      const chartData = invoiceChartResponse.data.data
      const pieData = [
        { name: "Pending", value: chartData.pending, color: "#F59E0B" },
        { name: "Paid", value: chartData.paid, color: "#10B981" },
        { name: "Overdue", value: chartData.overdue, color: "#EF4444" }
      ]
      setInvoiceStatusChart(pieData)

    } catch (error) {
      console.error("Dashboard error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-red-500/20 border border-red-500/40 text-red-400 p-4 rounded-lg">
        Failed to load dashboard data
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* ================= STATS CARDS ================= */}
      <div className="grid md:grid-cols-4 gap-6">

        <StatCard
          title="Total Revenue"
          value={`$${(stats.revenueTotal || 0).toLocaleString()}`}
          icon={DollarSign}
          accent="from-red-600 to-red-700"
        />

        <StatCard
          title="Active Projects"
          value={stats.projectsActive || 0}
          icon={FolderKanban}
          accent="from-blue-600 to-blue-700"
        />

        <StatCard
          title="Pending Invoices"
          value={stats.invoicesPending || 0}
          icon={AlertCircle}
          accent="from-yellow-600 to-yellow-700"
        />

        <StatCard
          title="Open Quotes"
          value={stats.quotesOpen || 0}
          icon={Quote}
          accent="from-purple-600 to-purple-700"
        />

      </div>

      {/* ================= SECONDARY STATS ================= */}
      <div className="grid md:grid-cols-3 gap-6">

        <StatCard
          title="Total Clients"
          value="—"
          icon={Users}
          accent="from-green-600 to-green-700"
          loading
        />

        <StatCard
          title="Services"
          value={stats.servicesCount || 0}
          icon={Package}
          accent="from-indigo-600 to-indigo-700"
        />

        <StatCard
          title="Portfolio Items"
          value={stats.portfolioCount || 0}
          icon={ImageIcon}
          accent="from-pink-600 to-pink-700"
        />

      </div>

      {/* ================= CHARTS SECTION ================= */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold mb-6">Revenue Trend</h3>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#aaa" style={{ fontSize: "12px" }} />
                <YAxis stroke="#aaa" style={{ fontSize: "12px" }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#DC2626"
                  strokeWidth={3}
                  dot={{ fill: "#DC2626", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Invoice Status Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold mb-6">Invoice Status</h3>

          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={invoiceStatusChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {invoiceStatusChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>

      {/* ================= RECENT INVOICES ================= */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold mb-6">Recent Invoices</h3>

        {recentInvoices.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No recent invoices
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-white/10">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>

              <tbody>
                {recentInvoices.map((invoice, idx) => (
                  <tr
                    key={invoice._id}
                    className={`border-b border-white/5 hover:bg-white/5 transition ${
                      idx % 2 === 0 ? "bg-white/[2%]" : ""
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-red-400">{invoice.invoiceNumber}</td>
                    <td className="py-3 px-4">{invoice.clientName}</td>
                    <td className="py-3 px-4 font-semibold">${(invoice.total || 0).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          invoice.status === "paid"
                            ? "bg-green-500/20 text-green-400"
                            : invoice.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {invoice.status?.charAt(0).toUpperCase() + invoice.status?.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </motion.div>

    </div>
  )
}

function StatCard({ title, value, icon: Icon, accent, loading }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden group"
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-10 transition duration-300`}></div>

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <h2 className="text-3xl font-bold mt-2 text-white">
            {loading ? (
              <span className="text-gray-500">Loading...</span>
            ) : (
              value
            )}
          </h2>
        </div>

        <div className={`bg-gradient-to-br ${accent} bg-opacity-20 p-3 rounded-lg`}>
          <Icon className="text-white opacity-80" size={24} />
        </div>
      </div>
    </motion.div>
  )
}