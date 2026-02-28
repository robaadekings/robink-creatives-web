import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import api from "../../lib/axios"

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
    const { data } = await api.get("/admin/projects")
    setProjects(data)
    setFiltered(data)
    setLoading(false)
  }

  const fetchClients = async () => {
    const { data } = await api.get("/admin/clients")
    setClients(data)
  }

  const filterProjects = () => {
    let result = [...projects]

    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
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

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects</h2>

        <button
          onClick={() => setShowCreate(true)}
          className="bg-gradient-to-r from-red-600 to-red-700 px-5 py-2 rounded-lg flex items-center gap-2 hover:scale-105 transition"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-red-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-x-auto"
      >
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-gray-400">
              <th className="py-3">Project</th>
              <th>Client</th>
              <th>Budget</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Deadline</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((project) => (
              <tr key={project._id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 font-medium">{project.name}</td>
                <td>{project.clientName}</td>
                <td>${project.budget}</td>

                <td>
                  <ProgressBar value={project.progress || 0} />
                </td>

                <td>
                  <StatusBadge status={project.status} />
                </td>

                <td>
                  {project.deadline
                    ? new Date(project.deadline).toLocaleDateString()
                    : "-"}
                </td>

                <td className="flex gap-3">
                  <Eye
                    className="cursor-pointer text-blue-400"
                    size={16}
                    onClick={() => navigate(`/admin/projects/${project._id}`)}
                  />
                  <Pencil
                    className="cursor-pointer text-yellow-400"
                    size={16}
                    onClick={() => {
                      setSelectedProject(project)
                      setShowEdit(true)
                    }}
                  />
                  <Trash2
                    className="cursor-pointer text-red-400"
                    size={16}
                    onClick={() => {
                      setSelectedProject(project)
                      setShowDelete(true)
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

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
    active: "bg-green-500/20 text-green-400",
    completed: "bg-blue-500/20 text-blue-400",
    pending: "bg-yellow-500/20 text-yellow-400"
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs ${styles[status]}`}>
      {status}
    </span>
  )
}

function ProgressBar({ value }) {
  return (
    <div className="w-24 bg-white/10 rounded-full h-2">
      <div
        className="bg-red-600 h-2 rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}