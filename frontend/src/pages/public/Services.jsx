import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Code2, Palette, Zap, ShoppingCart, Image, RefreshCcw, Search, ArrowRight } from "lucide-react"
import api from "../../utils/axios"
import { useNavigate } from "react-router-dom"
import heroTechImage from "../../assets/hero-tech.jpeg"

export default function Services() {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Predefined services with icons matching landing page
  const predefinedServices = [
    {
      icon: Code2,
      title: "Frontend Development",
      bullets: ["React, Vite, Next.js", "Pixel-perfect UI", "Accessibility & SEO"],
      image: "" // optional image URL
    },
    {
      icon: Code2,
      title: "Backend & APIs",
      bullets: ["Node.js, Express, REST & GraphQL", "Scalable architectures", "Secure integrations"]
    },
    {
      icon: ShoppingCart,
      title: "E‑commerce Solutions",
      bullets: ["Shopify & Custom Stores", "Payments & Inventory", "Conversion-focused UX"],
      image: ""
    },
    {
      icon: Palette,
      title: "UI / UX Design",
      bullets: ["User research & flows", "Interactive prototypes", "Design systems & tokens"]
    },
    {
      icon: Image,
      title: "Branding & Graphic Design",
      bullets: ["Logos & visual identity", "Print collateral & social", "Brand guidelines"]
    },
    {
      icon: Zap,
      title: "Performance & Optimization",
      bullets: ["Performance audits", "Server & frontend tuning", "Caching & CDN strategy"]
    },
    {
      icon: RefreshCcw,
      title: "Maintenance & Support",
      bullets: ["Ongoing updates", "Monitoring & backups", "SLA-based support"]
    },
    {
      icon: Search,
      title: "SEO & Analytics",
      bullets: ["Technical SEO", "Analytics setup", "Conversion tracking"]
    },
    {
      icon: Code2,
      title: "Progressive Web Apps",
      bullets: ["Offline-first UX", "Fast mobile experiences", "App-like interactions"]
    }
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const servRes = await api.get("/services")

        setServices(servRes.data?.data || servRes.data || [])
        setError("")
      } catch (err) {
        console.error("Failed to load services", err)
        setError("Failed to load custom services. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="relative min-h-screen text-white bg-[#0a0e14] bg-cover bg-center" style={{ backgroundImage: `url(${heroTechImage})` }}>

      {/* Overlays for full-page background */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 backdrop-blur-sm" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />

      {/* ================= HERO (content over full-page background) ================= */}
      <section className="relative min-h-[50vh] flex items-center justify-center text-center z-10">
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 inline-flex items-center gap-3 bg-red-500/20 border border-red-500/40 px-4 py-2 rounded-full"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-red-300 text-sm font-medium">Comprehensive Digital Solutions</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Premium Digital Services
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-gray-100 max-w-3xl mx-auto text-base leading-relaxed"
          >
            End-to-end digital solutions merging creative design with robust engineering—minimal, modern, and tailored for impact.
          </motion.p>
        </div>
      </section>

      {/* ================= SERVICES GRID (SCROLLABLE CONTENT) ================= */}
      <section id="services" className="relative py-2 px-6 z-20">
        <div className="max-w-6xl mx-auto">

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="animate-spin text-red-500" size={32} />
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
              {predefinedServices.map((service, idx) => {
                const Icon = service.icon
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.06 }}
                    viewport={{ once: true }}
                    className="relative group h-full"
                  >
                    <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-red-600/30 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition duration-500 blur-xl" />
                    <div className="relative bg-gradient-to-br from-white/8 to-white/3 border border-white/10 p-6 rounded-3xl hover:border-red-500/40 transition-all duration-300 h-full backdrop-blur-2xl group-hover:shadow-2xl group-hover:shadow-red-500/10">
                      {service.image && (
                        <img src={service.image} alt={service.title} className="w-full h-32 object-cover rounded-2xl mb-4 group-hover:scale-105 transition duration-300" />
                      )}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-red-600 to-yellow-400 text-white flex-shrink-0 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-red-500/50 transition duration-300 shadow-lg">
                          <Icon size={20} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white group-hover:text-red-300 transition">{service.title}</h3>
                          <ul className="text-gray-400 mt-3 space-y-2 text-sm group-hover:text-gray-300 transition">
                            {service.bullets.map((b, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Custom Admin-Added Services Section */}
            {services && services.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="text-center mb-4 py-4">\n                  <motion.div className="inline-flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-full mb-6">\n                    <span className="relative flex h-2 w-2">\n                      <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span>\n                      <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>\n                    </span>\n                    <span className="text-yellow-400 text-sm font-medium">Admin Added Services</span>\n                  </motion.div>\n                  <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">Custom Services & Specializations</h2>\n                  <p className="text-gray-400 mt-3">Additional tailored solutions crafted by our expert team</p>\n                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service, index) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group flex flex-col"
              >
                <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-red-600/20 to-yellow-500/15 opacity-0 group-hover:opacity-100 transition duration-500 blur-xl" />

                <div className="relative bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 h-full hover:border-red-500/40 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-red-500/15 flex flex-col">

                  {service.image && (
                    <img src={service.image} alt={service.title} className="w-full h-32 object-cover rounded-2xl mb-4 group-hover:scale-105 transition duration-300" />
                  )}

                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-red-300 transition">
                    {service.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-4 group-hover:text-gray-300 transition flex-1">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.features?.map((feature, idx) => (
                      <span key={idx} className="text-xs bg-red-500/20 border border-red-500/30 px-3 py-1 rounded-full text-red-200 group-hover:bg-red-500/30 transition">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    {service.category && (
                      <span className="text-yellow-400 font-medium text-sm">
                        {service.category?.name}
                      </span>
                    )}

                    <button className="text-sm bg-gradient-to-r from-red-600 to-yellow-500 px-4 py-2 rounded-full hover:scale-105 transition ml-auto">
                      Learn More
                    </button>
                  </div>
                </div>
              </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
        </div>
      </section>

    </div>
  )
}