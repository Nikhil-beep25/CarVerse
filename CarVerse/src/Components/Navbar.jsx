import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { logout } from '../Redux/Reducers/AuthSlice'
import { getSetting } from "../Redux/ActionCreators/SettingActionCreators"

export default function Navbar() {
  const SettingStateData = useSelector(state => state.SettingStateData)
  const { user } = useSelector(state => state.AuthStateData)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getSetting())
  }, [dispatch])

  const settingData = useMemo(() => {
    const setting = SettingStateData?.[0] || {}
    return {
      siteName: setting.siteName || import.meta.env.VITE_APP_SITE_NAME || 'CarVerse',
      map1: setting.map1 || import.meta.env.VITE_APP_MAP1 || '',
      address: setting.address || import.meta.env.VITE_APP_ADDRESS || 'A-52, Sector 16, Noida, Near Community Center Sector 15',
      email: setting.email || import.meta.env.VITE_APP_EMAIL || 'nikhilbhadauriya2500@gmail.com',
      phone: setting.phone || import.meta.env.VITE_APP_PHONE || '8077313959',
      whatsapp: setting.whatsapp || import.meta.env.VITE_APP_WHATSAPP || '8077313959',
      github: setting.github || import.meta.env.VITE_APP_GITHUB || 'https://github.com/Nikhil-beep25',
      facebook: setting.facebook || import.meta.env.VITE_APP_FACEBOOK || '',
      twitter: setting.twitter || import.meta.env.VITE_APP_TWITTER || '',
      instagram: setting.instagram || import.meta.env.VITE_APP_INSTAGRAM || 'https://www.instagram.com/itsnikhil_tech',
      linkedin: setting.linkedin || import.meta.env.VITE_APP_LINKEDIN || 'https://www.linkedin.com/in/nikhil-bhadauriya-308414321',
      youtube: setting.youtube || import.meta.env.VITE_APP_YOUTUBE || 'https://www.youtube.com/@ItsNikhilTech',
    }
  }, [SettingStateData])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const cleanWhatsappNumber = (settingData.whatsapp || '').replace(/[^0-9]/g, '')

  return (
    <header className="site-header w-100">
      {/* Top Contact & Social Bar */}
      <div className="container-fluid topbar bg-secondary">
        <div className="container-fluid px-xl-5 px-lg-4 px-3">
          <div className="topbar-inner d-flex align-items-center justify-content-between">
            {/* Left: Contact Info Group */}
            <div className="topbar-contact">
              {settingData.address && (
                <a
                  href={settingData.map1 || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-item topbar-address"
                  title={settingData.address}
                >
                  <i className="fas fa-map-marker-alt"></i>
                  <span className="topbar-text">{settingData.address}</span>
                </a>
              )}
              <a
                href={`mailto:${settingData.email}`}
                className="contact-item topbar-email"
                title={settingData.email}
              >
                <i className="fas fa-envelope"></i>
                <span className="topbar-text">{settingData.email}</span>
              </a>
              <a
                href={`tel:${settingData.phone}`}
                className="contact-item topbar-phone"
                title={settingData.phone}
              >
                <i className="fas fa-phone-alt"></i>
                <span className="topbar-text">{settingData.phone}</span>
              </a>
              <a
                href={cleanWhatsappNumber ? `https://wa.me/${cleanWhatsappNumber}` : '#'}
                target="_blank"
                rel="noreferrer"
                className="contact-item topbar-whatsapp"
                title={`WhatsApp: ${settingData.whatsapp}`}
              >
                <i className="bi bi-whatsapp"></i>
                <span className="topbar-text">{settingData.whatsapp}</span>
              </a>
            </div>

            {/* Right: Social Media Links Group */}
            <div className="topbar-social">
              <a
                href={settingData.github || 'https://github.com/Nikhil-beep25'}
                target="_blank"
                rel="noreferrer"
                className="topbar-social-link"
                aria-label="GitHub"
                title="GitHub"
              >
                <i className="fab fa-github"></i>
              </a>
              <a
                href={settingData.linkedin || 'https://www.linkedin.com/in/nikhil-bhadauriya-308414321'}
                target="_blank"
                rel="noreferrer"
                className="topbar-social-link"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a
                href={settingData.youtube || 'https://www.youtube.com/@ItsNikhilTech'}
                target="_blank"
                rel="noreferrer"
                className="topbar-social-link"
                aria-label="YouTube"
                title="YouTube"
              >
                <i className="fab fa-youtube"></i>
              </a>
              <a
                href={settingData.instagram || 'https://www.instagram.com/itsnikhil_tech'}
                target="_blank"
                rel="noreferrer"
                className="topbar-social-link"
                aria-label="Instagram"
                title="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              {settingData.facebook && (
                <a
                  href={settingData.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="topbar-social-link"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
              )}
              {settingData.twitter && (
                <a
                  href={settingData.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="topbar-social-link"
                  aria-label="Twitter"
                  title="Twitter"
                >
                  <i className="fab fa-twitter"></i>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container-fluid nav-bar sticky-top px-0">
        <div className="container-fluid px-xl-5 px-lg-4 px-3">
          <nav className="navbar navbar-expand-lg navbar-light d-flex align-items-center justify-content-between py-2 py-lg-0">
            {/* Logo (Left Section) */}
            <Link to="/" className="navbar-brand p-0 d-flex align-items-center" style={{ textDecoration: 'none' }}>
              <Logo scale={0.82} />
            </Link>

            {/* Mobile Toggler */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarCollapse"
              aria-controls="navbarCollapse"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="fa fa-bars"></span>
            </button>

            {/* Navigation Links (Center Section) & Auth Buttons (Right Section) */}
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <div className="navbar-nav mx-auto py-2 py-lg-0 align-items-lg-center">
                <NavLink to="/" className="nav-item nav-link">Home</NavLink>
                <NavLink to="/about" className="nav-item nav-link">About</NavLink>
                <NavLink to="/car" className="nav-item nav-link">Cars</NavLink>
                <NavLink to="/feature" className="nav-item nav-link">Feature</NavLink>
                <NavLink to="/service" className="nav-item nav-link">Service</NavLink>
                <NavLink to="/faq" className="nav-item nav-link">Faq</NavLink>
                <NavLink to="/testimonial" className="nav-item nav-link">Testimonial</NavLink>
                <NavLink to="/contact" className="nav-item nav-link">ContactUs</NavLink>
              </div>

              {/* Authentication Buttons (Right Section) */}
              <div className="navbar-auth d-flex align-items-center py-2 py-lg-0">
                {user ? (
                  <div className="d-flex align-items-center gap-2">
                    {user.role === 'admin' ? (
                      <Link to="/admin" className="btn btn-outline-danger rounded-pill py-2 px-3 text-nowrap">
                        <i className="bi bi-shield-lock me-1"></i> Admin Panel
                      </Link>
                    ) : (
                      <Link to="/dashboard" className="btn btn-outline-primary rounded-pill py-2 px-3 text-nowrap">
                        <i className="bi bi-person-circle me-1"></i> {user.name?.split(' ')[0] || 'Dashboard'}
                      </Link>
                    )}
                    <button onClick={handleLogout} className="btn btn-secondary rounded-pill py-2 px-3 text-nowrap">
                      <i className="bi bi-box-arrow-right me-1"></i> Logout
                    </button>
                  </div>
                ) : (
                  <div className="d-flex align-items-center gap-2">
                    <Link to="/login" className="btn btn-outline-primary rounded-pill py-2 px-3 px-xl-4 text-nowrap" aria-label="Login">Login</Link>
                    <Link to="/register" className="btn btn-primary rounded-pill py-2 px-3 px-xl-4 text-nowrap shadow-sm" aria-label="Sign Up">Sign Up</Link>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}