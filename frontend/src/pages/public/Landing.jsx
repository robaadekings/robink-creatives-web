import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Code2, Palette, Zap, ShoppingCart } from "lucide-react"
import { useNavigate } from "react-router-dom"
import heroTechImage from "../../assets/hero-tech.jpeg"

export default function Landing() {
  const navigate = useNavigate()
  const { scrollYProgress } = useScroll()
  
  // Subtle parallax for background elements
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -200])

  // Animation variants for staggered lists
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  return (
    <div className="relative overflow-x-hidden text-white bg-[#0a0e14] selection:bg-red-500/30">

      {/* ================= PREMIUM BACKGROUND ================= */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e14] via-[#0f1219] to-[#1a1f2e]" />
        
        {/* Animated Orbs */}
        <motion.div 
          style={{ y: yParallax }}
          className="absolute top-[-10%] left-1/4 w-72 h-72 md:w-[500px] md:h-[500px] bg-red-600/10 blur-[120px] rounded-full" 
        />
        <div className="absolute top-1/3 -right-20 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-yellow-500/5 blur-[100px] rounded-full" />
        
        {/* Refined Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] md:bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen lg:min-h-[100vh] flex items-center pt-28 pb-16 md:pt-0 md:pb-0 px-4 sm:px-8 lg:px-16">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">

          {/* TEXT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 text-center lg:text-left z-20"
          >
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-gray-300 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
                Innovation in Motion • Est. 2024
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight">
              We Design & Build <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-yellow-500">
                Next-Gen Products
              </span>
            </h1>

            <p className="mt-8 text-gray-400 text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Where aesthetics meet high-performance engineering. We help brands 
              scale by creating digital experiences that are as functional as they are beautiful.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/services")}
                className="group relative bg-white text-black px-8 py-4 rounded-full font-bold overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="relative z-10">View Our Work</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate("/quote")}
                className="group border border-white/20 bg-white/5 backdrop-blur-md px-8 py-4 rounded-full font-bold transition-all duration-300 hover:bg-white/10 hover:border-white/40 flex items-center justify-center gap-2"
              >
                Get a Quote
              </button>
            </div>
          </motion.div>

          {/* HERO IMAGE / VISUAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="lg:col-span-5 relative flex justify-center"
          >
            <div className="relative w-full aspect-square max-w-[500px] group">
              {/* Rotating Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-red-600 via-transparent to-yellow-500 rounded-[2rem] animate-[spin_10s_linear_infinite] opacity-30" />
              
              <div className="absolute inset-[2px] bg-[#0a0e14] rounded-[2rem] z-0" />
              
              <img
                src={heroTechImage}
                alt="Digital Innovation"
                className="relative z-10 w-full h-full object-cover rounded-[1.8rem] grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 shadow-2xl"
              />
              
              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-6 -right-6 bg-[#1a1f2e] border border-white/10 p-5 rounded-2xl shadow-2xl backdrop-blur-xl z-20 hidden md:block"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-red-500/20 p-3 rounded-lg"><Zap className="text-red-500" /></div>
                  <div>
                    <p className="text-xs text-gray-400">System Status</p>
                    <p className="text-sm font-bold">100% Operational</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}
      <section className="py-24 px-4 sm:px-8 lg:px-16">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-bold">Our Core Expertise</h2>
              <p className="text-gray-400 mt-4 text-lg">We provide end-to-end digital solutions that drive growth.</p>
            </div>
            <button className="text-red-500 font-bold flex items-center gap-2 hover:gap-4 transition-all mx-auto md:mx-0">
              All Services <ArrowRight size={20} />
            </button>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
          >
            {[
              { icon: Code2, title: "Web Architecture", desc: "Enterprise-grade frontend and scalable backend systems.", color: "from-blue-500" },
              { icon: Palette, title: "UI/UX Design", desc: "User-centric interfaces that convert visitors into customers.", color: "from-purple-500" },
              { icon: ShoppingCart, title: "E-Commerce", desc: "Custom storefronts designed for maximum conversion.", color: "from-emerald-500" },
              { icon: Zap, title: "Performance", desc: "Speed optimization and SEO to dominate search results.", color: "from-orange-500" }
            ].map((service, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group relative bg-white/[0.03] border border-white/10 p-8 rounded-3xl hover:bg-white/[0.06] transition-colors"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} to-transparent flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <service.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{service.desc}</p>
                <div className="h-[1px] w-full bg-white/10 group-hover:bg-red-500/50 transition-colors" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= UNIQUE CTA ================= */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-yellow-600 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
          
          <div className="relative bg-[#1a1f2e]/50 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 md:p-20 text-center overflow-hidden">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to evolve your <br /> digital presence?</h2>
            <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto">
              Join 50+ brands that have scaled their business using our premium design and dev stack.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/portal/register")}
              className="bg-red-600 hover:bg-red-500 text-white px-10 py-5 rounded-full font-extrabold text-lg shadow-xl shadow-red-600/20 transition-all"
            >
              Start a Project
            </motion.button>
          </div>
        </div>
      </section>

    </div>
  )
}