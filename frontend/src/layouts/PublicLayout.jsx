import { Link, Outlet, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { Menu, X, Facebook, Linkedin, Github, MessageCircle, ChevronUp } from "lucide-react"
import logo from "../assets/robink-logo.png"

export default function PublicLayout() {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      
      setScrollProgress(progress)
      setIsScrolled(scrollTop > 20)
      setShowBackToTop(scrollTop > 400)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="dark min-h-screen flex flex-col bg-[#0a0e14] text-white overflow-x-hidden relative selection:bg-red-500/30 font-sans">
      
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-red-600 z-[100] transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* NAVBAR */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
          ? "py-3 backdrop-blur-md bg-[#0a0e14]/80 border-b border-white/5 shadow-lg" 
          : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/" className="transition-transform active:scale-95">
            <img src={logo} alt="Robink Creatives" className="h-10 sm:h-12 object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-2 lg:gap-4 text-sm font-medium">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/about">About</NavItem>
            <NavItem to="/services">Services</NavItem>
            <NavItem to="/portfolio">Portfolio</NavItem>
            <NavItem to="/contact">Contact</NavItem>

            <Link
              to="/portal/login"
              className="ml-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-full font-bold text-white transition-all duration-300"
            >
              Client Portal
            </Link>
          </nav>

          <button
            className="md:hidden p-2 text-white z-50"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`fixed inset-0 md:hidden bg-[#0a0e14] transition-all duration-500 ease-in-out z-40 ${
            mobileOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
            {['Home', 'About', 'Services', 'Portfolio', 'Contact'].map((item) => (
              <Link
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className="text-2xl font-bold hover:text-red-500 transition-colors"
              >
                {item}
              </Link>
            ))}
            <Link
              to="/portal/login"
              className="mt-4 w-full max-w-xs text-center bg-red-600 py-4 rounded-2xl font-bold text-lg"
            >
              Client Login
            </Link>
          </div>
        </div>
      </header>

      <div className="h-24 md:h-28" />

      <main className="flex-1 relative z-10 w-full overflow-hidden">
        <Outlet />
      </main>

      {/* MINIMAL FOOTER */}
      <footer className="relative z-20 bg-[#070a0f] border-t border-white/5 pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 items-start">
            
            {/* Logo and Socials */}
            <div className="flex flex-col items-center md:items-start space-y-6">
              <img src={logo} alt="Robink Creatives" className="h-10 object-contain" />
              <div className="flex gap-4">
                <SocialIcon icon={<Linkedin size={18} />} href="https://linkedin.com/company/robink-creatives" bg="bg-white/5 hover:bg-red-600" />
                <SocialIcon icon={<Facebook size={18} />} href="https://facebook.com/robinkcreatives" bg="bg-white/5 hover:bg-red-600" />
                <SocialIcon icon={<Github size={18} />} href="https://github.com/robinkcreatives" bg="bg-white/5 hover:bg-red-600" />
              </div>
            </div>

            {/* Simple Contact Column */}
            <div className="text-center md:text-left">
              <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Get in Touch</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p><a href="mailto:info@robinkcreatives.com" className="hover:text-red-500 transition-colors">info@robinkcreatives.com</a></p>
                <p>+254 769 505 060</p>
                <p>Nairobi, Kenya</p>
              </div>
            </div>

            {/* Links Column */}
            <div className="text-center md:text-left">
              <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Quick Links</h4>
              <div className="flex flex-col gap-2 text-sm text-gray-400">
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </div>
            </div>

          </div>

          <div className="border-t border-white/5 pt-8 text-center md:text-left">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} Robink Creatives. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* ACTION BUTTONS */}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3">
        <button
          onClick={scrollToTop}
          className={`p-3 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-full shadow-2xl transition-all duration-500 hover:bg-white/20 ${
            showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
          }`}
        >
          <ChevronUp size={24} />
        </button>

        <a 
          href="https://wa.me/254769505060" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
        >
          <MessageCircle size={24} />
        </a>
      </div>
    </div>
  )
}

function NavItem({ to, children }) {
  const location = useLocation()
  const isActive = location.pathname === to
  return (
    <Link 
      to={to} 
      className={`relative px-4 py-2 rounded-full transition-all duration-300 font-medium ${
        isActive ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white'
      }`}
    >
      {children}
    </Link>
  )
}

function SocialIcon({ icon, href, bg }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`p-2.5 rounded-lg text-white ${bg} transition-all shadow-lg flex items-center justify-center`}
    >
      {icon}
    </a>
  )
}