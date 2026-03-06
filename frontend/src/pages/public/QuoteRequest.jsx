import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Upload, CheckCircle, ArrowRight, Briefcase, Clock, DollarSign } from "lucide-react"
import api from "../../utils/axios"

export default function QuoteRequest() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    serviceId: "",
    description: "",
    budgetRange: "",
    deadline: "",
    phone: "",
    company: ""
  })
  const [files, setFiles] = useState([])
  const [services, setServices] = useState([])

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const { data } = await api.get("/services")
      setServices(data.data || [])
    } catch (err) {
      console.error("Services fetch error:", err)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const payload = new FormData()
      Object.entries(formData).forEach(([key, val]) => {
        if (val) payload.append(key, val)
      })
      files.forEach((f) => payload.append("attachments", f))

      await api.post("/quotes", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      setSuccess(true)
      setFormData({
        name: "",
        email: "",
        serviceId: "",
        description: "",
        budgetRange: "",
        deadline: "",
        phone: "",
        company: ""
      })
      setFiles([])
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit quote request.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Request a Custom Quote
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg">
            Tell us about your vision and we'll craft a tailored solution that exceeds your expectations. Every detail matters to us.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Personal Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-3 text-sm font-medium text-gray-300 flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-4 rounded-xl bg-black/40 border border-gray-700 focus:border-purple-500 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-500/20"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block mb-3 text-sm font-medium text-gray-300">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-4 rounded-xl bg-black/40 border border-gray-700 focus:border-purple-500 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-500/20"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-3 text-sm font-medium text-gray-300">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-4 rounded-xl bg-black/40 border border-gray-700 focus:border-purple-500 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-500/20"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block mb-3 text-sm font-medium text-gray-300">Company Name</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-4 rounded-xl bg-black/40 border border-gray-700 focus:border-purple-500 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-500/20"
                  placeholder="Your company"
                />
              </div>
            </div>

            {/* Service Selection */}
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-300 flex items-center">
                <ArrowRight className="w-4 h-4 mr-2" />
                Service Category *
              </label>
              <select
                name="serviceId"
                required
                value={formData.serviceId}
                onChange={handleChange}
                className="w-full px-4 py-4 rounded-xl bg-black/40 border border-gray-700 focus:border-purple-500 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="">Select a service</option>
                {services.map(service => (
                  <option key={service._id} value={service._id}>
                    {service.name} - {service.category?.name || 'General'}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Details */}
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-300">Project Description *</label>
              <textarea
                name="description"
                rows="6"
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-4 rounded-xl bg-black/40 border border-gray-700 focus:border-purple-500 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-500/20 resize-none"
                placeholder="Describe your project in detail. What are your goals? What features do you need? Any specific requirements?"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-3 text-sm font-medium text-gray-300 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Budget Range
                </label>
                <select
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleChange}
                  className="w-full px-4 py-4 rounded-xl bg-black/40 border border-gray-700 focus:border-purple-500 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="">Select budget range</option>
                  <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                  <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                  <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                  <option value="$50,000+">$50,000+</option>
                </select>
              </div>
              <div>
                <label className="block mb-3 text-sm font-medium text-gray-300 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Preferred Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-4 rounded-xl bg-black/40 border border-gray-700 focus:border-purple-500 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-300 flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                Attachments (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="px-4 py-4 rounded-xl bg-black/40 border border-gray-700 border-dashed hover:border-purple-500 transition-all duration-300">
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-300">
                      {files.length > 0 ? `${files.length} file(s) selected` : "Click to upload files or drag and drop"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">PDF, DOC, JPG, PNG up to 10MB each</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-lg transition-all duration-300 disabled:opacity-50 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-purple-500/25"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2" />
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <CheckCircle className="mr-2" />
                  Submit Request
                </div>
              )}
            </motion.button>

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-green-500/10 border border-green-500/20"
              >
                <p className="text-green-400 text-center flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Request sent successfully! We'll get back to you within 24 hours.
                </p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20"
              >
                <p className="text-red-400 text-center">
                  {error}
                </p>
              </motion.div>
            )}

          </form>
        </motion.div>
      </div>
    </section>
  )
}