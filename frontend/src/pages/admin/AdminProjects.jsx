import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, Pencil, Trash2, Eye, Loader2, FolderKanban, DollarSign, Calendar, User, BarChart3 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import api from "../../utils/axios"

import CreateProjectModal from "./projects/CreateProjectModal"
import EditProjectDrawer from "./projects/EditProjectDrawer"
import DeleteProjectDialog from "./projects/DeleteProjectDialog"

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [clients, setClients] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedProject, setSelectedProject] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    fetchProjects()
    fetchClients()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [search, statusFilter, projects])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const { data } = await api.get("/admin/projects")
      setProjects(data.data || [])
    } catch (err) {
      console.error("Projects error:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchClients = async () => {
    try {
      const { data } = await api.get("/admin/clients")
      setClients(data.data || [])
    } catch (err) {
      console.error("Clients error:", err)
    }
  }

  const filterProjects = () => {
    let result = [...projects]
    if (search) {
      result = result.filter((p) =>
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.client?.name?.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter)
    }
    setFiltered(result)
  }

  const handleDelete = async () => {
    await api.delete(`/admin/projects/${selectedProject._id}`)
    setShowDelete(false)
    fetchProjects()
  }

  const handleApprove = async (projectId) => {
    try {
      await api.put(`/admin/projects/${projectId}/approve`)
      fetchProjects()
    } catch (error) {
      console.error('Approval failed:', error)
    }
  }

  const handleReject = async (projectId) => {
    await api.put(`/admin/projects/${projectId}`, { status: 'cancelled' })
    fetchProjects()
  }

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === "in_progress").length,
    pending: projects.filter(p => p.status === "pending").length,
    totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 text-red-600 mx-auto mb-4" />
          <p className="text-gray-400">Syncing projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Projects</h2>
          <p className="text-sm text-gray-400">Manage client deliverables and budgets</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreate(true)}
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-white transition shadow-lg shadow-red-900/20"
        >
          <Plus size={18} />
          New Project
        </motion.button>
      </div>

      {/* STATS - Scrollable on mobile, grid on desktop */}
      <div className="flex overflow-x-auto pb-2 gap-4 md:grid md:grid-cols-4 no-scrollbar">
        {[
          { label: "Total", val: stats.total, color: "text-white" },
          { label: "Active", val: stats.active, color: "text-green-400" },
          { label: "Pending", val: stats.pending, color: "text-yellow-400" },
          { label: "Budget", val: `$${(stats.totalBudget / 1000).toFixed(1)}k`, color: "text-purple-400" }
        ].map((s, i) => (
          <div key={i} className="min-w-[140px] flex-1 bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:border-red-600 outline-none transition"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-red-600 outline-none cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[2%] text-gray-400 font-medium">
              <th className="px-6 py-4">Project</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Budget</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((project) => (
              <tr key={project._id} className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="px-6 py-4">
                  <p className="font-bold text-white">{project.title}</p>
                  <p className="text-[10px] text-gray-500 uppercase mt-1">Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'None'}</p>
                </td>
                <td className="px-6 py-4 text-gray-400">{project.client?.name || project.clientName || "—"}</td>
                <td className="px-6 py-4 font-mono text-white">${(project.budget || 0).toLocaleString()}</td>
                <td className="px-6 py-4"><StatusBadge status={project.status} /></td>
                <td className="px-6 py-4 text-right">
                  <ActionButtons 
                    project={project} 
                    onApprove={handleApprove} 
                    onReject={handleReject} 
                    onEdit={() => { setSelectedProject(project); setShowEdit(true); }}
                    onDelete={() => { setSelectedProject(project); setShowDelete(true); }}
                    navigate={navigate}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden space-y-4">
        {filtered.map((project) => (
          <div key={project._id} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-white text-lg leading-tight">{project.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-gray-400 text-xs">
                  <User size={12} /> {project.client?.name || "No Client"}
                </div>
              </div>
              <StatusBadge status={project.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/5">
              <div>
                <p className="text-[10px] uppercase text-gray-500 font-bold mb-1">Budget</p>
                <div className="flex items-center gap-1.5 text-white font-mono text-sm">
                  <DollarSign size={14} className="text-green-500" />
                  {(project.budget || 0).toLocaleString()}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase text-gray-500 font-bold mb-1">Deadline</p>
                <div className="flex items-center gap-1.5 text-white text-sm">
                  <Calendar size={14} className="text-red-500" />
                  {project.deadline ? new Date(project.deadline).toLocaleDateString() : "N/A"}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex-1 mr-4">
                <ProgressBar value={project.progress || 0} />
              </div>
              <ActionButtons 
                project={project} 
                onApprove={handleApprove} 
                onReject={handleReject} 
                onEdit={() => { setSelectedProject(project); setShowEdit(true); }}
                onDelete={() => { setSelectedProject(project); setShowDelete(true); }}
                navigate={navigate}
              />
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <FolderKanban className="mx-auto text-gray-600 mb-4" size={48} />
          <p className="text-gray-400">No projects found matching your criteria.</p>
        </div>
      )}

      {/* MODALS */}
      <CreateProjectModal open={showCreate} onClose={() => setShowCreate(false)} clients={clients} refresh={fetchProjects} />
      <EditProjectDrawer open={showEdit} onClose={() => setShowEdit(false)} project={selectedProject} clients={clients} refresh={fetchProjects} />
      <DeleteProjectDialog open={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} />
    </div>
  )
}

function ActionButtons({ project, onApprove, onReject, onEdit, onDelete, navigate }) {
  if (project.status === 'pending') {
    return (
      <div className="flex gap-2">
        <button onClick={() => onApprove(project._id)} className="flex-1 md:flex-none py-2 px-4 bg-green-600/20 text-green-400 rounded-lg text-xs font-bold hover:bg-green-600/30 transition">Approve</button>
        <button onClick={() => onReject(project._id)} className="flex-1 md:flex-none py-2 px-4 bg-red-600/20 text-red-400 rounded-lg text-xs font-bold hover:bg-red-600/30 transition">Reject</button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <button onClick={() => navigate(`/admin/projects/${project._id}`)} className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition"><Eye size={16} /></button>
      <button onClick={onEdit} className="p-2.5 bg-white/5 hover:bg-amber-600/20 text-gray-300 hover:text-amber-400 rounded-xl transition"><Pencil size={16} /></button>
      <button onClick={onDelete} className="p-2.5 bg-white/5 hover:bg-red-600/20 text-gray-300 hover:text-red-400 rounded-xl transition"><Trash2 size={16} /></button>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    in_progress: "bg-green-600/10 text-green-400 border-green-600/20",
    approved: "bg-emerald-600/10 text-emerald-400 border-emerald-600/20",
    completed: "bg-blue-600/10 text-blue-400 border-blue-600/20",
    pending: "bg-yellow-600/10 text-yellow-400 border-yellow-600/20"
  }
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${styles[status] || "bg-white/5 text-gray-400"}`}>
      {status?.replace('_', ' ')}
    </span>
  )
}

function ProgressBar({ value }) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1 uppercase">
        <span>Progress</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
        <div 
          className="bg-red-600 h-full rounded-full transition-all duration-500" 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  )
}