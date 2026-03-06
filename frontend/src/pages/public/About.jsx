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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e14] via-[#1a1f2e] to-[#0a0e14] text-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-6 py-24">
        <motion.img
          src={logo}
          alt="Robink Creatives"
          className="h-32 mb-8 drop-shadow-2xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />

        <motion.h1
          className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About Robink Creatives
        </motion.h1>

        <motion.p
          className="text-gray-300 max-w-4xl text-xl leading-relaxed text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          We're a premium digital agency blending creative design with engineering excellence. Our mission is to empower ambitious brands and companies with world-class web and branding solutions that drive measurable growth and unforgettable experiences.
        </motion.p>
      </div>

      {/* Stats Section */}
      <motion.div
        className="py-16 px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <stat.icon className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Mission & Vision */}
      <motion.div
        className="py-16 px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-purple-400">Our Mission</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              To empower ambitious brands and innovative companies with world-class digital solutions that merge strategic design, creative excellence, and engineering precision—delivering measurable business growth and unforgettable user experiences.
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-blue-400">Our Vision</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              To be the most trusted partner for brands seeking digital transformation—recognized globally for our commitment to innovation, quality, and client success. We envision a future where premium digital design and engineering are accessible to every ambitious business.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Values */}
      <motion.div
        className="py-16 px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 text-white">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="p-8 rounded-2xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <value.icon className="w-16 h-16 mx-auto mb-6 text-purple-400" />
                <h3 className="text-2xl font-semibold mb-4 text-white">{value.title}</h3>
                <p className="text-gray-300">{value.desc}</p>
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
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Transform Your Digital Presence?</h2>
          <p className="text-gray-300 text-lg mb-8">
            Let's collaborate and create something extraordinary together.
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
            Start Your Project
          </button>
        </div>
      </motion.div>
    </div>
  )
}