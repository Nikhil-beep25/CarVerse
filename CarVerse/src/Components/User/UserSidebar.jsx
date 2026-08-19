import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function UserSidebar() {
  const location = useLocation()
  
  return (
    <div className="list-group shadow-sm border-0">
      <Link 
        to="/dashboard" 
        className={`list-group-item list-group-item-action ${location.pathname === '/dashboard' ? 'active' : ''}`}
      >
        <i className="bi bi-person me-2"></i> My Profile
      </Link>
      <Link 
        to="/dashboard/bookings" 
        className={`list-group-item list-group-item-action ${location.pathname === '/dashboard/bookings' ? 'active' : ''}`}
      >
        <i className="bi bi-calendar-check me-2"></i> My Bookings
      </Link>
      <Link 
        to="/dashboard/wishlist" 
        className={`list-group-item list-group-item-action ${location.pathname === '/dashboard/wishlist' ? 'active' : ''}`}
      >
        <i className="bi bi-heart me-2"></i> My Wishlist
      </Link>
      <Link 
        to="/dashboard/settings" 
        className={`list-group-item list-group-item-action ${location.pathname === '/dashboard/settings' ? 'active' : ''}`}
      >
        <i className="bi bi-gear me-2"></i> Account Settings
      </Link>
    </div>
  )
}
