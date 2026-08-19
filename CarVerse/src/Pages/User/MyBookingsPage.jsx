import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Breadcrum from '../../Components/Breadcrum'
import UserSidebar from '../../Components/User/UserSidebar'
import { toast } from 'react-toastify'

export default function MyBookingsPage() {
  const { user } = useSelector(state => state.AuthStateData)
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchBookings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/bookings/mybookings`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        })
        const data = await res.json()
        if (data.success) {
          setBookings(data.data || [])
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error("Failed to fetch bookings")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [user, navigate])

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

  if (!user) return null

  return (
    <>
      <Breadcrum title="My Bookings" />
      <div className="container-fluid my-5">
        <div className="row">
          <div className="col-md-3 mb-4">
            <UserSidebar />
          </div>
          <div className="col-md-9">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Booking History</h5>
                <span className="badge bg-light text-dark">{bookings.length} Total Bookings</span>
              </div>
              <div className="card-body">
                {loading ? (
                   Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="card border-0 shadow-sm mb-3">
                      <div className="card-body">
                        <div className="skeleton skeleton-text" style={{ width: '30%' }}></div>
                        <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
                        <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                  ))
                ) : bookings.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-calendar-x text-muted" style={{ fontSize: '3rem' }}></i>
                    <h5 className="mt-3 text-muted">No Bookings Found</h5>
                    <p className="text-muted">You haven't made any vehicle reservations yet.</p>
                    <button className="btn btn-primary mt-2" onClick={() => navigate('/car')}>Browse Fleet</button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Car</th>
                          <th>Dates & Duration</th>
                          <th>Status</th>
                          <th>Total Amount</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(b => (
                          <tr key={b.id || b._id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={b.car?.pic?.[0] ? `${import.meta.env.VITE_APP_IMAGE_SERVER}${b.car.pic[0]}` : '/img/placeholder.png'} 
                                  className="rounded me-3 border" 
                                  style={{ width: '60px', height: '40px', objectFit: 'cover' }} 
                                  alt="" 
                                  onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=60"
                                  }}
                                />
                                <div>
                                  <h6 className="mb-0">{b.car?.name || 'Car'}</h6>
                                  <small className="text-muted">{b.car?.registrationNumber || 'Fleet Vehicle'}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <small className="d-block"><i className="bi bi-calendar-event me-1 text-primary"></i> {new Date(b.pickupDate).toLocaleDateString()} - {new Date(b.dropoffDate).toLocaleDateString()}</small>
                              <small className="d-block text-muted">{b.totalDays} Days</small>
                            </td>
                            <td>
                              <span className={`badge ${getStatusBadgeClass(b.bookingStatus)} px-2 py-1`}>
                                {b.bookingStatus}
                              </span>
                            </td>
                            <td>
                              <strong className="text-primary">₹{b.totalPrice}</strong>
                            </td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/dashboard/bookings/${b.id || b._id}`)}>
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
