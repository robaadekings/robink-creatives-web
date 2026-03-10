import { Link, Outlet, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { Menu, X, Facebook, Linkedin, Github, MessageCircle, ArrowRight } from "lucide-react"
import logo from "../assets/robink-logo.png"

export default function PublicLayout() {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollProgress(progress)
      setIsScrolled(scrollTop > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="dark min-h-screen flex flex-col bg-[#0a0e14] text-white overflow-x-hidden relative selection:bg-red-500/30">
      
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 z-[100] transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* NAVBAR */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
          ? "py-2 backdrop-blur-xl bg-[#0a0e14]/90 border-b border-red-500/20 shadow-2xl" 
          : "py-4 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          
          <Link to="/" className="relative group transition-transform active:scale-95">
            <div className="absolute -inset-2 rounded-lg bg-red-600/10 opacity-0 group-hover:opacity-100 transition duration-300 blur-xl" />
            <img src={logo} alt="Robink Creatives" className="h-12 md:h-16 lg:h-20 object-contain relative" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/about">About</NavItem>
            <NavItem to="/services">Services</NavItem>
            <NavItem to="/portfolio">Portfolio</NavItem>
            <NavItem to="/contact">Contact</NavItem>

            <Link
              to="/portal/login"
              className="ml-4 group relative px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 rounded-full font-bold text-white shadow-lg shadow-red-600/20 hover:shadow-red-600/40 transition-all duration-300 hover:-translate-y-0.5"
            >
              Client Portal
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-white hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div 
          className={`fixed inset-0 top-[64px] md:hidden bg-[#0a0e14]/98 backdrop-blur-2xl transition-all duration-500 ease-in-out z-40 ${
            mobileOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full gap-8 px-6 pb-20">
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
              className="mt-4 w-full max-w-xs text-center bg-red-600 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-red-600/20"
            >
              Client Login
            </Link>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content jump */}
      <div className="h-20 md:h-28" />

      {/* MAIN CONTENT */}
      <main className="flex-1 relative z-10 w-full overflow-hidden">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="relative z-20 bg-[#070a0f] border-t border-white/5 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
            
            {/* Brand Section */}
            <div className="space-y-6 flex flex-col items-center sm:items-start text-center sm:text-left">
              <img src={logo} alt="Robink Creatives" className="h-12 object-contain" />
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Blending strategic design with engineering excellence to deliver memorable digital experiences.
              </p>
              <div className="flex gap-3">
                <SocialIcon icon={<Linkedin size={18} />} href="https://linkedin.com/company/robink-creatives" bg="bg-[#0A66C2]" />
                <SocialIcon icon={<Facebook size={18} />} href="https://facebook.com/robinkcreatives" bg="bg-[#1877F2]" />
                <SocialIcon icon={<Github size={18} />} href="https://github.com/robinkcreatives" bg="bg-gray-800" />
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center sm:text-left">
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Expertise</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><Link to="/services" className="hover:text-red-500 transition-colors">UI/UX Design</Link></li>
                <li><Link to="/services" className="hover:text-red-500 transition-colors">Web Development</Link></li>
                <li><Link to="/services" className="hover:text-red-500 transition-colors">E-commerce Solutions</Link></li>
                <li><Link to="/services" className="hover:text-red-500 transition-colors">Brand Identity</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="text-center sm:text-left">
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Get in Touch</h4>
              <div className="space-y-4 text-sm text-gray-400">
                <p>Email: <a href="mailto:info@robinkcreatives.com" className="text-white hover:text-red-500">info@robinkcreatives.com</a></p>
                <p>Phone: <a href="tel:+254769505060" className="text-white hover:text-red-500">+254 769 505 060</a></p>
                <p>Office: Nairobi, Kenya</p>
              </div>
            </div>

            {/* Newsletter */}
            <div className="text-center sm:text-left">
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Newsletter</h4>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                />
                <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                  Subscribe <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} Robink Creatives. All rights reserved.
            </p>
            <div className="flex gap-6 text-gray-500 text-xs">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Action */}
      <a 
        href="https://wa.me/254769505060" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[60] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
      >
        <span className="absolute right-full mr-3 bg-white text-black px-3 py-1 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block whitespace-nowrap">
          Chat with us!
        </span>
        <MessageCircle size={28} />
      </a>
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
      {isActive && (
        <motion-div 
          layoutId="nav-pill"
          className="absolute inset-0 bg-red-600/10 border border-red-500/20 rounded-full -z-10"
        />
      )}
    </Link>
  )
}

function SocialIcon({ icon, href, bg }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`p-2.5 rounded-xl text-white ${bg} hover:scale-110 transition-transform shadow-lg`}
    >
      {icon}
    </a>
  )
}