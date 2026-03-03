import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import api from "../../utils/axios"

export default function QuoteRequest() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    serviceCategory: "",
    description: "",
    budgetRange: "",
    deadline: "",
  })
  const [files, setFiles] = useState([])

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

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
        serviceCategory: "",
        description: "",
        budgetRange: "",
        deadline: "",
      })
      setFiles([])
      setTimeout(() => setSuccess(false), 3000)
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Request a Quote
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Tell us about your project and we'll get back with a custom proposal.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block mb-2 text-sm text-gray-300">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-700 focus:border-purple-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-700 focus:border-purple-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300">Service Category</label>
              <select
                name="serviceCategory"
                required
                value={formData.serviceCategory}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-700 focus:border-purple-500 focus:outline-none transition"
              >
                <option value="">Select a service</option>
                <option value="graphic_design">Graphic Design</option>
                <option value="web_development">Web Development</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300">Description</label>
              <textarea
                name="description"
                rows="5"
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-700 focus:border-purple-500 focus:outline-none transition resize-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm text-gray-300">Budget Range</label>
                <input
                  type="text"
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-700 focus:border-purple-500 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-300">Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-700 focus:border-purple-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300">Attachments</label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full text-gray-300"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold transition disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Submit Request"}
            </motion.button>

            {success && (
              <p className="text-green-400 text-center mt-4">
                ✅ Request sent successfully!
              </p>
            )}

            {error && (
              <p className="text-red-400 text-center mt-4">
                {error}
              </p>
            )}

          </form>
        </motion.div>
      </div>
    </section>
  )
}