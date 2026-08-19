import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Breadcrum from '../Components/Breadcrum'
import { getCar } from '../Redux/ActionCreators/CarActionCreators'
import { toast } from 'react-toastify'

export default function CarDetailsPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const CarStateData = useSelector(state => state.CarStateData)
    const { user } = useSelector(state => state.AuthStateData)
    
    const [car, setCar] = useState(null)
    const [loading, setLoading] = useState(true)
    
    // Wishlist State
    const [inWishlist, setInWishlist] = useState(false)
    const [wishlistLoading, setWishlistLoading] = useState(false)

    // Reviews State
    const [reviews, setReviews] = useState([])
    const [reviewSummary, setReviewSummary] = useState({ averageRating: 0, totalReviews: 0, distribution: {} })
    const [reviewSort, setReviewSort] = useState('newest')
    const [completedBooking, setCompletedBooking] = useState(null)
    const [alreadyReviewed, setAlreadyReviewed] = useState(false)

    // Write Review Form State
    const [newRating, setNewRating] = useState(5)
    const [newTitle, setNewTitle] = useState('')
    const [newComment, setNewComment] = useState('')
    const [submittingReview, setSubmittingReview] = useState(false)
    
    // Booking Form State
    const [pickupDate, setPickupDate] = useState('')
    const [dropoffDate, setDropoffDate] = useState('')
    const [pickupLocation, setPickupLocation] = useState('')
    const [dropoffLocation, setDropoffLocation] = useState('')
    const [driverRequired, setDriverRequired] = useState(false)
    const [insurance, setInsurance] = useState(false)
    const [processing, setProcessing] = useState(false)

    useEffect(() => {
        if (CarStateData.length === 0) {
            dispatch(getCar())
        } else {
            const found = CarStateData.find(c => c.id === id || c._id === id)
            if (found) {
                setCar(found)
            } else {
                toast.error("Car not found")
                navigate('/car')
            }
            setLoading(false)
        }
    }, [CarStateData, id, dispatch, navigate])

    // Fetch Reviews & Aggregates
    const fetchReviews = async () => {
        try {
            const carId = car?._id || car?.id || id
            const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/reviews/car/${carId}?sort=${reviewSort}`)
            const data = await res.json()
            if (data.success) {
                setReviews(data.data || [])
                if (data.pagination?.summary) {
                    setReviewSummary(data.pagination.summary)
                }
            }
        } catch (err) {
            console.error("Error loading reviews", err)
        }
    }

    useEffect(() => {
        if (car) {
            fetchReviews()
        }
    }, [car, reviewSort])

    // Check Wishlist & Completed Booking Eligibility
    useEffect(() => {
        const checkEligibilityAndWishlist = async () => {
            if (!user) return
            const carId = car?._id || car?.id || id

            // Check Wishlist
            try {
                const wRes = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/wishlist/check/${carId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                const wData = await wRes.json()
                if (wData.success) {
                    setInWishlist(wData.data?.inWishlist || false)
                }
            } catch (err) {
                console.error("Wishlist check error", err)
            }

            // Check if user has a COMPLETED booking for this car
            try {
                const bRes = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/bookings/my-bookings`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                const bData = await bRes.json()
                if (bData.success && Array.isArray(bData.data)) {
                    const matched = bData.data.find(b => 
                        (b.car?._id === carId || b.car?.id === carId || b.car === carId) && 
                        (b.bookingStatus || '').toUpperCase() === 'COMPLETED'
                    )
                    if (matched) {
                        setCompletedBooking(matched)
                        // Check if user already reviewed this booking
                        const rRes = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/reviews/my-reviews`, {
                            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                        })
                        const rData = await rRes.json()
                        if (rData.success && Array.isArray(rData.data)) {
                            const reviewed = rData.data.some(r => r.booking === matched._id || r.booking?._id === matched._id)
                            setAlreadyReviewed(reviewed)
                        }
                    }
                }
            } catch (err) {
                console.error("Eligibility check error", err)
            }
        }

        if (car && user) {
            checkEligibilityAndWishlist()
        }
    }, [car, user, id])

    // Wishlist Toggle Handler
    const handleToggleWishlist = async () => {
        if (!user) {
            toast.info("Please login to save cars to your wishlist")
            navigate('/login')
            return
        }

        setWishlistLoading(true)
        const carId = car?._id || car?.id || id
        try {
            if (inWishlist) {
                const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/wishlist/${carId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                const data = await res.json()
                if (data.success) {
                    setInWishlist(false)
                    toast.info("Removed from your wishlist")
                }
            } else {
                const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/wishlist/${carId}`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                const data = await res.json()
                if (data.success) {
                    setInWishlist(true)
                    toast.success("Saved to your wishlist!")
                }
            }
        } catch (err) {
            toast.error("Error updating wishlist")
        } finally {
            setWishlistLoading(false)
        }
    }

    // Submit Review Handler
    const handleSubmitReview = async (e) => {
        e.preventDefault()
        if (!completedBooking) {
            toast.error("You can only review cars you have rented and completed.")
            return
        }

        setSubmittingReview(true)
        const carId = car?._id || car?.id || id
        try {
            const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    carId,
                    bookingId: completedBooking._id || completedBooking.id,
                    rating: Number(newRating),
                    title: newTitle,
                    comment: newComment,
                })
            })
            const data = await res.json()
            if (data.success) {
                toast.success("Thank you! Your verified review has been published.")
                setNewComment('')
                setNewTitle('')
                setAlreadyReviewed(true)
                fetchReviews()
            } else {
                toast.error(data.message || "Failed to submit review")
            }
        } catch (err) {
            toast.error("Error submitting review")
        } finally {
            setSubmittingReview(false)
        }
    }

    // Delete Own Review Handler
    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete your review?")) return
        try {
            const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            const data = await res.json()
            if (data.success) {
                toast.success("Review deleted")
                setAlreadyReviewed(false)
                fetchReviews()
            } else {
                toast.error(data.message || "Failed to delete review")
            }
        } catch (err) {
            toast.error("Error deleting review")
        }
    }

    const calculatePrice = () => {
        if (!car || !pickupDate || !dropoffDate) return 0
        const start = new Date(pickupDate)
        const end = new Date(dropoffDate)
        if (start >= end) return 0
        
        const diffTime = Math.abs(end - start)
        const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        const dailyRate = car.finalRentAmount || car.pricePerDay || car.baseRentAmount || 0
        const basePrice = dailyRate * totalDays
        const driverCost = driverRequired ? 500 * totalDays : 0
        const insuranceCost = insurance ? 200 * totalDays : 0
        const discountAmount = car.discount ? (basePrice * car.discount) / 100 : 0
        const deposit = car.securityDeposit || 0
        
        const subTotal = basePrice + driverCost + insuranceCost - discountAmount
        const tax = subTotal * 0.18
        return subTotal + tax + deposit
    }

    const handleBooking = async (e) => {
        e.preventDefault()
        if (!user) {
            toast.info("Please login to book a car")
            navigate('/login')
            return
        }

        const start = new Date(pickupDate)
        const end = new Date(dropoffDate)
        if (start >= end) {
            toast.error("Dropoff date must be after pickup date")
            return
        }

        setProcessing(true)
        try {
            const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    car: car?._id || car?.id || id,
                    pickupDate,
                    dropoffDate,
                    pickupLocation,
                    dropoffLocation,
                    driverFee: driverRequired,
                    insurance,
                    discount: car?.discount || 0
                })
            })
            
            const data = await res.json()
            if (data.success) {
                toast.success("Booking placed successfully with Cash on Delivery (COD)!")
                navigate('/dashboard/bookings')
            } else {
                toast.error(data.message || "Booking Failed")
            }
        } catch (error) {
            toast.error("An error occurred during booking")
        } finally {
            setProcessing(false)
        }
    }

    if (loading) return (
        <>
            <Breadcrum title="Car Details" />
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </>
    )

    if (!car) return null

    return (
        <>
            <Breadcrum title={`${car.name} Details`} />
            <div className="container-fluid py-5">
                <div className="container">
                    <div className="row g-5">
                        <div className="col-lg-7">
                            {/* Car Overview Card */}
                            <div className="card border-0 shadow-sm mb-4 position-relative">
                                <button
                                    onClick={handleToggleWishlist}
                                    disabled={wishlistLoading}
                                    className="btn btn-light position-absolute top-0 end-0 m-3 shadow-sm rounded-circle p-2"
                                    style={{ zIndex: 10, width: '45px', height: '45px' }}
                                    title={inWishlist ? "Remove from Wishlist" : "Save to Wishlist"}
                                >
                                    <i className={`bi bi-heart${inWishlist ? '-fill text-danger' : ' text-secondary'} fs-5`}></i>
                                </button>

                                <img 
                                  src={car.pic?.[0] ? `${import.meta.env.VITE_APP_IMAGE_SERVER}${car.pic[0]}` : '/img/placeholder.png'} 
                                  className="card-img-top" 
                                  alt={car.name} 
                                  style={{ maxHeight: '400px', objectFit: 'cover' }} 
                                  onError={(e) => {
                                      e.target.onerror = null
                                      e.target.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=60"
                                  }}
                                />
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h2 className="card-title mb-0">{car.name}</h2>
                                        <div className="d-flex align-items-center text-warning fs-5">
                                            <i className="bi bi-star-fill me-1"></i>
                                            <strong className="text-dark me-1">{reviewSummary.averageRating > 0 ? reviewSummary.averageRating : (car.rating || 'New')}</strong>
                                            <small className="text-muted fs-6">({reviewSummary.totalReviews || car.numOfReviews || 0})</small>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-wrap mb-4">
                                        <span className="badge bg-primary me-2 mb-2 p-2 fs-6"><i className="bi bi-car-front me-1"></i> {car.type || 'Sedan'}</span>
                                        <span className="badge bg-secondary me-2 mb-2 p-2 fs-6"><i className="bi bi-people me-1"></i> {car.seatingCapacity || 4} Seats</span>
                                        <span className="badge bg-info me-2 mb-2 p-2 fs-6"><i className="bi bi-gear me-1"></i> {car.drivingMode || 'Auto'}</span>
                                        <span className="badge bg-dark me-2 mb-2 p-2 fs-6"><i className="bi bi-geo-alt me-1"></i> {car.city || 'Delhi'}</span>
                                    </div>
                                    <h4 className="mb-3">Overview</h4>
                                    <p className="text-muted">
                                        Experience the thrill of driving the {car.name}. This vehicle is thoroughly sanitized, fully insured, and maintained for maximum reliability.
                                        Registration: {car.registrationNumber || 'Verified'}
                                    </p>
                                    
                                    <h4 className="mt-4 mb-3">Key Features</h4>
                                    <div className="row text-muted">
                                        <div className="col-sm-6 mb-2"><i className="bi bi-check-circle text-primary me-2"></i>Air Conditioning</div>
                                        <div className="col-sm-6 mb-2"><i className="bi bi-check-circle text-primary me-2"></i>Bluetooth & USB</div>
                                        <div className="col-sm-6 mb-2"><i className="bi bi-check-circle text-primary me-2"></i>GPS Navigation</div>
                                        <div className="col-sm-6 mb-2"><i className="bi bi-check-circle text-primary me-2"></i>24/7 Roadside Assistance</div>
                                    </div>
                                </div>
                            </div>

                            {/* Verified Reviews Section */}
                            <div className="card border-0 shadow-sm p-4 mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                                    <div>
                                        <h4 className="fw-bold mb-1">Customer Reviews & Ratings</h4>
                                        <div className="d-flex align-items-center">
                                            <span className="fs-2 fw-bold text-dark me-2">{reviewSummary.averageRating}</span>
                                            <div className="text-warning fs-5 me-2">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <i key={i} className={`bi bi-star${i < Math.round(reviewSummary.averageRating) ? '-fill' : ''}`}></i>
                                                ))}
                                            </div>
                                            <span className="text-muted">({reviewSummary.totalReviews} verified reviews)</span>
                                        </div>
                                    </div>

                                    <div className="mt-2 mt-sm-0">
                                        <select
                                            className="form-select form-select-sm"
                                            value={reviewSort}
                                            onChange={(e) => setReviewSort(e.target.value)}
                                        >
                                            <option value="newest">Newest First</option>
                                            <option value="highest">Highest Rating</option>
                                            <option value="lowest">Lowest Rating</option>
                                            <option value="oldest">Oldest First</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Rating Distribution Bars */}
                                {reviewSummary.totalReviews > 0 && (
                                    <div className="mb-4 pb-3 border-bottom">
                                        {[5, 4, 3, 2, 1].map((star) => {
                                            const pct = reviewSummary.distribution?.[star]?.percentage || 0
                                            const count = reviewSummary.distribution?.[star]?.count || 0
                                            return (
                                                <div key={star} className="d-flex align-items-center mb-2">
                                                    <small className="me-2 text-muted" style={{ width: '40px' }}>{star} ★</small>
                                                    <div className="progress flex-grow-1" style={{ height: '8px' }}>
                                                        <div
                                                            className="progress-bar bg-warning"
                                                            role="progressbar"
                                                            style={{ width: `${pct}%` }}
                                                        ></div>
                                                    </div>
                                                    <small className="ms-2 text-muted" style={{ width: '30px' }}>{count}</small>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}

                                {/* Write Verified Review Form (Only for completed renters who haven't reviewed) */}
                                {user && completedBooking && !alreadyReviewed && (
                                    <div className="bg-light p-3 rounded mb-4 border border-primary-subtle">
                                        <h6 className="fw-bold mb-2 text-primary">
                                            <i className="bi bi-shield-check me-1"></i> Write a Verified Review
                                        </h6>
                                        <p className="text-muted small mb-3">
                                            You completed a rental with this vehicle. Share your experience with future renters!
                                        </p>
                                        <form onSubmit={handleSubmitReview}>
                                            <div className="mb-3">
                                                <label className="form-label small fw-bold">Select Rating:</label>
                                                <div className="d-flex gap-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            className={`btn btn-sm ${newRating >= star ? 'btn-warning text-dark' : 'btn-outline-secondary'}`}
                                                            onClick={() => setNewRating(star)}
                                                        >
                                                            {star} <i className="bi bi-star-fill"></i>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="Review Title (Optional)"
                                                    value={newTitle}
                                                    onChange={(e) => setNewTitle(e.target.value)}
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <textarea
                                                    className="form-control form-control-sm"
                                                    rows="3"
                                                    placeholder="Describe your driving and rental experience..."
                                                    required
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                ></textarea>
                                            </div>

                                            <button
                                                type="submit"
                                                className="btn btn-sm btn-primary"
                                                disabled={submittingReview}
                                            >
                                                {submittingReview ? 'Submitting...' : 'Post Review'}
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {/* Reviews List */}
                                <div className="reviews-list">
                                    {reviews.length === 0 ? (
                                        <div className="text-center py-4 text-muted">
                                            <i className="bi bi-chat-square-text fs-2 d-block mb-2 text-secondary"></i>
                                            No reviews yet. Be the first to rent and review this vehicle!
                                        </div>
                                    ) : (
                                        reviews.map((r) => (
                                            <div key={r._id || r.id} className="border-bottom py-3">
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <div className="d-flex align-items-center">
                                                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2 fw-bold" style={{ width: '32px', height: '32px' }}>
                                                            {r.user?.name?.charAt(0) || 'U'}
                                                        </div>
                                                        <div>
                                                            <strong>{r.user?.name || 'Verified Customer'}</strong>
                                                            <span className="badge bg-success-subtle text-success ms-2 small">Verified Renter</span>
                                                        </div>
                                                    </div>
                                                    <small className="text-muted">{new Date(r.createdAt).toLocaleDateString()}</small>
                                                </div>

                                                <div className="text-warning mb-1">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <i key={i} className={`bi bi-star${i < r.rating ? '-fill' : ''}`}></i>
                                                    ))}
                                                    {r.title && <strong className="text-dark ms-2">{r.title}</strong>}
                                                </div>

                                                <p className="text-secondary mb-1">{r.comment}</p>

                                                {/* Author delete button */}
                                                {user && (r.user?._id === user._id || r.user === user._id) && (
                                                    <div className="text-end">
                                                        <button
                                                            className="btn btn-link text-danger p-0 small text-decoration-none"
                                                            onClick={() => handleDeleteReview(r._id || r.id)}
                                                        >
                                                            <i className="bi bi-trash me-1"></i> Delete My Review
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Booking Sidebar */}
                        <div className="col-lg-5">
                            <div className="card border-0 shadow-sm p-4 sticky-top" style={{ top: '100px' }}>
                                <h3 className="mb-3">Book This Car</h3>
                                
                                <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                                    <span className="fs-5 text-muted">Daily Rate</span>
                                    <span className="fs-3 fw-bold text-primary">₹{car.finalRentAmount || car.pricePerDay || car.baseRentAmount} <span className="fs-6 fw-normal text-muted">/ Day</span></span>
                                </div>

                                <div className="alert alert-info py-2 px-3 mb-3 d-flex align-items-center">
                                    <i className="bi bi-cash-stack fs-4 me-2 text-primary"></i>
                                    <div>
                                        <small className="fw-bold d-block">Payment Method: Cash on Delivery</small>
                                        <small className="text-muted">Pay conveniently in cash upon vehicle pickup.</small>
                                    </div>
                                </div>

                                <form onSubmit={handleBooking}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Pickup Date</label>
                                            <input type="date" className="form-control" required value={pickupDate} onChange={e => setPickupDate(e.target.value)} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Dropoff Date</label>
                                            <input type="date" className="form-control" required value={dropoffDate} onChange={e => setDropoffDate(e.target.value)} />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Pickup Location</label>
                                            <input type="text" className="form-control" placeholder="Enter pickup address" required value={pickupLocation} onChange={e => setPickupLocation(e.target.value)} />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Dropoff Location</label>
                                            <input type="text" className="form-control" placeholder="Enter dropoff address" required value={dropoffLocation} onChange={e => setDropoffLocation(e.target.value)} />
                                        </div>
                                        
                                        <div className="col-12 mt-3">
                                            <h6 className="mb-3">Add-ons</h6>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input" type="checkbox" id="driver" checked={driverRequired} onChange={e => setDriverRequired(e.target.checked)} />
                                                <label className="form-check-label d-flex justify-content-between" htmlFor="driver">
                                                    <span>Professional Driver</span>
                                                    <span className="text-muted">+₹500/day</span>
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="insurance" checked={insurance} onChange={e => setInsurance(e.target.checked)} />
                                                <label className="form-check-label d-flex justify-content-between" htmlFor="insurance">
                                                    <span>Full Comprehensive Insurance</span>
                                                    <span className="text-muted">+₹200/day</span>
                                                </label>
                                            </div>
                                        </div>

                                        {pickupDate && dropoffDate && (
                                            <div className="col-12 mt-3 pt-3 border-top">
                                                <div className="d-flex justify-content-between mb-1">
                                                    <span className="text-muted">Subtotal (with Add-ons)</span>
                                                    <span>₹{(calculatePrice() / 1.18).toFixed(0)}</span>
                                                </div>
                                                <div className="d-flex justify-content-between mb-1">
                                                    <span className="text-muted">GST (18%)</span>
                                                    <span>₹{(calculatePrice() - (calculatePrice() / 1.18)).toFixed(0)}</span>
                                                </div>
                                                <div className="d-flex justify-content-between fw-bold fs-5 mt-2 pt-2 border-top">
                                                    <span>Total (Pay on Delivery)</span>
                                                    <span className="text-primary">₹{calculatePrice().toFixed(0)}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="col-12 mt-4">
                                            <button type="submit" className="btn btn-primary w-100 py-3 fw-bold" disabled={processing}>
                                                {processing ? 'Confirming Reservation...' : 'Confirm Booking (Cash on Delivery)'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}