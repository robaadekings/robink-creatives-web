import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Code2, Palette, Zap, ShoppingCart, Image, RefreshCcw, Search } from "lucide-react"
import { useNavigate } from "react-router-dom"
import heroTechImage from "../../assets/hero-tech.jpeg"

export default function Landing() {
  const navigate = useNavigate()

  const { scrollYProgress } = useScroll()
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -150])

  return (
    <div className="relative overflow-x-hidden text-white bg-[#0a0e14] selection:bg-red-500/30">

      {/* ================= PREMIUM BACKGROUND ================= */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e14] via-[#0f1219] to-[#1a1f2e]" />
        <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-red-600/5 blur-3xl rounded-full" />
        <div className="absolute top-1/3 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-yellow-500/3 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/2 w-[400px] h-[300px] md:w-[600px] md:h-[400px] bg-red-500/5 blur-3xl rounded-full" />
        {/* Improved Grid Pattern for Ultrawide */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:60px_60px] lg:bg-[size:80px_80px]" />
      </div>

      {/* ================= HERO ================= */}
      {/* Increased padding for larger displays to prevent "cramping" */}
      <section className="relative min-h-screen md:min-h-[100vh] flex items-center px-4 sm:px-8 lg:px-16 xl:px-24 z-10 pt-24 md:pt-0">
        <div className="relative max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">

          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-red-400 text-xs md:text-sm font-semibold uppercase tracking-[0.2em]">Crafting Digital Excellence Since 2024</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight">
              <div>We Design & Build</div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-red-600">
                Premium Digital Products
              </span>
              <div>That Matter</div>
            </h1>

            <p className="mt-8 text-gray-300 text-base md:text-lg lg:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
              World-class design merges with high-performance engineering. We craft digital experiences 
              that captivate users and drive measurable business growth.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/services")}
                className="relative bg-gradient-to-r from-red-600 to-red-700 px-10 py-4 rounded-full font-bold text-white shadow-xl shadow-red-600/30 hover:shadow-red-600/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 text-base group"
              >
                <span>Explore Services</span> <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={() => navigate("/quote")}
                className="relative border-2 border-white/10 px-10 py-4 rounded-full hover:border-red-500/50 transition-all duration-300 flex items-center justify-center gap-3 font-bold text-base group hover:bg-white/5 backdrop-blur-md"
              >
                <span>Get Started</span> <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
              </button>
            </div>
          </motion.div>

          {/* HERO IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative flex justify-center order-1 lg:order-2"
          >
            <div className="relative w-full max-w-[320px] sm:max-w-[450px] lg:max-w-full aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl shadow-red-500/10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 p-[3px] rounded-[2.5rem]"
              >
                <div className="absolute inset-[2px] bg-[#0f141c] rounded-[2.5rem]" />
              </motion.div>

              <motion.img
                src={heroTechImage}
                alt="Tech Showcase"
                className="absolute inset-[4px] w-[calc(100%-8px)] h-[calc(100%-8px)] object-cover rounded-[2.3rem] grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                loading="lazy"
              />
            </div>
          </motion.div>

        </div>
      </section>


      {/* ================= SERVICES ================= */}
      <section className="py-24 px-4 sm:px-8 lg:px-16 xl:px-24 relative z-10">
        <div className="max-w-[1440px] mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <div className="inline-flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full mb-6">
              <span className="text-red-400 text-sm font-bold uppercase tracking-widest">What We Do</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Service Categories</h2>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed text-lg">
              Explore our core service areas tailored to your digital growth.
            </p>
          </motion.div>

          {/* Grid optimized for 1, 2, and 4 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {[
              { icon: Code2, title: "Web Development", description: "Frontend, backend & progressive web apps", color: "from-blue-600 to-blue-700" },
              { icon: Palette, title: "Design & Branding", description: "UI/UX design, branding & graphic design", color: "from-purple-600 to-purple-700" },
              { icon: ShoppingCart, title: "E-commerce", description: "Shopify stores & custom e-commerce solutions", color: "from-emerald-600 to-emerald-700" },
              { icon: Zap, title: "Optimization & Support", description: "Performance, SEO & ongoing maintenance", color: "from-orange-600 to-orange-700" }
            ].map((category, idx) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group cursor-pointer"
                  onClick={() => navigate('/services')}
                >
                  <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r from-red-600/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition duration-500 blur-xl" />
                  <div className="relative bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] hover:border-red-500/30 transition-all duration-300 h-full flex flex-col group-hover:bg-white/[0.06]">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${category.color} text-white mb-6 group-hover:scale-110 transition duration-300 shadow-xl w-fit`}>
                      <Icon size={28} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{category.title}</h3>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed flex-1">{category.description}</p>
                    <div className="mt-8 pt-6 border-t border-white/5">
                      <span className="text-red-400 font-bold group-hover:text-red-300 transition flex items-center gap-2">
                        Explore <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="text-center mt-16 md:mt-20">
            <button
              onClick={() => navigate('/services')}
              className="relative group inline-flex items-center gap-3 bg-white/5 border border-white/10 px-10 py-4 rounded-full font-bold hover:bg-white/10 transition-all duration-300"
            >
              View All Services <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>
      </section>

      {/* ================= CLIENT RESULTS ================= */}
      <section className="py-24 px-4 sm:px-8 lg:px-16 xl:px-24 relative z-10">
        <div className="max-w-[1440px] mx-auto">
          <motion.div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Client Success Metrics</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-lg leading-relaxed">Real impact delivered across diverse industries and project scopes.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { metric: "40%", result: "Performance Boost", description: "Page load optimization for e-commerce platform" },
              { metric: "3x", result: "Conversion Increase", description: "UX redesign led to improved user engagement" },
              { metric: "150%", result: "Revenue Growth", description: "Full-stack development for SaaS startup" },
              { metric: "2w", result: "Launch Timeline", description: "Rapid MVP development for innovative tech" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] text-center lg:text-left"
              >
                <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">{item.metric}</h3>
                <p className="text-xl font-bold text-white mt-4 mb-2">{item.result}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 px-4 sm:px-8 lg:px-16 xl:px-24 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-yellow-500/10 backdrop-blur-3xl" />
        <div className="relative max-w-5xl mx-auto text-center bg-white/[0.03] border border-white/10 p-12 md:p-20 rounded-[3rem] backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
              Let's Build Something Exceptional
            </h2>
            <p className="mb-12 text-gray-300 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
              Partner with a digital team that understands performance and precision.
            </p>
            <button
              onClick={() => navigate("/portal/register")}
              className="relative group inline-flex items-center gap-4 bg-white text-black px-12 py-5 rounded-full font-extrabold shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <span className="text-lg">Start Your Journey</span>
              <ArrowRight size={22} className="group-hover:translate-x-1 transition" />
            </button>
          </motion.div>
        </div>
      </section>

    </div>
  )
}