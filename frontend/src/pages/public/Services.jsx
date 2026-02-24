import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import axios from "../../utils/axios"

export default function Services() {
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, servRes] = await Promise.all([
          axios.get("/api/service-categories"),
          axios.get("/api/services"),
        ])

        setCategories(catRes.data)
        setServices(servRes.data)
      } catch (err) {
        console.error("Failed to load services", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredServices =
    activeCategory === "all"
      ? services
      : services.filter(
          (service) => service.category?._id === activeCategory
        )

  return (
    <div className="relative min-h-screen text-white">

      {/* ================= HERO ================= */}
      <section className="relative py-32 text-center overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-yellow-400/10 to-red-500/20 blur-3xl animate-pulse" />

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-5xl md:text-6xl font-bold tracking-tight"
        >
          Premium Digital Services
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative mt-6 text-gray-400 max-w-2xl mx-auto"
        >
          Strategy-driven design and engineering solutions crafted to elevate ambitious brands.
        </motion.p>
      </section>

      {/* ================= CATEGORY FILTER ================= */}
      <section className="max-w-7xl mx-auto px-6 mb-16">

        <div className="flex flex-wrap justify-center gap-4">

          <button
            onClick={() => setActiveCategory("all")}
            className={`px-6 py-2 rounded-full transition ${
              activeCategory === "all"
                ? "bg-gradient-to-r from-red-600 to-yellow-500 text-white shadow-lg"
                : "bg-white/5 backdrop-blur-md hover:bg-white/10"
            }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat._id)}
              className={`px-6 py-2 rounded-full transition ${
                activeCategory === cat._id
                  ? "bg-gradient-to-r from-red-600 to-yellow-500 text-white shadow-lg"
                  : "bg-white/5 backdrop-blur-md hover:bg-white/10"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* ================= SERVICES GRID ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-32">

        {loading ? (
          <p className="text-center text-gray-400">Loading services...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

            {filteredServices.map((service, index) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/20 to-yellow-400/20 blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />

                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 h-full hover:border-red-500/40 transition">

                  <h3 className="text-2xl font-semibold mb-4">
                    {service.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-6">
                    {service.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-red-400 font-medium">
                      {service.category?.name}
                    </span>

                    <button className="text-sm bg-gradient-to-r from-red-600 to-yellow-500 px-4 py-2 rounded-full hover:scale-105 transition">
                      Learn More
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="relative py-24 text-center">

        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-yellow-500/20 blur-3xl" />

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-4xl font-bold"
        >
          Let’s Build Something Exceptional
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative mt-6 text-gray-400"
        >
          Tell us about your project and let’s craft your next digital breakthrough.
        </motion.p>

        <motion.a
          href="/contact"
          whileHover={{ scale: 1.05 }}
          className="relative inline-block mt-8 bg-gradient-to-r from-red-600 to-yellow-500 px-8 py-3 rounded-full shadow-lg"
        >
          Start Your Project
        </motion.a>
      </section>
    </div>
  )
}