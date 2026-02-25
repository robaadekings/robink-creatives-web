import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import axios from "../../utils/axios"

export default function Portfolio() {
  const [projects, setProjects] = useState([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { data } = await axios.get("/api/portfolios")
        setProjects(data.filter((p) => p.active))
      } catch (err) {
        console.error("Failed to load portfolio", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolio()
  }, [])

  const categories = [
    "all",
    ...new Set(projects.map((p) => p.category)),
  ]

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory)

  const featured = filteredProjects.filter((p) => p.featured)

  return (
    <div className="min-h-screen text-white">

      {/* ================= HERO ================= */}
      <section className="relative py-32 text-center overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-yellow-400/10 to-red-500/20 blur-3xl animate-pulse" />

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-5xl md:text-6xl font-bold"
        >
          Our Portfolio
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative mt-6 text-gray-400 max-w-2xl mx-auto"
        >
          Strategy. Design. Engineering. A curated collection of our finest work.
        </motion.p>
      </section>

      {/* ================= CATEGORY FILTER ================= */}
      <section className="max-w-7xl mx-auto px-6 mb-16">

        <div className="flex flex-wrap justify-center gap-4">

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full transition ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-red-600 to-yellow-500 text-white shadow-lg"
                  : "bg-white/5 backdrop-blur-md hover:bg-white/10"
              }`}
            >
              {cat.replace("_", " ")}
            </button>
          ))}

        </div>
      </section>

      {/* ================= FEATURED PROJECT ================= */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mb-24">

          <h2 className="text-3xl font-semibold mb-10">Featured Work</h2>

          {featured.map((project) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative group overflow-hidden rounded-3xl"
            >
              <img
                src={project.images?.[0]}
                alt={project.title}
                className="w-full h-[500px] object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col justify-end p-10">

                <h3 className="text-4xl font-bold">{project.title}</h3>

                <p className="text-gray-300 mt-4 max-w-2xl">
                  {project.description}
                </p>

                <div className="flex gap-4 mt-6">
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-gradient-to-r from-red-600 to-yellow-500 px-6 py-2 rounded-full"
                    >
                      View Project
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="border border-white/30 px-6 py-2 rounded-full"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </section>
      )}

      {/* ================= GRID ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-32">

        {loading ? (
          <p className="text-center text-gray-400">Loading portfolio...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="relative group overflow-hidden rounded-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-yellow-400/20 blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />

                <img
                  src={project.images?.[0]}
                  alt={project.title}
                  className="w-full h-72 object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition duration-500 flex flex-col justify-end p-6">

                  <h3 className="text-xl font-semibold">
                    {project.title}
                  </h3>

                  <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs bg-white/10 px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}