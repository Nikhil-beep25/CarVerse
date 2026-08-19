import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Logo from './Logo'

import { getSetting } from "../Redux/ActionCreators/SettingActionCreators"

export default function Footer() {
  const SettingStateData = useSelector(state => state.SettingStateData)
  const dispatch = useDispatch()

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

  const cleanWhatsappNumber = (settingData.whatsapp || '').replace(/[^0-9]/g, '')

  return (
    <>
      <footer className="container-fluid footer py-5 wow fadeIn" data-wow-delay="0.2s">
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-md-6 col-lg-6 col-xl-4">
              <div className="footer-item d-flex flex-column">
                <div className="footer-item">
                  <div className="mb-4 d-inline-block">
                    <Logo isDark={true} scale={0.9} />
                  </div>
                  <p className="mb-3">{settingData.siteName} is your trusted car rental partner, offering affordable, reliable, and well-maintained vehicles for business trips, vacations, and daily travel. Enjoy a smooth, convenient, and hassle-free driving experience with us.</p>
                </div>
                <div className="position-relative">
                  <input className="form-control rounded-pill w-100 py-3 ps-4 pe-5" type="text" placeholder="Enter your email" aria-label="Email Address for Newsletter" />
                  <button type="button" className="btn btn-secondary rounded-pill position-absolute top-0 end-0 py-2 mt-2 me-2" aria-label="Subscribe to Newsletter">Subscribe</button>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-6 col-xl-2">
              <div className="footer-item d-flex flex-column">
                <h4 className="text-white mb-4">Quick Links</h4>
                <Link to="/"><i className="fas fa-angle-right me-2"></i> Home</Link>
                <Link to="/about"><i className="fas fa-angle-right me-2"></i> About</Link>
                <Link to="/car"><i className="fas fa-angle-right me-2"></i> Cars</Link>
                <Link to="/feature"><i className="fas fa-angle-right me-2"></i> Feature</Link>
                <Link to="/service"><i className="fas fa-angle-right me-2"></i> Service</Link>
              </div>
            </div>
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="footer-item d-flex flex-column">
                <h4 className="text-white mb-4">Quick Links</h4>
                <Link to="/faq"><i className="fas fa-angle-right me-2"></i> Faq</Link>
                <Link to="/testimonial"><i className="fas fa-angle-right me-2"></i> Testimonial</Link>
                <Link to="/contact"><i className="fas fa-angle-right me-2"></i> Contact us</Link>
                <Link to="/tc"><i className="fas fa-angle-right me-2"></i> Terms & Conditions</Link>
                <Link to="/privacy-policy"><i className="fas fa-angle-right me-2"></i> Privacy Policy</Link>
              </div>
            </div>
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="footer-item d-flex flex-column">
                <h4 className="text-white mb-4">Contact Info</h4>
                {settingData.address && (
                  <a href={settingData.map1 || '#'} target='_blank' rel="noreferrer" className="mb-2"><i className="fa fa-map-marker-alt me-2"></i> {settingData.address}</a>
                )}
                <a href={`mailto:${settingData.email}`} className="mb-2"><i className="fas fa-envelope me-2"></i> {settingData.email}</a>
                <a href={`tel:${settingData.phone}`} className="mb-2"><i className="fas fa-phone me-2"></i> {settingData.phone}</a>
                <a href={cleanWhatsappNumber ? `https://wa.me/${cleanWhatsappNumber}` : '#'} target='_blank' rel="noreferrer" className="mb-3"><i className="bi bi-whatsapp me-2"></i> {settingData.whatsapp}</a>
                <div className="d-flex flex-wrap gap-2">
                  <a className="btn btn-secondary btn-md-square rounded-circle" href={settingData.github || 'https://github.com/Nikhil-beep25'} target='_blank' rel="noreferrer" aria-label="GitHub"><i className="fab fa-github text-white"></i></a>
                  <a className="btn btn-secondary btn-md-square rounded-circle" href={settingData.linkedin || 'https://www.linkedin.com/in/nikhil-bhadauriya-308414321'} target='_blank' rel="noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in text-white"></i></a>
                  <a className="btn btn-secondary btn-md-square rounded-circle" href={settingData.youtube || 'https://www.youtube.com/@ItsNikhilTech'} target='_blank' rel="noreferrer" aria-label="YouTube"><i className="fab fa-youtube text-white"></i></a>
                  <a className="btn btn-secondary btn-md-square rounded-circle" href={settingData.instagram || 'https://www.instagram.com/itsnikhil_tech'} target='_blank' rel="noreferrer" aria-label="Instagram"><i className="fab fa-instagram text-white"></i></a>
                  {settingData.facebook && <a className="btn btn-secondary btn-md-square rounded-circle" href={settingData.facebook} target='_blank' rel="noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f text-white"></i></a>}
                  {settingData.twitter && <a className="btn btn-secondary btn-md-square rounded-circle" href={settingData.twitter} target='_blank' rel="noreferrer" aria-label="Twitter"><i className="fab fa-twitter text-white"></i></a>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="container-fluid copyright py-4">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-md-6 text-center text-md-start mb-md-0">
              <span className="text-body"><a href="#" className="border-bottom text-white"><i className="fas fa-copyright text-light me-2"></i>{settingData.siteName}</a>, All right reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}