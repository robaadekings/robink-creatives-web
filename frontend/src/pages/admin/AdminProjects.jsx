import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Pencil, Trash2, Eye, Loader2, FolderKanban, AlertCircle } from "lucide-react"
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
      setFiltered(data.data || [])
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
        p.title?.toLowerCase().includes(search.toLowerCase())
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
    await api.put(`/admin/projects/${projectId}`, { status: 'in_progress' })
    fetchProjects()
  }

  const handleReject = async (projectId) => {
    await api.put(`/admin/projects/${projectId}`, { status: 'cancelled' })
    fetchProjects()
  }

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === "in_progress").length,
    completed: projects.filter(p => p.status === "completed").length,
    pending: projects.filter(p => p.status === "pending").length,
    totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-400">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Projects Management</h2>
          <p className="text-gray-400 mt-1">Create and manage all client projects</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreate(true)}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition"
        >
          <Plus size={20} />
          New Project
        </motion.button>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-5 gap-4">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/5 border border-white/10 rounded-xl p-4"
        >
          <p className="text-gray-400 text-sm">Total Projects</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-green-600/20 to-green-700/10 border border-green-600/30 rounded-xl p-4"
        >
          <p className="text-gray-400 text-sm">Active</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{stats.active}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-blue-600/20 to-blue-700/10 border border-blue-600/30 rounded-xl p-4"
        >
          <p className="text-gray-400 text-sm">Completed</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{stats.completed}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-yellow-600/20 to-yellow-700/10 border border-yellow-600/30 rounded-xl p-4"
        >
          <p className="text-gray-400 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{stats.pending}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-purple-600/20 to-purple-700/10 border border-purple-600/30 rounded-xl p-4"
        >
          <p className="text-gray-400 text-sm">Total Budget</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">${(stats.totalBudget / 1000).toFixed(1)}k</p>
        </motion.div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search projects by title or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-red-600 focus:outline-none transition placeholder-gray-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 focus:outline-none transition cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="in_progress">Active</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* TABLE */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
        >
          <FolderKanban className="mx-auto text-gray-500 mb-4" size={48} />
          <p className="text-gray-400">
            {search || statusFilter !== "all" ? "No projects match your filters" : "No projects yet"}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-gray-400 font-semibold">Project</th>
                  <th className="px-6 py-4 text-gray-400 font-semibold">Client</th>
                  <th className="px-6 py-4 text-gray-400 font-semibold">Budget</th>
                  <th className="px-6 py-4 text-gray-400 font-semibold">Progress</th>
                  <th className="px-6 py-4 text-gray-400 font-semibold">Status</th>
                  <th className="px-6 py-4 text-gray-400 font-semibold">Deadline</th>
                  <th className="px-6 py-4 text-right text-gray-400 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((project, idx) => (
                  <tr 
                    key={project._id} 
                    className={`border-b border-white/5 hover:bg-white/10 transition ${
                      idx % 2 === 0 ? "bg-white/[2%]" : ""
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold text-white">{project.title}</td>
                    <td className="px-6 py-4 text-gray-400">{project.client?.name || project.clientName || "—"}</td>
                    <td className="px-6 py-4 font-semibold text-white">${(project.budget || 0).toLocaleString()}</td>

                    <td className="px-6 py-4">
                      <ProgressBar value={project.progress || 0} />
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={project.status} />
                    </td>

                    <td className="px-6 py-4 text-gray-400">
                      {project.deadline
                        ? new Date(project.deadline).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        {project.status === 'pending' ? (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleApprove(project._id)}
                              className="p-2 bg-green-600/20 hover:bg-green-600/40 text-green-400 rounded-lg transition"
                              title="Approve"
                            >
                              ✓
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleReject(project._id)}
                              className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition"
                              title="Reject"
                            >
                              ✗
                            </motion.button>
                          </>
                        ) : (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => navigate(`/admin/projects/${project._id}`)}
                              className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition"
                              title="View"
                            >
                              <Eye size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedProject(project)
                                setShowEdit(true)
                              }}
                              className="p-2 bg-amber-600/20 hover:bg-amber-600/40 text-amber-400 rounded-lg transition"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedProject(project)
                                setShowDelete(true)
                              }}
                              className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* MODALS */}
      <CreateProjectModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        clients={clients}
        refresh={fetchProjects}
      />

      <EditProjectDrawer
        open={showEdit}
        onClose={() => setShowEdit(false)}
        project={selectedProject}
        clients={clients}
        refresh={fetchProjects}
      />

      <DeleteProjectDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />

    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    active: "from-green-600/20 to-green-700/10 border-green-600/30 text-green-400",
    completed: "from-blue-600/20 to-blue-700/10 border-blue-600/30 text-blue-400",
    pending: "from-yellow-600/20 to-yellow-700/10 border-yellow-600/30 text-yellow-400"
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-br border capitalize ${styles[status] || "bg-white/5 border-white/10 text-gray-400"}`}>
      {status}
    </span>
  )
}

function ProgressBar({ value }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 bg-white/10 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-red-600 to-red-700 h-2 rounded-full transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">{value}%</span>
    </div>
  )
}