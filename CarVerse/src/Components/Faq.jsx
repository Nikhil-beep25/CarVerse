import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSetting } from "../Redux/ActionCreators/SettingActionCreators"

const faqCategories = [
    { id: 'booking', name: 'Booking & Reservations', icon: 'fa-calendar-alt' },
    { id: 'payments', name: 'Payments & Refunds', icon: 'fa-credit-card' },
    { id: 'driver', name: 'Driver Requirements', icon: 'fa-id-card' },
    { id: 'vehicle', name: 'Vehicle Pickup & Return', icon: 'fa-car' },
    { id: 'insurance', name: 'Insurance & Safety', icon: 'fa-shield-alt' },
    { id: 'support', name: 'Account & Support', icon: 'fa-user-circle' }
];

const faqs = [
    // Booking & Reservations
    { category: 'booking', question: 'How do I book a car?', answer: 'Booking a car is simple! Create an account or log in, select your desired dates, browse available vehicles, choose the one you like, and follow the checkout process to secure your reservation.' },
    { category: 'booking', question: 'Can I cancel my booking?', answer: 'Yes, you can cancel your booking from your user dashboard under "Our Orders". Cancellations made 24 hours prior to pickup are fully refunded. Late cancellations may incur a fee.' },
    { category: 'booking', question: 'How can I extend my rental period?', answer: 'To extend your rental, please contact our support team at least 12 hours before your scheduled drop-off time. Extensions are subject to vehicle availability.' },

    // Payments & Refunds
    { category: 'payments', question: 'What payment methods are accepted?', answer: 'We accept all major credit and debit cards (Visa, MasterCard, American Express), as well as seamless payments via Razorpay including UPI and net banking.' },
    { category: 'payments', question: 'Is there a security deposit?', answer: 'A nominal security deposit is pre-authorized on your credit card at the time of pickup. This amount is released immediately upon safe return of the vehicle.' },
    { category: 'payments', question: 'How do refunds work?', answer: 'Refunds for cancellations or security deposits are processed automatically back to your original payment method. Please allow 5-7 business days for the funds to reflect in your account.' },

    // Driver Requirements
    { category: 'driver', question: 'What documents are required?', answer: 'You will need a valid, unexpired driver’s license, a secondary government-issued ID (like a Passport or Aadhar card), and the credit card used for the booking.' },
    { category: 'driver', question: 'Can someone else drive the rented vehicle?', answer: 'Yes, additional drivers can be added to the rental agreement during pickup. They must also present their valid driver’s license and meet our age requirements.' },

    // Vehicle Pickup & Return
    { category: 'vehicle', question: 'What happens if I return the car late?', answer: 'A grace period of 1 hour is provided. After that, late returns are subject to an hourly charge based on the vehicle\'s daily rate.' },
    { category: 'vehicle', question: 'Are fuel charges included?', answer: 'Our vehicles are provided with a full tank of fuel. You are required to return the vehicle with a full tank to avoid refueling surcharges.' },

    // Insurance & Safety
    { category: 'insurance', question: 'Is roadside assistance available?', answer: 'Absolutely! We offer 24/7 complimentary roadside assistance for all our rentals. The emergency contact number is provided in your rental agreement.' },
    { category: 'insurance', question: 'What kind of insurance is included?', answer: 'Standard comprehensive insurance is included with all rentals. You have the option to purchase additional premium coverage to reduce your liability in case of an accident.' },

    // Account & Support
    { category: 'support', question: 'How do I contact customer support?', answer: 'You can reach our support team 24/7 via the WhatsApp link in the footer, by emailing our support desk, or by calling our toll-free number.' },
    { category: 'support', question: 'How do I update my profile details?', answer: 'Log in to your account and navigate to the "Profile" section in your Dashboard to update your contact information, password, and driving credentials.' },
];

export default function Faq() {
    let [settingData, setSettingData] = useState({
        siteName: import.meta.env.VITE_APP_SITE_NAME,
    })
    
    let SettingStateData = useSelector(state => state.SettingStateData)
    let dispatch = useDispatch()
    
    let [activeCategory, setActiveCategory] = useState('booking');

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

    const filteredFaqs = faqs.filter(faq => faq.category === activeCategory);

    return (
        <>
            <div className="container-fluid Faq py-5">
                <div className="container py-5">
                    <div className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "800px" }}>
                        <h1 className="display-5 text-capitalize mb-3">Frequently Asked <span className="text-primary">Questions</span></h1>
                        <p className="mb-0">Find clear answers to the most common queries about bookings, payments, documents, and more. {settingData.siteName}'s FAQ section is here to help you enjoy a smooth, convenient, and worry-free rental experience.</p>
                    </div>
                    
                    <div className="row g-4 mb-5">
                        {faqCategories.map(cat => (
                            <div className="col-md-4 col-sm-6" key={cat.id}>
                                <div 
                                    className={`faq-category-card ${activeCategory === cat.id ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(cat.id)}
                                >
                                    <div className="faq-category-icon">
                                        <i className={`fas ${cat.icon}`}></i>
                                    </div>
                                    <h5 className="mb-0">{cat.name}</h5>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="row g-4 align-items-center">
                        <div className="col-lg-10 mx-auto">
                            <div className="accordion faq-accordion" id="accordionExample">
                                {filteredFaqs.map((item, index) => {
                                    return (
                                        <div className="accordion-item" key={index}>
                                            <h2 className="accordion-header" id={`heading${index}`}>
                                                <button 
                                                    className="accordion-button collapsed" 
                                                    type="button" 
                                                    data-bs-toggle="collapse" 
                                                    data-bs-target={`#collaps${index}`} 
                                                    aria-expanded="false" 
                                                    aria-controls={`collaps${index}`}
                                                >
                                                    {item.question}
                                                </button>
                                            </h2>
                                            <div 
                                                id={`collaps${index}`} 
                                                className="accordion-collapse collapse" 
                                                aria-labelledby={`heading${index}`} 
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body">
                                                    {item.answer}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}