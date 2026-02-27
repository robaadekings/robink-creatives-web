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
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-[#1A1F27]/90 shadow-xl py-3 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

          <Link to="/">
            <img src={logo} alt="Robink Creatives" className="h-20 object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-10 text-lg font-medium">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/portfolio">Portfolio</NavItem>
            <NavItem to="/services">Services</NavItem>
            <NavItem to="/contact">Contact</NavItem>

            <Link
              to="/portal/login"
              className="ml-4 bg-gradient-to-r from-red-600 to-red-700 px-6 py-2.5 rounded-full shadow-lg shadow-red-600/40"
            >
              Client Portal
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
            <div className="flex flex-col items-center gap-6 py-10 text-lg">
              <NavItem to="/">Home</NavItem>
              <NavItem to="/portfolio">Portfolio</NavItem>
              <NavItem to="/services">Services</NavItem>
              <NavItem to="/contact">Contact</NavItem>

              <Link
                to="/portal/login"
                className="bg-red-600 px-8 py-3 rounded-full shadow-lg shadow-red-600/30"
              >
                Client Portal
              </Link>
            </div>
          </div>
        )}
      </header>

      <div className="h-28" />

      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      <footer className="bg-[#161A22] border-t border-white/10 mt-24 py-10 text-center text-gray-400">
        © {new Date().getFullYear()} Robink Creatives. All rights reserved.
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