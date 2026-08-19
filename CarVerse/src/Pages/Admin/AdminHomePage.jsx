import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../Components/Admin/AdminSidebar';
import { toast } from 'react-toastify';

export default function AdminHomePage() {
  const { user } = useSelector((state) => state.AuthStateData);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/admin/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        } else {
          toast.error(data.message || 'Failed to load dashboard metrics');
        }
      } catch (err) {
        toast.error('Network error fetching dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="container-fluid my-4">
      <div className="row g-4">
        <div className="col-lg-3">
          <AdminSidebar />
        </div>

        <div className="col-lg-9">
          {/* Top Admin Welcome Header */}
          <div className="card shadow-sm border-0 mb-4 bg-primary text-white p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div>
                <h3 className="fw-bold mb-1">Fleet & Operations Dashboard</h3>
                <p className="mb-0 text-white-50">
                  Welcome back, <strong>{user?.name || 'Administrator'}</strong> ({user?.role || 'Super Admin'})
                </p>
              </div>
              <div className="mt-2 mt-sm-0">
                <span className="badge bg-light text-primary px-3 py-2 fs-6">
                  <i className="bi bi-shield-check me-1"></i> System Secure
                </span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="row g-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="col-md-6 col-xl-3">
                  <div className="card border-0 shadow-sm p-4">
                    <div className="skeleton skeleton-text" style={{ width: '50%' }}></div>
                    <div className="skeleton skeleton-text" style={{ width: '80%', height: '30px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : stats ? (
            <>
              {/* Metric Cards Row 1: Fleet & Bookings */}
              <div className="row g-3 mb-4">
                <div className="col-md-6 col-xl-3">
                  <div className="card border-0 shadow-sm p-3 border-start border-primary border-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <small className="text-muted text-uppercase fw-bold">Active Fleet</small>
                        <h3 className="fw-bold text-primary mb-0">{stats.cars?.total || 0}</h3>
                        <small className="text-success">{stats.cars?.available || 0} Available</small>
                      </div>
                      <i className="bi bi-car-front fs-1 text-primary-emphasis opacity-50"></i>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-xl-3">
                  <div className="card border-0 shadow-sm p-3 border-start border-info border-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <small className="text-muted text-uppercase fw-bold">Active Rentals</small>
                        <h3 className="fw-bold text-info mb-0">{stats.bookings?.active || 0}</h3>
                        <small className="text-muted">{stats.bookings?.pending || 0} Pending Handover</small>
                      </div>
                      <i className="bi bi-key fs-1 text-info opacity-50"></i>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-xl-3">
                  <div className="card border-0 shadow-sm p-3 border-start border-success border-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <small className="text-muted text-uppercase fw-bold">COD Collections</small>
                        <h3 className="fw-bold text-success mb-0">₹{stats.payments?.totalCollected || 0}</h3>
                        <small className="text-success">{stats.payments?.paid || 0} Cash Receipts</small>
                      </div>
                      <i className="bi bi-cash-coin fs-1 text-success opacity-50"></i>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-xl-3">
                  <div className="card border-0 shadow-sm p-3 border-start border-warning border-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <small className="text-muted text-uppercase fw-bold">Pending Cash</small>
                        <h3 className="fw-bold text-warning mb-0">₹{stats.payments?.totalPendingAmount || 0}</h3>
                        <small className="text-muted">{stats.payments?.pending || 0} Uncollected</small>
                      </div>
                      <i className="bi bi-hourglass-split fs-1 text-warning opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric Cards Row 2: Customer & Booking Lifecycle Breakdown */}
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm p-4 h-100">
                    <h6 className="fw-bold mb-3"><i className="bi bi-people me-2 text-primary"></i> User Community</h6>
                    <div className="d-flex justify-content-between py-2 border-bottom">
                      <span>Total Registered Users</span>
                      <strong>{stats.users?.total || 0}</strong>
                    </div>
                    <div className="d-flex justify-content-between py-2 border-bottom">
                      <span>Active Customers</span>
                      <span className="text-success fw-bold">{stats.users?.customers || 0}</span>
                    </div>
                    <div className="d-flex justify-content-between py-2">
                      <span>Staff & Administrators</span>
                      <span className="text-primary fw-bold">{stats.users?.admins || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card border-0 shadow-sm p-4 h-100">
                    <h6 className="fw-bold mb-3"><i className="bi bi-speedometer2 me-2 text-info"></i> Fleet Status</h6>
                    <div className="d-flex justify-content-between py-2 border-bottom">
                      <span>Total Fleet Vehicles</span>
                      <strong>{stats.cars?.total || 0}</strong>
                    </div>
                    <div className="d-flex justify-content-between py-2 border-bottom">
                      <span>Currently On Road (Rented)</span>
                      <span className="text-info fw-bold">{stats.cars?.rented || 0}</span>
                    </div>
                    <div className="d-flex justify-content-between py-2">
                      <span>In Maintenance</span>
                      <span className="text-danger fw-bold">{stats.cars?.maintenance || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card border-0 shadow-sm p-4 h-100">
                    <h6 className="fw-bold mb-3"><i className="bi bi-calendar2-check me-2 text-success"></i> Bookings Lifecycle</h6>
                    <div className="d-flex justify-content-between py-2 border-bottom">
                      <span>Completed Rentals</span>
                      <span className="text-success fw-bold">{stats.bookings?.completed || 0}</span>
                    </div>
                    <div className="d-flex justify-content-between py-2 border-bottom">
                      <span>Confirmed Reservations</span>
                      <span className="text-primary fw-bold">{stats.bookings?.confirmed || 0}</span>
                    </div>
                    <div className="d-flex justify-content-between py-2">
                      <span>Cancelled / Rejected</span>
                      <span className="text-muted">{(stats.bookings?.cancelled || 0) + (stats.bookings?.rejected || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bookings Activity Table */}
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 fw-bold"><i className="bi bi-clock-history me-2 text-primary"></i> Recent Reservations</h6>
                  <Link to="/admin/analytics" className="btn btn-sm btn-outline-primary">Full Analytics</Link>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Car</th>
                          <th>Customer</th>
                          <th>Dates</th>
                          <th>Status</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentActivity?.bookings?.length > 0 ? (
                          stats.recentActivity.bookings.map((b) => (
                            <tr key={b._id || b.id}>
                              <td>
                                <strong>{b.car?.name || 'Fleet Car'}</strong>
                                <br />
                                <small className="text-muted">{b.car?.registrationNumber || 'Verified'}</small>
                              </td>
                              <td>
                                <div>{b.user?.name || 'Customer'}</div>
                                <small className="text-muted">{b.user?.email}</small>
                              </td>
                              <td>
                                <small>{new Date(b.pickupDate).toLocaleDateString()} - {new Date(b.dropoffDate).toLocaleDateString()}</small>
                              </td>
                              <td>
                                <span className={`badge bg-${b.bookingStatus === 'COMPLETED' ? 'success' : b.bookingStatus === 'ACTIVE' ? 'info' : b.bookingStatus === 'CONFIRMED' ? 'primary' : b.bookingStatus === 'CANCELLED' ? 'danger' : 'warning text-dark'}`}>
                                  {b.bookingStatus}
                                </span>
                              </td>
                              <td>
                                <strong className="text-primary">₹{b.totalPrice}</strong>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center py-4 text-muted">
                              No recent reservations found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="alert alert-warning">Failed to load real-time statistics.</div>
          )}
        </div>
      </div>
    </div>
  );
}