import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2, Plus, Briefcase, DollarSign, Calendar, FileText, CheckCircle, X, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import api from "../../utils/axios"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"

export default function ClientProjects() {
  const [projects, setProjects] = useState([])
  const [services, setServices] = useState([])
  const [servicesLoading, setServicesLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    serviceId: '',
    budget: '',
    deadline: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProjects()
    fetchServices()
  }, [])

  const fetchProjects = () => {
    api.get("/client/projects")
      .then(res => setProjects(res.data.data || []))
      .catch(err => console.error("Projects error:", err))
      .finally(() => setLoading(false))
  }

  const fetchServices = () => {
    setServicesLoading(true)
    api.get("/services")
      .then(res => setServices(res.data.data || []))
      .catch(err => console.error("Services error:", err))
      .finally(() => setServicesLoading(false))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post("/client/projects", formData)
      setModalOpen(false)
      setFormData({ title: '', description: '', serviceId: '', budget: '', deadline: '' })
      fetchProjects()
    } catch (err) {
      console.error("Create project error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-96">
      <Loader2 className="animate-spin text-red-500" size={32} />
    </div>
  )

  return (
    <div className="space-y-6 md:space-y-8 px-2 sm:px-0 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">My Projects</h2>
          <p className="text-gray-400 mt-1 text-sm md:text-base">Track and manage your creative projects</p>
        </div>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto bg-[#8B1C24] hover:bg-[#A62A32] px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition text-white shadow-lg shadow-red-900/20"
            >
              <Plus size={20} />
              Request New Project
            </motion.button>
          </DialogTrigger>
          
          <DialogContent className="bg-[#0f0f23] border border-[#8B1C24]/30 p-0 sm:rounded-2xl w-[95vw] max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-5 md:p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <h3 className="text-xl md:text-2xl font-bold text-white flex items-center">
                <Plus className="w-5 h-5 mr-3 text-[#8B1C24]" />
                New Project Request
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-5 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                    <Briefcase className="w-3 h-3 mr-2 text-[#8B1C24]" /> Project Title
                  </label>
                  <input
                    type="text" required value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-[#8B1C24] focus:outline-none text-white text-sm"
                    placeholder="e.g. Brand Refresh 2024"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                    <FileText className="w-3 h-3 mr-2 text-[#8B1C24]" /> Service
                  </label>
                  <select
                    required value={formData.serviceId}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-[#8B1C24] focus:outline-none text-white text-sm appearance-none"
                  >
                    <option value="">Select a service</option>
                    {services.map(s => (
                      <option key={s._id} value={s._id}>{s.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                    <DollarSign className="w-3 h-3 mr-2 text-green-500" /> Budget
                  </label>
                  <input
                    type="number" value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-[#8B1C24] focus:outline-none text-white text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                    <Calendar className="w-3 h-3 mr-2 text-blue-500" /> Deadline
                  </label>
                  <input
                    type="date" value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-[#8B1C24] focus:outline-none text-white text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                  <FileText className="w-3 h-3 mr-2 text-orange-500" /> Description
                </label>
                <textarea
                  rows="4" value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-[#8B1C24] focus:outline-none text-white text-sm resize-none"
                  placeholder="Tell us about your requirements..."
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <button
                  type="button" onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 px-6 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={submitting}
                  className="flex-1 py-3 px-6 rounded-xl bg-[#8B1C24] text-white font-bold hover:bg-[#A62A32] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle size={20} /> Request Project</>}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10 px-4">
          <Briefcase className="mx-auto text-gray-600 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white">No projects found</h3>
          <p className="text-gray-400 mt-2 max-w-sm mx-auto">You haven't requested any projects yet. Click the button above to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {projects.map(project => (
            <motion.div
              key={project._id}
              whileHover={{ y: -4 }}
              onClick={() => navigate(`/client/projects/${project._id}`)}
              className="group bg-white/5 border border-white/10 p-5 md:p-6 rounded-2xl cursor-pointer hover:bg-white/[0.08] hover:border-[#8B1C24]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-white group-hover:text-red-400 transition-colors line-clamp-1">{project.title}</h3>
                  <ChevronRight size={20} className="text-gray-600 group-hover:text-white transition-all" />
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${
                    project.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {project.status}
                  </span>
                  {project.deadline && (
                    <span className="text-[10px] text-gray-500 font-medium">
                      Due: {new Date(project.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {project.description && (
                  <p className="text-gray-400 text-sm line-clamp-2 mb-6 leading-relaxed">
                    {project.description}
                  </p>
                )}
              </div>

              <ProgressBar value={project.progress || 0} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

function ProgressBar({ value }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
        <span className="text-gray-500">Project Progress</span>
        <span className="text-red-500">{value}%</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-gradient-to-r from-[#8B1C24] to-[#ff4d5a] h-full rounded-full shadow-[0_0_10px_rgba(139,28,36,0.5)]"
        />
      </div>
    </div>
  )
}