import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import heroImage from "../../assets/robink-logo.png"

export default function Landing() {
  const { scrollYProgress } = useScroll()
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -150])

  /* ================= COUNTER ================= */
  const Counter = ({ end }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      let start = 0
      const duration = 2000
      const increment = end / (duration / 16)

      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(timer)
    }, [end])

    return <span>{count}</span>
  }

  /* ================= TESTIMONIAL SLIDER ================= */
  const testimonials = [
    {
      name: "CEO, TechNova",
      text: "Robink transformed our digital presence with unmatched precision."
    },
    {
      name: "Founder, StartHub",
      text: "Elite execution. Premium design. Exceptional engineering."
    },
    {
      name: "Director, FinEdge",
      text: "The most performance-focused creative team we've worked with."
    }
  ]

  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden text-white">

      {/* ================= HERO ================= */}
      <section className="relative min-h-[95vh] flex items-center px-6">

        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        >
          <source src="/video-bg.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B2029] via-[#1F2633] to-[#151922]" />

        {/* Parallax Glow */}
        <motion.div
          style={{ y: yParallax }}
          className="absolute top-20 left-20 w-72 h-72 bg-red-600/20 blur-3xl rounded-full"
        />
        <motion.div
          style={{ y: yParallax }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 blur-3xl rounded-full"
        />

        <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              We Build{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-400">
                Premium Digital
              </span>{" "}
              Experiences
            </h1>

            <p className="mt-6 text-gray-400 text-lg leading-relaxed max-w-lg">
              Robink Creatives is a technology-driven design firm crafting scalable,
              high-performance digital products for ambitious brands.
            </p>

            <div className="mt-8 flex gap-4">
              <button className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 rounded-full font-medium hover:scale-105 transition shadow-lg shadow-red-600/30">
                View Portfolio
              </button>

              <button className="border border-white/20 px-6 py-3 rounded-full hover:bg-white/5 transition flex items-center gap-2">
                Get Started <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>

          {/* HERO IMAGE 3D STYLE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-yellow-500/20 blur-3xl rounded-3xl" />
            <img
              src={heroImage}
              alt="Robink Creatives"
              className="relative rounded-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] border border-white/10"
            />
          </motion.div>

        </div>
      </section>

      {/* ================= FEATURED PROJECTS ================= */}
      <section className="py-28 px-6 bg-[#151922]">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-16 text-center"
        >
          Featured Projects
        </motion.h2>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          {[1,2,3].map((item) => (
            <motion.div
              key={item}
              whileHover={{ y: -12 }}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl"
            >
              <div className="h-48 bg-gradient-to-br from-red-600/20 to-yellow-500/20 rounded-xl mb-6" />
              <h3 className="text-xl font-semibold">Enterprise Web Platform</h3>
              <p className="text-gray-400 mt-3 text-sm">
                High-performance scalable solution built with modern architecture.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= WHY CHOOSE ================= */}
      <section className="py-28 px-6 bg-[#1B2029]">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-16 text-center"
        >
          Why Choose Robink
        </motion.h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Engineering Excellence",
              desc: "We build scalable, maintainable, and secure digital ecosystems.",
            },
            {
              title: "Premium UI Systems",
              desc: "Every interface is meticulously crafted for clarity and impact.",
            },
            {
              title: "Growth-Driven Strategy",
              desc: "Technology aligned with business performance and ROI.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10"
            >
              <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= STATS WITH ANIMATION ================= */}
      <section className="py-24 bg-[#151922]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 text-center gap-10">
          <div>
            <h3 className="text-4xl font-bold text-red-500">
              <Counter end={50}/>+
            </h3>
            <p className="text-gray-400 mt-2">Projects Delivered</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-red-500">
              <Counter end={98}/>%
            </h3>
            <p className="text-gray-400 mt-2">Client Satisfaction</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-red-500">
              <Counter end={5}/>+
            </h3>
            <p className="text-gray-400 mt-2">Years Experience</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-red-500">24/7</h3>
            <p className="text-gray-400 mt-2">Support</p>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-28 px-6 bg-[#1B2029] text-center">
        <h2 className="text-3xl font-bold mb-16">What Clients Say</h2>

        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl p-10 rounded-3xl border border-white/10"
        >
          <p className="text-xl text-gray-300 italic">
            "{testimonials[index].text}"
          </p>
          <p className="mt-6 text-red-500 font-semibold">
            {testimonials[index].name}
          </p>
        </motion.div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 px-6 bg-gradient-to-r from-red-600 to-red-700 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Let’s Build Something Exceptional
        </h2>
        <p className="mb-8 text-white/90">
          Partner with a digital team that understands performance and precision.
        </p>
        <button className="bg-white text-red-600 px-8 py-3 rounded-full font-semibold hover:scale-105 transition">
          Start Your Project
        </button>
      </section>

    </div>
  )
}