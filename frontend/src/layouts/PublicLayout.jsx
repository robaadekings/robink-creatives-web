import { Link, Outlet, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { Menu, X, Facebook, Linkedin, Github } from "lucide-react"
import logo from "../assets/robink-logo.png"

export default function PublicLayout() {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight

      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollProgress(progress)
      setIsScrolled(scrollTop > 20)
    } 

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const moveCursor = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", moveCursor)
    return () => window.removeEventListener("mousemove", moveCursor)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <div className="dark min-h-screen flex flex-col bg-[#0a0e14] text-white overflow-x-hidden relative">

      {/* Scroll Progress */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 z-50"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-3xl bg-gradient-to-b from-[#0a0e14]/90 via-[#0f1219]/85 to-[#0f1219]/75 border-b border-red-500/15 shadow-2xl py-3">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

          <Link to="/" className="relative group">
            <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-red-600/20 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition duration-300 blur-lg" />
            <img src={logo} alt="Robink Creatives" className="h-20 object-contain hover:opacity-90 transition relative" />
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium tracking-wide">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/services">Services</NavItem>
            <NavItem to="/portfolio">Portfolio</NavItem>
            <NavItem to="/quote">Get a Quote</NavItem>
            <NavItem to="/contact">Contact</NavItem>

            <Link
              to="/portal/login"
              className="ml-4 relative group bg-gradient-to-r from-red-600 to-red-700 px-6 py-2.5 rounded-full font-semibold text-white shadow-lg shadow-red-600/40 hover:shadow-red-600/60 transition-all duration-300 hover:scale-105 hover:from-red-500 hover:to-red-600 overflow-hidden"
            >
              <span className="relative z-10">Client Login</span>
            </Link>
          </nav>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-[#0f1219] border-t border-white/10">
            <div className="flex flex-col items-center gap-5 py-10 text-base">
              <NavItem to="/">Home</NavItem>
              <NavItem to="/services">Services</NavItem>
              <NavItem to="/portfolio">Portfolio</NavItem>
              <NavItem to="/quote">Get a Quote</NavItem>
              <NavItem to="/contact">Contact</NavItem>

              <Link
                to="/portal/login"
                className="bg-gradient-to-r from-red-600 to-red-700 px-10 py-3 rounded-lg font-semibold shadow-lg shadow-red-600/40 transition-all duration-300 hover:scale-105 w-fit"
              >
                Client Login
              </Link>
            </div>
          </div>
        )}
      </header>

      <div className="h-28" />

      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      <footer className="relative z-20 bg-gradient-to-br from-[#0a0e14] to-[#0f1219] border-t border-red-500/10 mt-24 py-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 items-start">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <img src={logo} alt="Robink Creatives" className="h-14 object-contain" />
                <div>
                  <h3 className="text-white text-xl font-bold">Robink Creatives</h3>
                  <p className="text-gray-400 text-sm">Premium Digital Products & Branding</p>
                </div>
              </div>

              <p className="text-gray-400 mt-6 text-sm max-w-sm mx-auto md:mx-0">
                We blend strategic design with engineering excellence to deliver memorable experiences and measurable results.
              </p>

              <div className="flex gap-2 justify-center md:justify-start mt-6">
                <a href="#" className="p-3 rounded-lg bg-[#0A66C2] text-white hover:bg-[#004182] transition" title="LinkedIn">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="p-3 rounded-lg bg-[#25D366] text-white hover:opacity-90 transition" title="WhatsApp">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d="M380.9 97.1C339-4.8 240.5-13.6 168.7 44.7 96.9 102.9 79.7 206.8 117.1 283.2L48 464l188.8-68.9c74.5 39.4 168.8 25.6 226-47.4 57.3-73 48.9-168.7-82-252.6zM224 392c-45.9 0-88.6-16.1-122-45.4l-1.9-1.6-82.9 30.2 28.1-83.1-1.7-2C50.7 245.1 63.9 191 96.5 157.6c35.4-36.9 88-52.2 138.8-40.6 50.9 11.6 89 47.1 102.3 96.2 9.9 36.3 5 74.1-14.4 104.4-19.4 30.4-51.5 50.8-89.2 57.5-6 1.2-12.2 1.8-18.2 1.8z" />
                  </svg>
                </a>
                <a href="#" className="p-3 rounded-lg bg-[#1877F2] text-white hover:bg-[#0a66c2] transition" title="Facebook">
                  <Facebook size={18} />
                </a>
                <a href="#" className="p-3 rounded-lg bg-gray-900 text-white hover:bg-black transition" title="GitHub">
                  <Github size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Services</h4>
              <div className="grid grid-cols-2 gap-4 text-gray-300 text-sm">
                <a href="/services" className="hover:text-red-500 transition">Frontend Development</a>
                <a href="/services" className="hover:text-red-500 transition">Backend & APIs</a>
                <a href="/services" className="hover:text-red-500 transition">E‑commerce</a>
                <a href="/services" className="hover:text-red-500 transition">UI/UX Design</a>
                <a href="/services" className="hover:text-red-500 transition">Branding & Identity</a>
                <a href="/services" className="hover:text-red-500 transition">Graphic Design</a>
                <a href="/services" className="hover:text-red-500 transition">Performance</a>
                <a href="/services" className="hover:text-red-500 transition">Maintenance</a>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h4 className="text-white font-bold mb-4">Stay Updated</h4>
              <p className="text-gray-400 text-sm mb-4">Subscribe for product updates, design tips and offers.</p>

              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 items-center justify-center md:justify-start">
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="px-4 py-2 rounded-lg bg-[#0b1116] border border-white/8 text-white text-sm w-full sm:w-auto"
                />
                <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold">Subscribe</button>
              </form>

              <div className="mt-6 text-gray-400 text-sm">
                <p>Email: <a href="mailto:info@robinkcreatives.com" className="hover:text-red-500">info@robinkcreatives.com</a></p>
                <p className="mt-2">Phone: <a href="tel:+15551234567" className="hover:text-red-500">+1 (555) 123-4567</a></p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-500 text-sm mb-2">
              © {new Date().getFullYear()} Robink Creatives. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs">
              Crafted with excellence — Premium Digital Solutions
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function NavItem({ to, children }) {
  const location = useLocation()
  const isActive = location.pathname === to
  const baseStyles = "relative group px-4 py-2 rounded-full transition-all duration-300 inline-flex items-center font-medium"
  const activeStyles = "text-white bg-gradient-to-r from-red-600/20 to-yellow-500/10 border border-red-500/30"
  const inactiveStyles = "text-gray-300 hover:text-white hover:bg-white/5 border border-transparent group-hover:border-red-500/20"
  return (
    <Link to={to} className={`${baseStyles} ${isActive ? activeStyles : inactiveStyles}`}>
      {children}
      <span className={`absolute bottom-0 left-1/2 h-[2px] bg-gradient-to-r from-red-500 to-yellow-500 transition-all duration-300 ${isActive ? 'w-3/4 -translate-x-1/2' : 'w-0'}`} />
    </Link>
  )
}