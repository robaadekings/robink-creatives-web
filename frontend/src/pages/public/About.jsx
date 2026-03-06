import { motion } from "framer-motion"
import logo from "../../assets/robink-logo.png"

export default function About() {
  return (
    <div className="min-h-screen bg-[#0a0e14] text-white flex flex-col items-center justify-center px-6 py-24">
      <motion.img
        src={logo}
        alt="Robink Creatives"
        className="h-24 mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      />

      <motion.h1
        className="text-5xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >About Robink Creatives</motion.h1>

      <motion.p
        className="text-gray-400 max-w-3xl text-lg leading-relaxed text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        We're a premium digital agency blending creative design with engineering excellence. Our mission is to empower ambitious brands and companies with world-class web and branding solutions that drive measurable growth and unforgettable experiences.
      </motion.p>

      <motion.div
        className="mt-16 max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-300 mb-8">
          To empower ambitious brands and innovative companies with world-class digital solutions that merge strategic design, creative excellence, and engineering precision—delivering measurable business growth and unforgettable user experiences.
        </p>

        <h2 className="text-3xl font-semibold mb-4">Our Vision</h2>
        <p className="text-gray-300">
          To be the most trusted partner for brands seeking digital transformation—recognized globally for our commitment to innovation, quality, and client success. We envision a future where premium digital design and engineering are accessible to every ambitious business.
        </p>
      </motion.div>
    </div>
  )
}