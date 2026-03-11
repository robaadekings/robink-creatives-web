import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Plus, Briefcase, DollarSign, Calendar, FileText, CheckCircle } from "lucide-react"
import api from "../../../utils/axios"

export default function CreateProjectModal({ open, onClose, clients, refresh }) {
  const [form, setForm] = useState({
    title: "", // Fixed: changed from 'name' to 'title'
    clientId: "",
    serviceId: "",
    budget: "",
    deadline: "",
    description: "",
    status: "pending"
  })
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [servicesLoading, setServicesLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetchServices()
    }
  }, [open])

  const fetchServices = async () => {
    setServicesLoading(true)
    try {
      const { data } = await api.get("/services")
      setServices(data.data || [])
    } catch (err) {
      console.error("Services fetch error:", err)
    } finally {
      setServicesLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Syncing payload with backend expectations
      const payload = {
        ...form,
        budget: form.budget ? Number(form.budget) : 0
      }

      await api.post("/admin/projects", payload)
      
      // Basic success feedback
      alert("Project created successfully!")
      
      refresh()
      onClose()
      setForm({
        title: "",
        clientId: "",
        serviceId: "",
        budget: "",
        deadline: "",
        description: "",
        status: "pending"
      })
    } catch (err) {
      console.error("Create project error:", err)
      alert(err.response?.data?.message || "Failed to create project")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#0f0f23] border border-[#8B1C24]/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="p-6 border-b border-[#8B1C24]/30">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <Plus className="w-6 h-6 mr-3 text-[#8B1C24]" />
              Create New Project
            </h3>
            <button
              onClick={onClose}
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
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-700 focus:border-[#8B1C24] focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-[#8B1C24]/20 text-white"
                placeholder="Enter project title"
              />
            </div>

            <div>
              <label className="block mb-3 text-sm font-medium text-gray-300">Client *</label>
              <select
                required
                value={form.clientId}
                onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-700 focus:border-[#8B1C24] focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-[#8B1C24]/20 text-white"
              >
                <option value="">Select Client</option>
                {clients.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-3 text-sm font-medium text-gray-300">Service *</label>
            <select
              required
              value={form.serviceId}
              onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-700 focus:border-[#8B1C24] focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-[#8B1C24]/20 text-white"
              disabled={servicesLoading}
            >
              <option value="">
                {servicesLoading ? "Loading services..." : "Select Service"}
              </option>
              {services.map(service => (
                <option key={service._id} value={service._id}>
                  {service.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-300 flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-green-400" />
                Budget
              </label>
              <input
                type="number"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-700 focus:border-[#8B1C24] focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-[#8B1C24]/20 text-white"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block mb-3 text-sm font-medium text-gray-300 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                Deadline
              </label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-700 focus:border-[#8B1C24] focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-[#8B1C24]/20 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block mb-3 text-sm font-medium text-gray-300 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-orange-400" />
              Description
            </label>
            <textarea
              rows="4"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-700 focus:border-[#8B1C24] focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-[#8B1C24]/20 text-white resize-none"
              placeholder="Describe requirements..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-6 rounded-xl bg-[#8B1C24] text-white font-semibold hover:bg-[#A62A32] transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}