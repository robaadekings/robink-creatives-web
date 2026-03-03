import { Link, Outlet, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
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
    <div className="dark min-h-screen flex flex-col bg-[#1B2029] text-white overflow-x-hidden relative">

      {/* Scroll Progress */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 z-50"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-gradient-to-b from-[#1A1F27]/95 to-[#161A22]/90 shadow-2xl py-3 border-b border-red-500/20">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

          <Link to="/">
            <img src={logo} alt="Robink Creatives" className="h-20 object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-base font-medium">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/services">Services</NavItem>
            <NavItem to="/portfolio">Portfolio</NavItem>
            <NavItem to="/quote">Get a Quote</NavItem>
            <NavItem to="/contact">Contact</NavItem>

            <Link
              to="/portal/login"
              className="ml-6 bg-gradient-to-r from-red-600 via-red-700 to-red-800 px-7 py-2.5 rounded-lg font-semibold text-white shadow-lg shadow-red-600/40 hover:shadow-red-600/60 transition-all duration-300 hover:scale-105"
            >
              Client Login
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
          <div className="md:hidden bg-[#1C222C] border-t border-white/10">
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

      <footer className="bg-gradient-to-br from-[#0F1219] to-[#1B2029] border-t border-red-500/20 mt-24 py-16 text-center">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-white font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/services" className="hover:text-red-500 transition">Web Development</a></li>
                <li><a href="/services" className="hover:text-red-500 transition">UI/UX Design</a></li>
                <li><a href="/services" className="hover:text-red-500 transition">Brand Strategy</a></li>
                <li><a href="/services" className="hover:text-red-500 transition">Digital Marketing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/" className="hover:text-red-500 transition">Home</a></li>
                <li><a href="/portfolio" className="hover:text-red-500 transition">Portfolio</a></li>
                <li><a href="/quote" className="hover:text-red-500 transition">Get a Quote</a></li>
                <li><a href="/contact" className="hover:text-red-500 transition">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">For Clients</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/portal/login" className="hover:text-red-500 transition">Client Login</a></li>
                <li><a href="/portal/login" className="hover:text-red-500 transition">Project Status</a></li>
                <li><a href="/quote" className="hover:text-red-500 transition">Request Quote</a></li>
                <li><a href="/contact" className="hover:text-red-500 transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Email: info@robinkcreatives.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li className="pt-2">
                  <div className="flex gap-4 justify-center">
                    <a href="#" className="text-red-500 hover:text-red-400 transition">LinkedIn</a>
                    <a href="#" className="text-red-500 hover:text-red-400 transition">Twitter</a>
                    <a href="#" className="text-red-500 hover:text-red-400 transition">GitHub</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8">
            <p className="text-gray-500 text-sm mb-4">
              © {new Date().getFullYear()} Robink Creatives. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs">
              Crafted with excellence | Premium Digital Solutions
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function NavItem({ to, children }) {
  return (
    <Link
      to={to}
      className="relative group text-gray-300 hover:text-white transition"
    >
      {children}
      <span className="absolute left-0 -bottom-2 w-0 h-[2px] bg-gradient-to-r from-red-500 to-yellow-500 transition-all duration-300 group-hover:w-full" />
    </Link>
  )
}