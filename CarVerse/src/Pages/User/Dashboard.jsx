import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Breadcrum from '../../Components/Breadcrum'
import UserSidebar from '../../Components/User/UserSidebar'
import { updateProfile } from '../../Redux/Reducers/AuthSlice'

export default function Dashboard() {
  const { user } = useSelector(state => state.AuthStateData)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      })
    }
  }, [user, navigate])

  if (!user) return null

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await dispatch(updateProfile(formData)).unwrap()
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (err) {
      toast.error(err || 'Failed to update profile')
    }
  }

  return (
    <>
      <Breadcrum title="User Dashboard" />
      <div className="container-fluid my-5">
        <div className="row">
          <div className="col-md-3 mb-4">
            <UserSidebar />
          </div>
          <div className="col-md-9">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Profile Overview</h5>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="btn btn-sm btn-light"
                  >
                    <i className="bi bi-pencil-square me-1"></i> Edit Profile
                  </button>
                )}
              </div>
              <div className="card-body p-4">
                <div className="row">
                  <div className="col-md-4 text-center mb-4 d-flex flex-column align-items-center justify-content-center">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random&size=150`} 
                      alt="Profile" 
                      className="rounded-circle img-fluid border border-3 border-primary p-1 mb-2"
                      style={{ width: '130px', height: '130px', objectFit: 'cover' }}
                    />
                    <span className="badge bg-primary text-capitalize px-3 py-2">{user.role || 'User'}</span>
                  </div>
                  <div className="col-md-8">
                    {isEditing ? (
                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label className="form-label fw-bold">Full Name</label>
                          <input 
                            type="text" 
                            name="name" 
                            className="form-control" 
                            value={formData.name} 
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-bold">Email Address</label>
                          <input 
                            type="email" 
                            className="form-control" 
                            value={user.email} 
                            disabled 
                            readOnly
                          />
                          <small className="text-muted">Email cannot be modified.</small>
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-bold">Phone Number</label>
                          <input 
                            type="text" 
                            name="phone" 
                            className="form-control" 
                            value={formData.phone} 
                            onChange={handleChange}
                            placeholder="+91 9876543210"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-bold">Address</label>
                          <textarea 
                            name="address" 
                            className="form-control" 
                            rows="2"
                            value={formData.address} 
                            onChange={handleChange}
                            placeholder="Street, City, State, ZIP"
                          ></textarea>
                        </div>
                        <div className="d-flex gap-2">
                          <button type="submit" className="btn btn-primary px-4">
                            Save Changes
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setIsEditing(false)} 
                            className="btn btn-outline-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <h4 className="fw-bold mb-3">{user.name}</h4>
                        <p className="mb-2"><i className="bi bi-envelope text-primary me-2"></i> <strong>Email:</strong> {user.email}</p>
                        <p className="mb-2"><i className="bi bi-telephone text-primary me-2"></i> <strong>Phone:</strong> {user.phone || 'Not provided'}</p>
                        <p className="mb-2"><i className="bi bi-geo-alt text-primary me-2"></i> <strong>Address:</strong> {user.address || 'Not provided'}</p>
                        <p className="mb-2"><i className="bi bi-person-check text-primary me-2"></i> <strong>Account Status:</strong> <span className="text-success text-capitalize">{user.accountStatus || 'Active'}</span></p>
                      </>
                    )}
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
