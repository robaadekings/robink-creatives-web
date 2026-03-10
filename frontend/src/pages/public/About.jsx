import { motion } from "framer-motion"
import logo from "../../assets/robink-logo.png"
import { Users, Target, Award, Zap, Heart, Globe } from "lucide-react"

export default function About() {
  const stats = [
    { label: "Projects Completed", value: "150+", icon: Award },
    { label: "Happy Clients", value: "80+", icon: Users },
    { label: "Years Experience", value: "5+", icon: Target },
    { label: "Global Reach", value: "20+", icon: Globe }
  ]

  const values = [
    { icon: Zap, title: "Innovation", desc: "Pushing boundaries with cutting-edge technology" },
    { icon: Heart, title: "Passion", desc: "Delivering with genuine care and dedication" },
    { icon: Target, title: "Excellence", desc: "Striving for perfection in every project" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e14] via-[#1a0a0a] to-[#0a0e14] text-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-6 py-16 md:py-24">
        <motion.img
          src={logo}
          alt="Robink Creatives"
          className="h-20 md:h-32 mb-6 md:mb-8 drop-shadow-2xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />

        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-[#D4AF37] to-[#8B0000] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About Robink Creatives
        </motion.h1>

        <motion.p
          className="text-gray-300 max-w-4xl text-lg md:text-xl leading-relaxed text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          We're a premium digital agency blending creative design with engineering excellence. Our mission is to empower ambitious brands and companies with world-class web and branding solutions that drive measurable growth and unforgettable experiences.
        </motion.p>
      </div>

      {/* Stats Section */}
      <motion.div
        className="py-12 md:py-16 px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <stat.icon className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 text-[#D4AF37]" />
              <div className="text-2xl md:text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm md:text-base text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Mission & Vision */}
      <motion.div
        className="py-12 md:py-16 px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#8B0000]">Our Mission</h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              To empower ambitious brands and innovative companies with world-class digital solutions that merge strategic design, creative excellence, and engineering precision—delivering measurable business growth and unforgettable user experiences.
            </p>
          </div>
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#D4AF37]">Our Vision</h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              To be the most trusted partner for brands seeking digital transformation—recognized globally for our commitment to innovation, quality, and client success. We envision a future where premium digital design and engineering are accessible to every ambitious business.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Values */}
      <motion.div
        className="py-12 md:py-16 px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 md:mb-12 text-white">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#8B0000]/20 to-[#D4AF37]/20 border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <value.icon className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-6 text-[#D4AF37]" />
                <h3 className="text-xl md:text-2xl font-semibold mb-4 text-white">{value.title}</h3>
                <p className="text-sm md:text-base text-gray-300">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="py-16 px-6 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Transform Your Digital Presence?</h2>
          <p className="text-gray-300 text-base md:text-lg mb-8">
            Let's collaborate and create something extraordinary together.
          </p>
          <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#8B0000] to-[#D4AF37] rounded-full font-semibold text-white hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#8B0000]/20">
            Start Your Project
          </button>
        </div>
      </motion.div>
    </div>
  )
}