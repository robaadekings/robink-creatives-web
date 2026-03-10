import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Loader2, X, Code2, Palette, ShoppingCart, Globe, ArrowRight } from "lucide-react"
import api from "../../utils/axios"
import { useNavigate } from "react-router-dom"

export default function Portfolio() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedProject, setSelectedProject] = useState(null)

  const categoryIcons = {
    design: Palette,
    development: Code2,
    ecommerce: ShoppingCart,
    branding: Palette,
    web: Globe,
    default: Globe
  }

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true)
        const { data } = await api.get("/portfolios")
        setProjects(data?.data?.filter((p) => p.active) || [])
        setError("")
      } catch (err) {
        console.error("Failed to load portfolio", err)
        setError("Failed to load portfolio")
      } finally {
        setLoading(false)
      }
    }
    fetchPortfolio()
  }, [])

  const categories = ["all", ...new Set(projects.map((p) => p.category))]

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory)

  const featured = filteredProjects.filter((p) => p.featured)

  const getCategoryIcon = (category) => {
    const icon = categoryIcons[category?.toLowerCase()] || categoryIcons.default
    return icon
  }

  return (
    <div className="min-h-screen text-white bg-[#0a0e14]">
      {/* ================= HERO ================= */}
      <section className="relative py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-yellow-400/10 to-red-500/20 blur-3xl animate-pulse" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative inline-flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-red-400 text-sm font-medium">Our Work</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
        >
          Portfolio
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative mt-4 text-gray-400 max-w-2xl mx-auto"
        >
          Strategy. Design. Engineering. A curated collection of transformative projects that drive business results.
        </motion.p>
      </section>

      {/* ================= CATEGORY FILTER ================= */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat === "all" ? "default" : cat)
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-red-600 to-yellow-500 text-white shadow-lg shadow-red-600/40"
                    : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-red-500/30"
                }`}
              >
                {cat !== "all" && <Icon size={16} />}
                <span className="capitalize">{cat.replace("_", " ")}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* ================= FEATURED PROJECT ================= */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <h2 className="text-3xl font-bold mb-10 bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
            Featured Work
          </h2>
          {featured.map((project) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative group overflow-hidden rounded-3xl cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <img
                src={project.images?.[0]}
                alt={project.title}
                className="w-full h-[500px] object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col justify-end p-10 group-hover:bg-black/50 transition">
                <h3 className="text-4xl font-bold group-hover:text-yellow-300 transition">
                  {project.title}
                </h3>
                <p className="text-gray-300 mt-4 max-w-2xl">{project.description}</p>
                {project.tags && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {project.tags.slice(0, 4).map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs bg-red-500/20 border border-red-500/30 px-3 py-1 rounded-full text-red-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-4 mt-8">
                  <span className="text-sm text-gray-400">Click to view case study →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </section>
      )}

      {/* ================= GRID ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-center gap-4 mb-10">
          <h2 className="text-3xl font-bold">All Projects</h2>
          <div className="h-[1px] flex-grow bg-gradient-to-r from-white/20 to-transparent" />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="animate-spin text-red-500" size={32} />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-[#0f1219] rounded-3xl overflow-hidden border border-white/10 cursor-pointer shadow-2xl"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative h-[400px] overflow-hidden">
                  <img
                    src={project.images?.[0]}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                </div>

                <div className="absolute inset-x-4 bottom-4 p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 transition-all duration-500 ease-in-out group-hover:bottom-6 group-hover:bg-black/70">
                  <div className="relative z-10">
                    {/* Hides service label when "All" is active */}
                    {activeCategory !== "all" && (
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 mb-1 block">
                        {project.category}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.tags?.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="max-h-0 opacity-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:max-h-40 group-hover:opacity-100 group-hover:mt-4">
                    <p className="text-sm text-gray-400 line-clamp-2 mb-4 border-t border-white/5 pt-4">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                      <span>View Case Study</span>
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-2 text-yellow-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-tr from-red-600/10 to-yellow-500/10" />
                  <div className="absolute -inset-0.5 border border-red-500/20 rounded-3xl blur-sm" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ================= CASE STUDY MODAL ================= */}
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedProject(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-gradient-to-br from-[#0f1219] to-[#1a1f2e] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg transition z-10"
            >
              <X size={24} />
            </button>
            <img
              src={selectedProject.images?.[0]}
              alt={selectedProject.title}
              className="w-full h-[400px] object-cover"
            />
            <div className="p-10">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="text-sm bg-red-500/20 border border-red-500/30 px-3 py-1 rounded-full text-red-200 capitalize">
                  {selectedProject.category}
                </span>
              </div>
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {selectedProject.title}
              </h2>
              <div className="grid md:grid-cols-2 gap-12 mb-12">
                <div>
                  <h3 className="text-xl font-bold text-red-400 mb-4">Challenge</h3>
                  <p className="text-gray-300 leading-relaxed">{selectedProject.description}</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Results</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex gap-3">
                      <span className="text-red-500">✓</span>
                      <span>Enhanced user experience & performance</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-yellow-500">✓</span>
                      <span>Increased engagement & conversions</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-red-500">✓</span>
                      <span>Scalable & maintainable architecture</span>
                    </li>
                  </ul>
                </div>
              </div>
              {selectedProject.tags && (
                <div className="mb-10">
                  <h3 className="text-lg font-bold mb-4">Technology Stack</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-gradient-to-r from-red-600/20 to-yellow-500/20 border border-red-500/30 px-4 py-2 rounded-full text-sm text-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-4 pt-8 border-t border-white/10">
                {selectedProject.projectUrl && (
                  <a
                    href={selectedProject.projectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-yellow-500 px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
                  >
                    Visit Project <ArrowRight size={16} />
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 border border-white/30 px-6 py-3 rounded-full font-semibold hover:bg-white/10 transition"
                  >
                    View Code
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ================= BOTTOM CTA ================= */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-yellow-500/20 blur-3xl" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Ready to Transform Your Project?
            </h2>
            <p className="text-gray-300 mb-10 text-lg">
              Let's discuss how we can bring your vision to life with the same precision and excellence
              shown in our portfolio.
            </p>
            <button
              onClick={() => navigate("/quote")}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-yellow-500 px-8 py-3 rounded-full font-semibold shadow-lg shadow-red-600/40 hover:scale-105 transition-all duration-300 hover:from-red-500 hover:to-yellow-400"
            >
              Start Your Project <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}