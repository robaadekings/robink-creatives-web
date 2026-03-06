import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Mail, Phone, Send, CheckCircle } from "lucide-react"
import api from "../../utils/axios"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      await api.post("/contact", formData)

      setSuccess(true)
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative min-h-screen bg-[#0a0e14] text-white py-24 px-6 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-500/20 blur-[150px] rounded-full"></div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div className="inline-flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-red-400 text-sm font-medium">Get in Touch</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Let's Talk About Your Project
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have a project in mind? Tell us about it and our team will get back to you within 24 hours.
          </p>
        </motion.div>

        {/* Contact Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-amber-100">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-red-900/30 focus:border-red-600 focus:outline-none transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-amber-100">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-red-900/30 focus:border-red-600 focus:outline-none transition"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-amber-100">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-red-900/30 focus:border-red-600 focus:outline-none transition"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-amber-100">Message</label>
              <textarea
                name="message"
                rows="5"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-red-900/30 focus:border-red-600 focus:outline-none transition resize-none"
              />
            </div>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 font-semibold transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </motion.button>

            {/* Success */}
            {success && (
              <p className="text-green-400 text-center mt-4">
                ✅ Message sent successfully!
              </p>
            )}

            {/* Error */}
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