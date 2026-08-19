import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Breadcrum from '../../Components/Breadcrum'
import UserSidebar from '../../Components/User/UserSidebar'
import { toast } from 'react-toastify'

export default function BookingDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.AuthStateData)
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [showCancelModal, setShowCancelModal] = useState(false)

  const fetchBooking = async () => {
    try {
      // First attempt direct ID fetch
      const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/bookings/${id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await res.json()
      if (data.success && data.data) {
        setBooking(data.data)
      } else {
        // Fallback to mybookings list find
        const myRes = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/bookings/mybookings`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        })
        const myData = await myRes.json()
        if (myData.success && Array.isArray(myData.data)) {
          const found = myData.data.find(x => x.id === id || x._id === id)
          if (found) {
            setBooking(found)
          } else {
            toast.error("Booking not found")
            navigate('/dashboard/bookings')
          }
        }
      }
    } catch (error) {
      toast.error("Error fetching booking details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchBooking()
  }, [id, user, navigate])

  const handleCancelBooking = async (e) => {
    e.preventDefault()
    setCancelling(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/bookings/${id}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reason: cancelReason || 'Cancelled by customer' })
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Booking cancelled successfully")
        setShowCancelModal(false)
        fetchBooking()
      } else {
        toast.error(data.message || "Failed to cancel booking")
      }
    } catch (err) {
      toast.error("An error occurred while cancelling booking")
    } finally {
      setCancelling(false)
    }
  }

  if (!user) return null

  const getStatusBadgeClass = (status) => {
    const s = (status || '').toUpperCase()
    switch (s) {
      case 'CONFIRMED': return 'bg-success text-white'
      case 'ACTIVE': return 'bg-info text-white'
      case 'COMPLETED': return 'bg-primary text-white'
      case 'CANCELLED': return 'bg-danger text-white'
      case 'REJECTED': return 'bg-dark text-white'
      case 'PENDING':
      default: return 'bg-warning text-dark'
    }
  }

  const isCancellable = booking && ['PENDING', 'CONFIRMED', 'Pending', 'Confirmed'].includes(booking.bookingStatus)

  return (
    <>
      <Breadcrum title="Booking Details" />
      <div className="container-fluid my-5">
        <div className="row">
          <div className="col-md-3 mb-4">
            <UserSidebar />
          </div>
          <div className="col-md-9">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : booking ? (
              <div className="card shadow-sm border-0">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Booking Reference: #{(booking._id || booking.id || '').substring(0, 8).toUpperCase()}</h5>
                  <span className={`badge ${getStatusBadgeClass(booking.bookingStatus)} px-3 py-2 fs-6`}>
                    {booking.bookingStatus}
                  </span>
                </div>
                <div className="card-body p-4">
                  <div className="row g-4">
                    <div className="col-md-6 border-end">
                      <h6 className="text-muted mb-3"><i className="bi bi-car-front me-1"></i> Vehicle Details</h6>
                      <div className="d-flex align-items-center mb-3">
                        <img 
                          src={booking.car?.pic?.[0] ? `${import.meta.env.VITE_APP_IMAGE_SERVER}${booking.car.pic[0]}` : '/img/placeholder.png'} 
                          className="rounded me-3 border" 
                          style={{ width: '120px', height: '80px', objectFit: 'cover' }} 
                          alt="" 
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=60"
                          }}
                        />
                        <div>
                          <h5 className="mb-1">{booking.car?.name}</h5>
                          <span className="badge bg-secondary">{booking.car?.registrationNumber || 'Verified Fleet'}</span>
                        </div>
                      </div>
                      <p className="mb-1"><strong>Type:</strong> {booking.car?.type || 'Sedan'}</p>
                      <p className="mb-1"><strong>Transmission:</strong> {booking.car?.drivingMode || booking.car?.transmission || 'Manual'}</p>
                      <p className="mb-1"><strong>Seating:</strong> {booking.car?.seatingCapacity || 5} Seats</p>
                      <p className="mb-1"><strong>City:</strong> {booking.car?.city || 'Delhi NCR'}</p>
                    </div>
                    
                    <div className="col-md-6">
                      <h6 className="text-muted mb-3"><i className="bi bi-clock-history me-1"></i> Rental Schedule</h6>
                      <div className="mb-3">
                        <div className="d-flex align-items-start mb-2">
                          <i className="bi bi-geo-alt-fill text-primary mt-1 me-2"></i>
                          <div>
                            <strong>Pickup:</strong>
                            <p className="mb-0 text-muted">{new Date(booking.pickupDate).toLocaleString()}</p>
                            <small className="text-secondary">{booking.pickupLocation}</small>
                          </div>
                        </div>
                        <div className="d-flex align-items-start">
                          <i className="bi bi-geo-alt-fill text-danger mt-1 me-2"></i>
                          <div>
                            <strong>Dropoff:</strong>
                            <p className="mb-0 text-muted">{new Date(booking.dropoffDate).toLocaleString()}</p>
                            <small className="text-secondary">{booking.dropoffLocation}</small>
                          </div>
                        </div>
                      </div>
                      <p className="mb-1"><strong>Duration:</strong> {booking.totalDays} Days</p>
                      {booking.customerNotes && (
                        <p className="mb-1 text-muted"><strong>Customer Notes:</strong> {booking.customerNotes}</p>
                      )}
                    </div>

                    {booking.cancellationReason && (
                      <div className="col-12">
                        <div className="alert alert-danger mb-0">
                          <h6 className="alert-heading mb-1"><i className="bi bi-x-circle-fill me-1"></i> Booking Cancelled</h6>
                          <p className="mb-0"><strong>Reason:</strong> {booking.cancellationReason}</p>
                          {booking.cancelledAt && (
                            <small className="text-muted">Cancelled on: {new Date(booking.cancelledAt).toLocaleString()}</small>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="col-12 mt-4 pt-3 border-top">
                      <h6 className="text-muted mb-3"><i className="bi bi-receipt me-1"></i> Price Breakdown</h6>
                      <div className="table-responsive">
                        <table className="table table-sm table-borderless">
                          <tbody>
                            <tr>
                              <td>Daily Rate</td>
                              <td className="text-end">₹{booking.pricePerDay || booking.car?.pricePerDay || booking.car?.baseRentAmount} / day</td>
                            </tr>
                            <tr>
                              <td>Base Rental ({booking.totalDays} days)</td>
                              <td className="text-end">₹{booking.basePrice}</td>
                            </tr>
                            {booking.driverFee > 0 && (
                              <tr>
                                <td>Professional Driver Add-on</td>
                                <td className="text-end text-success">+ ₹{booking.driverFee}</td>
                              </tr>
                            )}
                            {booking.insurance > 0 && (
                              <tr>
                                <td>Premium Insurance Add-on</td>
                                <td className="text-end text-success">+ ₹{booking.insurance}</td>
                              </tr>
                            )}
                            {booking.discount > 0 && (
                              <tr>
                                <td>Discount Applied</td>
                                <td className="text-end text-danger">- ₹{booking.discount}</td>
                              </tr>
                            )}
                            {booking.tax > 0 && (
                              <tr>
                                <td>GST (18%)</td>
                                <td className="text-end">₹{booking.tax}</td>
                              </tr>
                            )}
                            {booking.securityDeposit > 0 && (
                              <tr>
                                <td>Security Deposit (Refundable)</td>
                                <td className="text-end">₹{booking.securityDeposit}</td>
                              </tr>
                            )}
                            <tr className="border-top fs-5">
                              <td className="pt-2"><strong>Total Amount</strong></td>
                              <td className="text-end pt-2 text-primary"><strong>₹{booking.totalPrice}</strong></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="col-12 d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                      <button className="btn btn-outline-secondary" onClick={() => navigate('/dashboard/bookings')}>
                        <i className="bi bi-arrow-left me-1"></i> Back to Bookings
                      </button>
                      {isCancellable && (
                        <button className="btn btn-outline-danger" onClick={() => setShowCancelModal(true)}>
                          <i className="bi bi-x-circle me-1"></i> Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Cancel Booking</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCancelModal(false)}></button>
              </div>
              <form onSubmit={handleCancelBooking}>
                <div className="modal-body p-4">
                  <p>Are you sure you want to cancel this booking? This action cannot be undone.</p>
                  <div className="mb-3">
                    <label className="form-label">Reason for cancellation (optional):</label>
                    <textarea 
                      className="form-control" 
                      rows="3" 
                      placeholder="Please let us know why you are cancelling..."
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCancelModal(false)}>
                    Close
                  </button>
                  <button type="submit" className="btn btn-danger" disabled={cancelling}>
                    {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
