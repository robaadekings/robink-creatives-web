import { useState } from "react"
import axios from "axios"
import { motion } from "framer-motion"

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
      await axios.post(
        "http://localhost:5000/api/contact",
        formData,
        { withCredentials: true }
      )

      setSuccess(true)
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (err) {
      setError("Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white py-24 px-6 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/20 blur-[150px] rounded-full"></div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Let’s Build Something <span className="text-purple-500">Powerful</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have a project in mind? Tell us about it and our team will get back to you shortly.
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

            {/* Email */}
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

            {/* Subject */}
            <div>
              <label className="block mb-2 text-sm text-gray-300">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-700 focus:border-purple-500 focus:outline-none transition"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block mb-2 text-sm text-gray-300">Message</label>
              <textarea
                name="message"
                rows="5"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-700 focus:border-purple-500 focus:outline-none transition resize-none"
              />
            </div>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold transition disabled:opacity-50"
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