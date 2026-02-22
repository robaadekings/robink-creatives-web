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

  /* ================= SCROLL HANDLER ================= */
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

  /* ================= CURSOR EFFECT ================= */
  useEffect(() => {
    const moveCursor = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", moveCursor)
    return () => window.removeEventListener("mousemove", moveCursor)
  }, [])

  /* ================= CLOSE MOBILE ON ROUTE CHANGE ================= */
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <div className="dark min-h-screen flex flex-col bg-[#1B2029] text-white overflow-x-hidden relative">

      {/* Cursor Glow */}
      <div
        className="fixed pointer-events-none z-40 w-40 h-40 rounded-full blur-3xl opacity-20"
        style={{
          left: cursorPosition.x - 80,
          top: cursorPosition.y - 80,
          background: "radial-gradient(circle, #ef4444, #facc15)",
          transition: "all 0.08s linear",
        }}
      />

      {/* Scroll Progress */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 z-50"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ================= NAVBAR ================= */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "backdrop-blur-lg bg-[#1A1F27]/90 shadow-xl py-3 border-b border-white/10"
            : "bg-gradient-to-r from-[#252B36] via-[#202633] to-[#252B36] py-6"
        }`}
      >
        {/* Subtle reflection */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rotate-45 blur-3xl animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center transition-all duration-500">

          {/* LOGO */}
          <Link to="/" className="relative group z-50">
            <img
              src={logo}
              alt="Robink Creatives"
              className={`object-contain transition-all duration-500 ${
                isScrolled ? "h-20 md:h-22" : "h-20 md:h-20"
              }`}
            />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-60 transition duration-500 blur-xl bg-yellow-400/40 rounded-full" />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-10 text-lg font-medium tracking-wide z-50">

            <NavItem to="/">Home</NavItem>
            <NavItem to="/portfolio">Portfolio</NavItem>
            <NavItem to="/services">Services</NavItem>
            <NavItem to="/contact">Contact</NavItem>

            <Link
              to="/client/login"
              className="ml-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-2.5 rounded-full transition shadow-lg shadow-red-600/40"
            >
              Client Portal
            </Link>
          </nav>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden text-white z-50"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="md:hidden bg-[#1C222C] border-t border-white/10 backdrop-blur-lg">
            <div className="flex flex-col items-center gap-6 py-10 text-lg">
              <NavItem to="/">Home</NavItem>
              <NavItem to="/portfolio">Portfolio</NavItem>
              <NavItem to="/services">Services</NavItem>
              <NavItem to="/contact">Contact</NavItem>

              <Link
                to="/client/login"
                className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-full transition shadow-lg shadow-red-600/30"
              >
                Client Portal
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* NAV SPACER */}
      <div className="h-28" />

      {/* ================= MAIN ================= */}
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="relative bg-gradient-to-br from-[#161A22] via-[#1B2029] to-[#12161C] border-t border-white/10 mt-24">

        <div className="absolute -top-20 left-10 w-72 h-72 bg-red-600/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-20 w-96 h-96 bg-yellow-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-4 gap-14">

          <div>
            <img src={logo} alt="Robink Creatives" className="h-20 mb-6" />
            <p className="text-gray-400 text-sm leading-relaxed">
              Robink Creatives builds scalable digital ecosystems for ambitious brands.
              Strategy-driven engineering, premium UI systems, and performance architecture.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-5 text-white">Company</h4>
            <FooterLink to="/portfolio">Portfolio</FooterLink>
            <FooterLink to="/services">Services</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
          </div>

          <div>
            <h4 className="font-semibold mb-5 text-white">Resources</h4>
            <FooterLink to="/client/login">Client Portal</FooterLink>
            <a href="#" className="block text-gray-400 hover:text-red-400 transition mb-3">
              Privacy Policy
            </a>
            <a href="#" className="block text-gray-400 hover:text-red-400 transition">
              Terms of Service
            </a>
          </div>

          <div>
            <h4 className="font-semibold mb-5 text-white">Contact</h4>
            <p className="text-gray-400 text-sm">info@robinkcreatives.com</p>
            <p className="text-gray-400 text-sm mt-3">+254 700 000 000</p>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Robink Creatives. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

/* NAV ITEM */
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

/* FOOTER LINK */
function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="block text-gray-400 hover:text-red-400 transition mb-3 relative group"
    >
      {children}
      <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-red-500 transition-all duration-300 group-hover:w-full" />
    </Link>
  )
} 