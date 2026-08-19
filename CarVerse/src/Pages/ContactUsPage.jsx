import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Breadcrum from '../Components/Breadcrum'
import { toast } from 'react-toastify'
import { getSetting } from '../Redux/ActionCreators/SettingActionCreators'

export default function ContactUsPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        project: '',
        subject: '',
        message: ''
    })

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Please fill in all required fields")
            return
        }
        toast.success("Thank you for reaching out! Our team will contact you shortly.")
        setFormData({
            name: '',
            email: '',
            phone: '',
            project: '',
            subject: '',
            message: ''
        })
    }

    return (
        <>
            <Breadcrum title="Contact US" />
            <div className="container-fluid contact py-5">
                <div className="container py-5">
                    <div className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.1s" style={{maxWidth: "800px"}}>
                        <h1 className="display-5 text-capitalize text-primary mb-3">Contact Us</h1>
                        <p className="mb-0">Have questions about our vehicle fleet, special corporate rentals, or roadside assistance? Send us a message and our support team will respond promptly.</p>
                    </div>
                    <div className="row g-5">
                        <div className="col-12 wow fadeInUp" data-wow-delay="0.1s">
                            <div className="row g-5">
                                <div className="col-md-6 col-lg-6 col-xl-3">
                                    <div className="contact-add-item p-4">
                                        <div className="contact-icon mb-4">
                                            <i className="fas fa-map-marker-alt fa-2x"></i>
                                        </div>
                                        <div>
                                            <h4>Address</h4>
                                            <p className="mb-0">{settingData.address || 'A-52, Sector 16, Noida, NCR'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.3s">
                                    <div className="contact-add-item p-4">
                                        <div className="contact-icon mb-4">
                                            <i className="fas fa-envelope fa-2x"></i>
                                        </div>
                                        <div>
                                            <h4>Mail Us</h4>
                                            <p className="mb-0">
                                                <a href={`mailto:${settingData.email}`} className="text-dark">{settingData.email}</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.5s">
                                    <div className="contact-add-item p-4">
                                        <div className="contact-icon mb-4">
                                            <i className="fa fa-phone-alt fa-2x"></i>
                                        </div>
                                        <div>
                                            <h4>Telephone</h4>
                                            <p className="mb-0">
                                                <a href={`tel:${settingData.phone}`} className="text-dark">{settingData.phone}</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.7s">
                                    <div className="contact-add-item p-4">
                                        <div className="contact-icon mb-4">
                                            <i className="bi bi-clock-history fa-2x"></i>
                                        </div>
                                        <div>
                                            <h4>Support Hours</h4>
                                            <p className="mb-0">24/7 Available</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 wow fadeInUp" data-wow-delay="0.1s">
                            <div className="bg-secondary p-5 rounded">
                                <h4 className="text-primary mb-4">Send Your Message</h4>
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-4">
                                        <div className="col-lg-12 col-xl-6">
                                            <div className="form-floating">
                                                <input type="text" className="form-control" id="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required/>
                                                <label htmlFor="name">Your Name*</label>
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-xl-6">
                                            <div className="form-floating">
                                                <input type="email" className="form-control" id="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required/>
                                                <label htmlFor="email">Your Email*</label>
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-xl-6">
                                            <div className="form-floating">
                                                <input type="tel" className="form-control" id="phone" value={formData.phone} onChange={handleChange} placeholder="Phone"/>
                                                <label htmlFor="phone">Your Phone</label>
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-xl-6">
                                            <div className="form-floating">
                                                <input type="text" className="form-control" id="project" value={formData.project} onChange={handleChange} placeholder="City / Rental Type"/>
                                                <label htmlFor="project">City / Rental Type</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-floating">
                                                <input type="text" className="form-control" id="subject" value={formData.subject} onChange={handleChange} placeholder="Subject"/>
                                                <label htmlFor="subject">Subject</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-floating">
                                                <textarea className="form-control" placeholder="Leave a message here" id="message" value={formData.message} onChange={handleChange} style={{height: "160px"}} required></textarea>
                                                <label htmlFor="message">Message*</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <button type="submit" className="btn btn-light w-100 py-3">Send Message</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-12 col-xl-1 wow fadeInUp" data-wow-delay="0.3s">
                            <div className="d-flex flex-xl-column align-items-center justify-content-center">
                                <a className="btn btn-xl-square btn-light rounded-circle mb-0 mb-xl-4 me-4 me-xl-0" href={settingData.github || 'https://github.com/Nikhil-beep25'} target="_blank" rel="noreferrer" aria-label="GitHub"><i className="fab fa-github"></i></a>
                                <a className="btn btn-xl-square btn-light rounded-circle mb-0 mb-xl-4 me-4 me-xl-0" href={settingData.linkedin || 'https://www.linkedin.com/in/nikhil-bhadauriya-308414321'} target="_blank" rel="noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                                <a className="btn btn-xl-square btn-light rounded-circle mb-0 mb-xl-4 me-4 me-xl-0" href={settingData.youtube || 'https://www.youtube.com/@ItsNikhilTech'} target="_blank" rel="noreferrer" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
                                <a className="btn btn-xl-square btn-light rounded-circle mb-0 mb-xl-0 me-0 me-xl-0" href={settingData.instagram || 'https://www.instagram.com/itsnikhil_tech'} target="_blank" rel="noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                            </div>
                        </div>
                        <div className="col-12 col-xl-5 wow fadeInUp" data-wow-delay="0.1s">
                            <div className="p-5 bg-light rounded">
                                <div className="bg-white rounded p-4 mb-4">
                                    <h4 className="mb-3">Our Main Office</h4>
                                    <div className="d-flex align-items-center flex-shrink-0 mb-3">
                                        <p className="mb-0 text-dark me-2">Address:</p><i className="fas fa-map-marker-alt text-primary me-2"></i><p className="mb-0">{settingData.address || 'Sector 16, Noida Expressway'}</p>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <p className="mb-0 text-dark me-2">Telephone:</p><i className="fa fa-phone-alt text-primary me-2"></i><p className="mb-0">{settingData.phone || '8077313959'}</p>
                                    </div>
                                </div>
                                <div className="bg-white rounded p-4 mb-4">
                                    <h4 className="mb-3">Airport Pickup Hub</h4>
                                    <div className="d-flex align-items-center mb-3">
                                        <p className="mb-0 text-dark me-2">Address:</p><i className="fas fa-map-marker-alt text-primary me-2"></i><p className="mb-0">IGI Airport Terminal 3, New Delhi</p>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <p className="mb-0 text-dark me-2">Telephone:</p><i className="fa fa-phone-alt text-primary me-2"></i><p className="mb-0">{settingData.phone || '8077313959'}</p>
                                    </div>
                                </div>
                                <div className="bg-white rounded p-4 mb-0">
                                    <h4 className="mb-3">Gurugram Center</h4>
                                    <div className="d-flex align-items-center mb-3">
                                        <p className="mb-0 text-dark me-2">Address:</p><i className="fas fa-map-marker-alt text-primary me-2"></i><p className="mb-0">Cyber Hub, DLF Phase 2, Gurugram</p>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <p className="mb-0 text-dark me-2">Telephone:</p><i className="fa fa-phone-alt text-primary me-2"></i><p className="mb-0">{settingData.phone || '8077313959'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}