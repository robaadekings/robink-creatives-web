import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Code2, Palette, Zap, ShoppingCart, Image, RefreshCcw, Search } from "lucide-react"
import { useNavigate } from "react-router-dom"
import heroTechImage from "../../assets/hero-tech.jpeg"

export default function Landing() {
  const navigate = useNavigate()

  const { scrollYProgress } = useScroll()
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -150])

  return (
    <div className="relative overflow-hidden text-white bg-[#0a0e14]">

      {/* ================= PREMIUM BACKGROUND ================= */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e14] via-[#0f1219] to-[#1a1f2e]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/5 blur-3xl rounded-full" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-yellow-500/3 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/2 w-[600px] h-[400px] bg-red-500/5 blur-3xl rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* ================= HERO ================= */}
      <section className="relative min-h-[95vh] flex items-center px-6 z-10">

        <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center w-full">

          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="inline-flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-red-400 text-sm font-medium">Crafting Digital Excellence Since 2024</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight space-y-2">
              <div>We Design & Build</div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-red-600">
                Premium Digital Products
              </span>
              <div>That Matter</div>
            </h1>

            <p className="mt-6 text-gray-300 text-base leading-relaxed max-w-lg">
              World-class design merges with high-performance engineering. We craft digital experiences 
              that captivate users and drive measurable business growth.
            </p>

            <div className="mt-8 flex gap-4 flex-wrap">
              <button
                onClick={() => navigate("/services")}
                className="relative bg-gradient-to-r from-red-600 to-red-700 px-7 py-3 rounded-full font-semibold text-white shadow-lg shadow-red-600/40 hover:shadow-red-600/60 transition-all duration-300 hover:scale-105 hover:from-red-500 hover:to-red-600 flex items-center gap-2 text-sm group overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">Explore Services <ArrowRight size={16} className="group-hover:translate-x-1 transition" /></span>
              </button>

              <button
                onClick={() => navigate("/quote")}
                className="relative border-2 border-red-500/40 px-7 py-3 rounded-full hover:border-red-500 transition-all duration-300 flex items-center gap-2 font-semibold text-sm group hover:bg-red-500/10 backdrop-blur-sm"
              >
                <span className="relative z-10 flex items-center gap-2">Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition" /></span>
              </button>
            </div>
          </motion.div>

          {/* HERO IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative flex justify-center hidden md:flex lg:col-span-1"
          >
            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 p-[3px] rounded-2xl"
              >
                <div className="absolute inset-[3px] bg-[#0f141c] rounded-2xl" />
              </motion.div>

              <motion.img
                src={heroTechImage}
                alt="Tech Showcase"
                className="absolute inset-[3px] w-[calc(100%-6px)] h-[calc(100%-6px)] object-cover rounded-2xl"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* single HERO IMAGE (kept one, motion contained) */}

        </div>
      </section>


      {/* ================= SERVICES ================= */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div className="inline-flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-red-400 text-sm font-medium">What We Do</span>
            </motion.div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Service Categories</h2>
            <p className="text-gray-400 mt-2 max-w-3xl mx-auto leading-relaxed">
              Explore our core service areas. Dive deeper into each category to discover specialized solutions tailored to your needs.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Code2,
                title: "Web Development",
                description: "Frontend, backend & progressive web apps",
                color: "from-blue-600 to-blue-700"
              },
              {
                icon: Palette,
                title: "Design & Branding",
                description: "UI/UX design, branding & graphic design",
                color: "from-purple-600 to-purple-700"
              },
              {
                icon: ShoppingCart,
                title: "E-commerce",
                description: "Shopify stores & custom e-commerce solutions",
                color: "from-emerald-600 to-emerald-700"
              },
              {
                icon: Zap,
                title: "Optimization & Support",
                description: "Performance, SEO & ongoing maintenance",
                color: "from-orange-600 to-orange-700"
              }
            ].map((category, idx) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group cursor-pointer"
                  onClick={() => navigate('/services')}
                >
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-red-600/15 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition duration-500 blur" />
                  <div className="relative bg-gradient-to-br from-white/6 to-white/2 border border-white/10 p-6 rounded-2xl hover:border-red-500/30 transition-all duration-300 h-full flex flex-col group-hover:shadow-lg group-hover:shadow-red-500/15">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${category.color} text-white mb-4 group-hover:scale-110 transition duration-300 shadow-lg w-fit`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-red-300 transition mb-2">{category.title}</h3>
                    <p className="text-gray-400 text-sm group-hover:text-gray-300 transition flex-1">{category.description}</p>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <span className="text-red-400 text-sm font-medium group-hover:text-red-300 transition flex items-center gap-2">
                        Explore <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="text-center mt-16">
            <button
              onClick={() => navigate('/services')}
              className="relative group inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 px-8 py-3 rounded-full font-semibold shadow-lg shadow-red-600/40 hover:shadow-red-600/60 hover:scale-105 transition-all duration-300 hover:from-red-500 hover:to-red-600"
            >
              <span className="relative z-10 flex items-center gap-3">View All Services <ArrowRight size={16} className="group-hover:translate-x-1 transition" /></span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= CLIENT RESULTS ================= */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div className="inline-flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-red-400 text-sm font-medium">Proven Results</span>
            </motion.div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Client Success Metrics</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Real impact delivered across diverse industries and project scopes.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                metric: "40%",
                result: "Performance Boost",
                description: "Page load optimization for e-commerce platform"
              },
              {
                metric: "3x",
                result: "Conversion Increase",
                description: "UX redesign led to improved user engagement"
              },
              {
                metric: "150%",
                result: "Revenue Growth",
                description: "Full-stack development for SaaS startup"
              },
              {
                metric: "2w",
                result: "Launch Timeline",
                description: "Rapid MVP development for innovative tech"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative group cursor-pointer"
              >
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-red-600/15 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition duration-500 blur" />
                <div className="relative bg-gradient-to-br from-white/6 to-white/2 border border-white/10 p-6 rounded-2xl hover:border-red-500/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-red-500/10 h-full flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">{item.metric}</h3>
                    <p className="text-lg font-semibold text-white mt-2 group-hover:text-yellow-300 transition">{item.result}</p>
                  </div>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition flex-1">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button
              onClick={() => navigate('/portfolio')}
              className="relative group inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-yellow-500 px-8 py-3 rounded-full font-semibold shadow-lg shadow-red-600/40 hover:shadow-yellow-500/40 hover:scale-105 transition-all duration-300 hover:from-red-500 hover:to-yellow-400"
            >
              <span className="relative z-10 flex items-center gap-3">View Full Case Studies <ArrowRight size={16} className="group-hover:translate-x-1 transition" /></span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 px-6 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/40 via-transparent to-yellow-500/20 backdrop-blur-3xl" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-red-300 bg-clip-text text-transparent">
              Let's Build Something Exceptional
            </h2>
            <p className="mb-12 text-gray-200 max-w-2xl mx-auto text-lg leading-relaxed">
              Partner with a digital team that understands performance and precision.
            </p>
            <button
              onClick={() => navigate("/portal/register")}
              className="relative group inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-red-500 px-8 py-3 rounded-full font-semibold shadow-xl shadow-red-500/40 hover:shadow-yellow-500/40 hover:scale-105 transition-all duration-300 hover:from-yellow-300 hover:to-red-400"
            >
              <span className="relative z-10">Start Your Journey</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
            </button>
          </motion.div>
        </div>
      </section>

    </div>
  )
}