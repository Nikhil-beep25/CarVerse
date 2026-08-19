import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { getSetting } from "../Redux/ActionCreators/SettingActionCreators"
export default function About() {
    let [settingData, setSettingData] = useState({
        siteName: import.meta.env.VITE_APP_SITE_NAME,
    })
    let SettingStateData = useSelector(state => state.SettingStateData)
    let dispatch = useDispatch()

    useEffect(() => {
        (() => {
            dispatch(getSetting())
            if (SettingStateData.length) {
                let items = {}
                Object.keys(settingData).forEach(key => items[key] = SettingStateData[0][key] || settingData[key])
                setSettingData({ ...items })
            }
        })()
    }, [SettingStateData.length])
    return (
        <div className="container-fluid overflow-hidden about py-5">
            <div className="container py-5">
                <div className="row g-5">
                    <div className="col-xl-6 wow fadeInLeft" data-wow-delay="0.2s">
                        <div className="about-item">
                            <div className="pb-5">
                                <h1 className="display-5 text-capitalize">{settingData.siteName} <span className="text-primary">About</span></h1>
                                <p className="mb-0">{settingData.siteName} is committed to providing reliable, affordable, and hassle-free car rental services for business trips, family vacations, and everyday travel. Our diverse fleet of well-maintained vehicles ensures every customer enjoys a safe, comfortable, and convenient driving experience.</p>
                            </div>
                            <div className="row g-4">
                                <div className="col-lg-6">
                                    <div className="about-item-inner border p-4">
                                        <div className="about-icon mb-4">
                                            <img src="img/about-icon-1.png" className="img-fluid w-50 h-50" alt="Icon" />
                                        </div>
                                        <h5 className="mb-3">Our Vision</h5>
                                        <p className="mb-0">To become the most trusted and preferred car rental company by delivering innovative, reliable, and customer-focused mobility solutions.</p>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="about-item-inner border p-4">
                                        <div className="about-icon mb-4">
                                            <img src="img/about-icon-2.png" className="img-fluid h-50 w-50" alt="Icon" />
                                        </div>
                                        <h5 className="mb-3">Our Mision</h5>
                                        <p className="mb-0">To provide safe, affordable, and dependable car rental services that deliver convenience, comfort, and exceptional customer satisfaction.</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-item my-4">At {settingData.siteName}, customer satisfaction is our highest priority. We combine transparent pricing, flexible rental plans, easy online booking, and dedicated support to make every journey smooth and enjoyable. Whether you need a car for a few hours or several weeks, we're here to keep you moving. </p>
                            <div className="row g-4">
                                <div className="col-lg-4">
                                    <div className="text-center rounded bg-secondary p-4">
                                        <h1 className="display-6 text-white">5</h1>
                                        <h5 className="text-light mb-0">Years Of Experience</h5>
                                    </div>
                                </div>
                                <div className="col-lg-8">
                                    <div className="rounded">
                                        <p className="mb-2"><i className="fa fa-check-circle text-primary me-1"></i> Extensive fleet of clean, modern, and regularly maintained vehicles.</p>
                                        <p className="mb-2"><i className="fa fa-check-circle text-primary me-1"></i>Transparent pricing with no hidden charges or unexpected fees.</p>
                                        <p className="mb-2"><i className="fa fa-check-circle text-primary me-1"></i> Quick and simple online booking with instant confirmation.</p>
                                        <p className="mb-0"><i className="fa fa-check-circle text-primary me-1"></i>Flexible rental options for hourly, daily, weekly, and monthly needs.</p>
                                        <p className="mb-0"><i className="fa fa-check-circle text-primary me-1"></i>24/7 customer support and roadside assistance for complete peace of mind.</p>
                                    </div>
                                </div>
                                <div className="col-lg-5 d-flex align-items-center">
                                    <Link to="/about" className="btn btn-primary rounded py-3 px-5">More About Us</Link>
                                </div>
                                <div className="col-lg-7">
                                    <div className="d-flex align-items-center">
                                        <img src="img/attachment-img.jpg" className="img-fluid rounded-circle border border-4 border-secondary" style={{ width: "100px", height: "100px" }} alt="Image" />
                                        <div className="ms-4">
                                            <h4>Vishank Chauhan</h4>
                                            <p className="mb-0">{settingData.siteName} Founder</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6 wow fadeInRight" data-wow-delay="0.2s">
                        <div className="about-img">
                            <div className="img-1">
                                <img src="img/about-img.jpg" className="img-fluid rounded h-100 w-100" alt="" />
                            </div>
                            <div className="img-2">
                                <img src="img/about-img-1.jpg" className="img-fluid rounded w-100" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}