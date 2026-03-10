import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Loader2, FileText, DollarSign, ArrowLeft, Calendar, User, CheckCircle, Paperclip } from "lucide-react"
import api from "../../utils/axios"

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCreateQuote, setShowCreateQuote] = useState(false)
  const [showCreateInvoice, setShowCreateInvoice] = useState(false)

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      setLoading(true)
      const { data } = await api.get(`/admin/projects/${id}`)
      setProject(data.data)
    } catch (err) {
      console.error("Project error:", err)
    } finally {
      setLoading(false)
    }
  }

  const createQuote = async () => {
    try {
      const quoteData = {
        clientName: project.client?.name || project.clientName,
        clientEmail: project.client?.email || project.clientEmail,
        serviceId: project.serviceId?._id || project.serviceId,
        serviceCategory: project.serviceId?.category?.name === 'Web Development' ? 'web_development' : 'graphic_design',
        description: project.description || `${project.title} - Quote Request`,
        projectId: id
      }

      await api.post("/quotes", quoteData)
      alert("Quote created successfully!")
      setShowCreateQuote(false)
      fetchProject()
    } catch (err) {
      alert("Failed to create quote: " + (err.response?.data?.message || err.message))
    }
  }

  const createInvoice = async () => {
    try {
      await api.post("/admin/invoices", {
        projectId: id,
        items: [
          {
            description: project.title || "Project Work",
            quantity: 1,
            unitPrice: project.budget || 0
          }
        ],
        tax: 0,
        discount: 0
      })
      alert("Invoice created successfully!")
      setShowCreateInvoice(false)
      fetchProject()
    } catch (err) {
      alert("Failed to create invoice: " + (err.response?.data?.message || err.message))
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-[#8B1C24]" size={48} />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-gray-400 mb-4">Project not found</p>
        <button onClick={() => navigate(-1)} className="text-[#8B1C24] hover:underline">Go back</button>
      </div>
    )
  }

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case "pending": return "bg-yellow-600/20 text-yellow-400 border-yellow-600/30"
      case "approved": return "bg-emerald-600/20 text-emerald-400 border-emerald-600/30"
      case "in_progress": return "bg-green-600/20 text-green-400 border-green-600/30"
      case "completed": return "bg-blue-600/20 text-blue-400 border-blue-600/30"
      case "cancelled": return "bg-red-600/20 text-red-400 border-red-600/30"
      default: return "bg-gray-600/20 text-gray-400 border-gray-600/30"
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 px-2 sm:px-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-fit p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold text-white break-words">{project.title}</h2>
          <p className="text-gray-400 mt-1">Project Details</p>
        </div>
      </div>

      {/* Main Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <motion.div
          whileHover={{ scale: window.innerWidth > 768 ? 1.02 : 1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6"
        >
          <div className="space-y-6">
            <div>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <User size={16} />
                Client
              </p>
              <p className="text-lg md:text-xl font-semibold text-white mt-1 break-words">
                {project.client?.name || project.clientName || "N/A"}
              </p>
              <p className="text-gray-400 text-sm mt-1 break-all">
                {project.client?.email || project.clientEmail || "No email"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <FileText size={16} />
                Service
              </p>
              <p className="text-base md:text-lg font-semibold text-white mt-1">
                {project.serviceId?.name || project.serviceId?.title || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <DollarSign size={16} />
                Budget
              </p>
              <p className="text-xl md:text-2xl font-bold text-[#8B1C24] mt-1">
                ${(project.budget || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: window.innerWidth > 768 ? 1.02 : 1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6"
        >
          <div className="space-y-6">
            <div>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <CheckCircle size={16} />
                Status
              </p>
              <p className={`inline-block px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-semibold border mt-2 capitalize ${getStatusBadgeColor(project.status)}`}>
                {project.status?.replace('_', ' ')}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <Calendar size={16} />
                Deadline
              </p>
              <p className="text-base md:text-lg font-semibold text-white mt-1">
                {project.deadline ? new Date(project.deadline).toLocaleDateString() : "Not set"}
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-400 text-sm">Progress</p>
                <span className="text-white text-sm font-semibold">{project.progress || 0}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-[#8B1C24] to-red-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${project.progress || 0}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Description */}
      {project.description && (
        <motion.div
          whileHover={{ scale: window.innerWidth > 768 ? 1.01 : 1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6"
        >
          <h3 className="text-lg md:text-xl font-semibold text-white mb-3">Description</h3>
          <p className="text-gray-300 leading-relaxed text-sm md:text-base">{project.description}</p>
        </motion.div>
      )}

      {/* Assets */}
      {project.assets && project.assets.length > 0 && (
        <motion.div
          whileHover={{ scale: window.innerWidth > 768 ? 1.01 : 1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6"
        >
          <h3 className="text-lg md:text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Paperclip size={20} />
            Assets
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project.assets.map((asset, idx) => (
              <a
                key={idx}
                href={asset}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-lg text-[#8B1C24] transition text-sm truncate"
              >
                <FileText size={16} className="flex-shrink-0" />
                <span className="truncate">{asset.split('/').pop()}</span>
              </a>
            ))}
          </div>
        </motion.div>
      )}

      {/* Admin Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setShowCreateQuote(!showCreateQuote);
            setShowCreateInvoice(false);
          }}
          className="w-full bg-gradient-to-r from-[#8B1C24] to-red-600 hover:from-[#A62A32] hover:to-red-700 px-6 py-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-red-900/20"
        >
          <FileText size={20} />
          {showCreateQuote ? "Cancel" : "Create Quote"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setShowCreateInvoice(!showCreateInvoice);
            setShowCreateQuote(false);
          }}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6 py-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-green-900/20"
        >
          <DollarSign size={20} />
          {showCreateInvoice ? "Cancel" : "Create Invoice"}
        </motion.button>
      </div>

      {/* Create Quote Confirmation */}
      {showCreateQuote && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-[#8B1C24]/30 rounded-2xl p-5 md:p-6"
        >
          <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Create Quote for {project.client?.name || project.clientName}?</h3>
          <p className="text-gray-400 mb-6 text-sm md:text-base">This will create a formal quote based on these project details.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={createQuote}
              className="flex-1 bg-[#8B1C24] hover:bg-[#A62A32] text-white font-semibold py-3 rounded-lg transition"
            >
              Confirm & Create
            </button>
            <button
              onClick={() => setShowCreateQuote(false)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Create Invoice Confirmation */}
      {showCreateInvoice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-green-600/30 rounded-2xl p-5 md:p-6"
        >
          <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Create Invoice for {project.client?.name || project.clientName}?</h3>
          <p className="text-gray-400 mb-6 text-sm md:text-base">
            This will create an invoice for the budget amount: 
            <span className="text-white font-bold ml-1">${(project.budget || 0).toLocaleString()}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={createInvoice}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Confirm & Create
            </button>
            <button
              onClick={() => setShowCreateInvoice(false)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}