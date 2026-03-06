import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2, Plus, Briefcase, DollarSign, Calendar, FileText, CheckCircle, X } from "lucide-react"
import { motion } from "framer-motion"
import api from "../../utils/axios"
import { Button } from "../../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"

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

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-red-500" size={32} /></div>

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">My Projects</h2>
          <p className="text-gray-400 mt-1">Track and manage your creative projects</p>
        </div>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#8B1C24] hover:bg-[#A62A32] px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition text-white shadow-lg"
            >
              <Plus size={20} />
              Request New Project
            </motion.button>
          </DialogTrigger>
          <DialogContent className="bg-[#0f0f23] border border-[#8B1C24]/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-[#8B1C24]/30">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <Plus className="w-6 h-6 mr-3 text-[#8B1C24]" />
                  Request New Project
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 hover:bg-[#8B1C24]/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-3 text-sm font-medium text-gray-300 flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-[#8B1C24]" />
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-700 focus:border-[#8B1C24] focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-[#8B1C24]/20 text-white placeholder-gray-500"
                    placeholder="Enter project title"
                  />
                </div>

                <div>
                  <label className="block mb-3 text-sm font-medium text-gray-300 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-[#8B1C24]" />
                    Service *
                  </label>
                  <select
                    required
                    value={formData.serviceId}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-700 focus:border-[#8B1C24] focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-[#8B1C24]/20 text-white"
                    disabled={servicesLoading}
                  >
                    <option value="" className="bg-gray-800">
                      {servicesLoading ? "Loading services..." : "Select a service"}
                    </option>
                    {services.map(service => (
                      <option key={service._id} value={service._id} className="bg-gray-800">
                        {service.title} - {service.category?.name || 'General'}
                        {service.basePrice && ` ($${service.basePrice})`}
                      </option>
                    ))}
                  </select>
                  {formData.serviceId && (
                    <div className="mt-2 p-3 bg-[#8B1C24]/10 border border-[#8B1C24]/20 rounded-lg">
                      {(() => {
                        const selectedService = services.find(s => s._id === formData.serviceId);
                        return selectedService ? (
                          <div className="text-sm text-gray-300">
                            <p className="font-medium text-white mb-1">{selectedService.title}</p>
                            {selectedService.description && (
                              <p className="mb-2">{selectedService.description}</p>
                            )}
                            <div className="flex gap-4 text-xs">
                              {selectedService.basePrice && (
                                <span className="text-green-400">Price: ${selectedService.basePrice}</span>
                              )}
                              {selectedService.deliveryTime && (
                                <span className="text-blue-400">Delivery: {selectedService.deliveryTime}</span>
                              )}
                            </div>
                            {selectedService.features && selectedService.features.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-400 mb-1">Features:</p>
                                <ul className="text-xs space-y-1">
                                  {selectedService.features.slice(0, 3).map((feature, idx) => (
                                    <li key={idx} className="flex items-center">
                                      <span className="text-[#8B1C24] mr-1">•</span>
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-3 text-sm font-medium text-gray-300 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-green-400" />
                    Budget Estimate
                  </label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-700 focus:border-[#8B1C24] focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-[#8B1C24]/20 text-white placeholder-gray-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block mb-3 text-sm font-medium text-gray-300 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                    Preferred Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-700 focus:border-[#8B1C24] focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-[#8B1C24]/20 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-3 text-sm font-medium text-gray-300 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-orange-400" />
                  Project Description
                </label>
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-700 focus:border-[#8B1C24] focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-[#8B1C24]/20 text-white resize-none placeholder-gray-500"
                  placeholder="Describe your project requirements, goals, and any specific details..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 px-6 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-700 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 px-6 rounded-xl bg-[#8B1C24] text-white font-semibold hover:bg-[#A62A32] transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 max-w-md mx-auto">
            <Briefcase className="mx-auto text-gray-500 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
            <p className="text-gray-400 mb-6">Start your creative journey by requesting your first project!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setModalOpen(true)}
              className="bg-[#8B1C24] hover:bg-[#A62A32] px-6 py-3 rounded-xl text-white font-semibold transition"
            >
              Request New Project
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map(project => (
            <motion.div
              key={project._id}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(`/client/projects/${project._id}`)}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl cursor-pointer hover:bg-white/10 transition-all duration-300 hover:border-[#8B1C24]/30"
            >
              <h3 className="font-semibold text-lg text-white">{project.title}</h3>
              <p className="text-gray-400 text-sm mt-2">
                Status: <span className="capitalize font-medium text-red-400">{project.status}</span>
              </p>

              {project.description && (
                <p className="text-gray-500 text-sm mt-3 line-clamp-2">{project.description}</p>
              )}

              {project.deadline && (
                <p className="text-gray-500 text-xs mt-3">
                  Deadline: {new Date(project.deadline).toLocaleDateString()}
                </p>
              )}

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
    <div className="mt-4">
      <div className="flex justify-between text-xs text-gray-400 mb-2">
        <span>Progress</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-red-600 to-red-700 h-2 rounded-full transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}