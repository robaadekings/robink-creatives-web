import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  DollarSign,
  FolderKanban,
  Users,
  Quote,
  Package,
  Image as ImageIcon,
  AlertCircle,
  Plus,
  Upload,
  X,
  Loader2,
  LayoutDashboard,
  Trash2,
  ExternalLink,
  Star,
  Eye,
  EyeOff
} from "lucide-react"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell
} from "recharts"
import api from "../../utils/axios"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState(null)
  const [chartData, setChartData] = useState([])
  const [recentInvoices, setRecentInvoices] = useState([])
  const [invoiceStatusChart, setInvoiceStatusChart] = useState([])
  const [loading, setLoading] = useState(true)

  // Portfolio Specific State
  const [projects, setProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previews, setPreviews] = useState([])
  const [portfolioForm, setPortfolioForm] = useState({
    title: "",
    category: "Web_development",
    description: "",
    tags: "",
    projectUrl: "",
    githubUrl: "",
    featured: false,
    images: []
  })

  useEffect(() => {
    fetchDashboard()
    fetchProjects()
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

      const chartDataRaw = invoiceChartResponse.data.data
      setInvoiceStatusChart([
        { name: "Pending", value: chartDataRaw.pending, color: "#F59E0B" },
        { name: "Paid", value: chartDataRaw.paid, color: "#10B981" },
        { name: "Overdue", value: chartDataRaw.overdue, color: "#EF4444" }
      ])
    } catch (error) {
      console.error("Dashboard error:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true)
      const { data } = await api.get("/portfolios")
      setProjects(data.data || [])
    } catch (err) {
      console.error("Failed to fetch projects", err)
    } finally {
      setLoadingProjects(false)
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setPortfolioForm(prev => ({ ...prev, images: [...prev.images, ...files] }))
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews(prev => [...prev, ...newPreviews])
  }

  const handlePortfolioSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    try {
      const data = new FormData()
      Object.keys(portfolioForm).forEach(key => {
        if (key === 'images') {
          portfolioForm.images.forEach(file => data.append('images', file))
        } else if (key === 'tags') {
          const tagsArray = portfolioForm.tags.split(',').map(t => t.trim())
          tagsArray.forEach(tag => data.append('tags[]', tag))
        } else {
          data.append(key, portfolioForm[key])
        }
      })

      await api.post("/portfolios", data)
      alert("Project published successfully!")
      setPortfolioForm({ title: "", category: "Web_development", description: "", tags: "", projectUrl: "", githubUrl: "", featured: false, images: [] })
      setPreviews([])
      fetchProjects() 
    } catch (err) {
      alert("Upload failed. Check console.")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return
    try {
      await api.delete(`/portfolios/${id}`)
      setProjects(projects.filter(p => p._id !== id))
    } catch (err) {
      alert("Delete failed")
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
    <div className="space-y-6 md:space-y-8 px-4 md:px-0 pb-10">
      {/* ================= TAB NAVIGATION ================= */}
      <div className="flex gap-2 md:gap-4 border-b border-white/10 pb-1 overflow-x-auto no-scrollbar scrollbar-hide">
        <button 
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 md:px-6 py-3 transition-all font-medium whitespace-nowrap ${activeTab === 'overview' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}
        >
          <LayoutDashboard size={18} /> Overview
        </button>
        <button 
          onClick={() => setActiveTab("portfolio")}
          className={`flex items-center gap-2 px-4 md:px-6 py-3 transition-all font-medium whitespace-nowrap ${activeTab === 'portfolio' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}
        >
          <Plus size={18} /> Portfolio Management
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" ? (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 md:space-y-8"
          >
            {/* STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <StatCard title="Total Revenue" value={`$${(stats.revenueTotal || 0).toLocaleString()}`} icon={DollarSign} accent="from-red-600 to-red-700" />
              <StatCard title="Active Projects" value={stats.projectsActive || 0} icon={FolderKanban} accent="from-blue-600 to-blue-700" />
              <StatCard title="Pending Invoices" value={stats.invoicesPending || 0} icon={AlertCircle} accent="from-yellow-600 to-yellow-700" />
              <StatCard title="Open Quotes" value={stats.quotesOpen || 0} icon={Quote} accent="from-purple-600 to-purple-700" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <StatCard title="Total Clients" value="—" icon={Users} accent="from-green-600 to-green-700" loading />
              <StatCard title="Services" value={stats.servicesCount || 0} icon={Package} accent="from-indigo-600 to-indigo-700" />
              <StatCard title="Portfolio Items" value={stats.portfolioCount || 0} icon={ImageIcon} accent="from-pink-600 to-pink-700" />
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold mb-6">Revenue Trend</h3>
                <div className="h-[250px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis dataKey="month" stroke="#aaa" style={{ fontSize: "10px" }} />
                      <YAxis stroke="#aaa" style={{ fontSize: "10px" }} />
                      <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }} formatter={(value) => `$${value.toLocaleString()}`} />
                      <Line type="monotone" dataKey="total" stroke="#DC2626" strokeWidth={3} dot={{ fill: "#DC2626", r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold mb-6">Invoice Status</h3>
                <div className="h-[250px] md:h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={invoiceStatusChart} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius="80%" fill="#8884d8" dataKey="value">
                        {invoiceStatusChart.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* RECENT INVOICES */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold mb-6">Recent Invoices</h3>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="inline-block min-w-full align-middle px-4 md:px-0">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-gray-400 border-b border-white/10">
                        <th className="py-3 px-4 whitespace-nowrap">Invoice #</th>
                        <th className="py-3 px-4 whitespace-nowrap">Client</th>
                        <th className="py-3 px-4 whitespace-nowrap">Amount</th>
                        <th className="py-3 px-4 whitespace-nowrap">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentInvoices.map((invoice) => (
                        <tr key={invoice._id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="py-3 px-4 font-mono text-red-400 whitespace-nowrap">{invoice.invoiceNumber}</td>
                          <td className="py-3 px-4 whitespace-nowrap">{invoice.clientName}</td>
                          <td className="py-3 px-4 font-semibold whitespace-nowrap">${(invoice.total || 0).toLocaleString()}</td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold ${invoice.status === "paid" ? "bg-green-500/20 text-green-400" : invoice.status === "pending" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>
                              {invoice.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="portfolio"
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 md:space-y-8"
          >
            {/* PORTFOLIO UPLOAD FORM */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold mb-6 bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">Upload New Project</h3>
              <form onSubmit={handlePortfolioSubmit} className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                  {previews.map((url, i) => (
                    <div key={i} className="relative h-24 md:h-28 rounded-xl overflow-hidden group border border-white/10">
                      <img src={url} className="w-full h-full object-cover" alt="" />
                      <button type="button" onClick={() => {
                        setPreviews(previews.filter((_, idx) => idx !== i))
                        setPortfolioForm({...portfolioForm, images: portfolioForm.images.filter((_, idx) => idx !== i)})
                      }} className="absolute top-1 right-1 p-1 bg-red-600 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition"><X size={12} /></button>
                    </div>
                  ))}
                  <label className="h-24 md:h-28 flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-red-500/50 hover:bg-white/5 transition">
                    <Upload className="text-gray-400" size={20} />
                    <span className="text-[10px] mt-2 text-gray-400 uppercase font-bold text-center px-2">Add Images</span>
                    <input type="file" multiple onChange={handleFileChange} className="hidden" accept="image/*" />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <input type="text" placeholder="Project Title" required className="bg-white/5 border border-white/10 p-3 rounded-xl focus:border-red-500 outline-none w-full text-sm md:text-base" value={portfolioForm.title} onChange={e => setPortfolioForm({...portfolioForm, title: e.target.value})} />
                  <select className="bg-[#1a1f2e] border border-white/10 p-3 rounded-xl focus:border-red-500 outline-none w-full text-sm md:text-base" value={portfolioForm.category} onChange={e => setPortfolioForm({...portfolioForm, category: e.target.value})}>
                    <option value="Web_development">Web Development</option>
                    <option value="Graphic_Design">Graphic Design</option>
                    <option value="branding">Branding</option>
                    <option value="ui-ux">UI/UX</option>
                  </select>
                </div>

                <textarea placeholder="Project Description" required className="w-full bg-white/5 border border-white/10 p-3 rounded-xl h-32 focus:border-red-500 outline-none text-sm md:text-base" value={portfolioForm.description} onChange={e => setPortfolioForm({...portfolioForm, description: e.target.value})} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <input type="url" placeholder="Live Project URL" className="bg-white/5 border border-white/10 p-3 rounded-xl focus:border-red-500 outline-none w-full text-sm" value={portfolioForm.projectUrl} onChange={e => setPortfolioForm({...portfolioForm, projectUrl: e.target.value})} />
                  <input type="text" placeholder="Tags (React, Node, etc.)" className="bg-white/5 border border-white/10 p-3 rounded-xl focus:border-red-500 outline-none w-full text-sm" value={portfolioForm.tags} onChange={e => setPortfolioForm({...portfolioForm, tags: e.target.value})} />
                </div>

                <div className="flex items-center gap-3">
                  <input type="checkbox" id="feat" className="w-5 h-5 accent-red-600" checked={portfolioForm.featured} onChange={e => setPortfolioForm({...portfolioForm, featured: e.target.checked})} />
                  <label htmlFor="feat" className="text-gray-400 text-sm cursor-pointer select-none">Mark as Featured Project</label>
                </div>

                <button type="submit" disabled={uploading} className="w-full bg-gradient-to-r from-red-600 to-red-700 py-4 rounded-xl font-bold hover:brightness-110 transition disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-red-600/20">
                  {uploading ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
                  {uploading ? "Publishing..." : "Publish Project"}
                </button>
              </form>
            </div>

            {/* MANAGE PROJECTS TABLE */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold mb-6">Existing Projects</h3>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="inline-block min-w-full align-middle px-4 md:px-0">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-gray-400 border-b border-white/10 uppercase text-[10px] tracking-wider">
                        <th className="py-4 px-4">Project</th>
                        <th className="py-4 px-4">Category</th>
                        <th className="py-4 px-4">Status</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project) => (
                        <tr key={project._id} className="border-b border-white/5 hover:bg-white/[2%] transition">
                          <td className="py-4 px-4 flex items-center gap-3 min-w-[200px]">
                            <img src={project.images?.[0]} className="w-10 h-7 md:w-12 md:h-8 object-cover rounded border border-white/10 flex-shrink-0" alt="" />
                            <span className="font-medium truncate">{project.title}</span>
                          </td>
                          <td className="py-4 px-4 text-gray-400 text-xs whitespace-nowrap">{project.category}</td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              {project.featured && <Star size={14} className="text-yellow-500 fill-yellow-500" />}
                              {project.active ? <Eye size={14} className="text-green-500" /> : <EyeOff size={14} className="text-gray-500" />}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <div className="flex justify-end gap-1 md:gap-2">
                              <button onClick={() => handleDelete(project._id)} className="p-2 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded-lg transition"><Trash2 size={16} /></button>
                              {project.projectUrl && <a href={project.projectUrl} target="_blank" rel="noreferrer" className="p-2 hover:bg-white/10 text-gray-500 hover:text-white rounded-lg transition"><ExternalLink size={16} /></a>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, accent, loading }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 md:p-6 overflow-hidden group">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-10 transition duration-300`}></div>
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-xs md:text-sm font-medium">{title}</p>
          <h2 className="text-2xl md:text-3xl font-bold mt-2 text-white">{loading ? <span className="text-gray-500 text-base">Loading...</span> : value}</h2>
        </div>
        <div className={`bg-gradient-to-br ${accent} bg-opacity-20 p-2 md:p-3 rounded-lg`}>
          <Icon className="text-white opacity-80" size={20} />
        </div>
      </div>
    </motion.div>
  )
}