import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../../Components/Admin/AdminSidebar';
import { toast } from 'react-toastify';

export default function AdminBookingPage() {
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [changingStatusId, setChangingStatusId] = useState(null);

  const fetchBookings = async (page = 1) => {
    setLoading(true);
    try {
      let query = `?page=${page}&limit=10`;
      if (statusFilter) query += `&status=${encodeURIComponent(statusFilter)}`;

      const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/bookings${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.data || []);
        if (data.pagination) setPagination(data.pagination);
      } else {
        toast.error(data.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      toast.error('Error connecting to bookings service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(1);
  }, [statusFilter]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setChangingStatusId(bookingId);
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Booking status updated to ${newStatus}`);
        fetchBookings(pagination.page);
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (err) {
      toast.error('Failed to change booking status');
    } finally {
      setChangingStatusId(null);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking record?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Booking deleted');
        fetchBookings(pagination.page);
      } else {
        toast.error(data.message || 'Failed to delete booking');
      }
    } catch (err) {
      toast.error('Error deleting booking');
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'CONFIRMED': return 'bg-primary text-white';
      case 'ACTIVE': return 'bg-info text-white';
      case 'COMPLETED': return 'bg-success text-white';
      case 'CANCELLED': return 'bg-danger text-white';
      case 'REJECTED': return 'bg-dark text-white';
      case 'PENDING':
      default: return 'bg-warning text-dark';
    }
  };

  return (
    <div className="container-fluid my-4">
      <div className="row g-4">
        <div className="col-lg-3">
          <AdminSidebar />
        </div>

        <div className="col-lg-9">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-primary text-white py-3 d-flex justify-content-between align-items-center flex-wrap">
              <h5 className="mb-0 fw-bold"><i className="bi bi-calendar-check me-2"></i> Fleet Booking Management</h5>
              <span className="badge bg-light text-primary">{pagination.totalItems || bookings.length} Total Bookings</span>
            </div>

            <div className="card-body p-4">
              {/* Filter Bar */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="ACTIVE">ACTIVE (On Road)</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => {
                      setStatusFilter('');
                      fetchBookings(1);
                    }}
                  >
                    Reset Filter
                  </button>
                </div>
              </div>

              {/* Bookings Data Table */}
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Ref & Car</th>
                      <th>Customer</th>
                      <th>Schedule</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th className="text-end">Manage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : bookings.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5 text-muted">
                          No bookings found.
                        </td>
                      </tr>
                    ) : (
                      bookings.map((b) => (
                        <tr key={b._id || b.id}>
                          <td>
                            <strong>#{b._id.substring(0, 8).toUpperCase()}</strong>
                            <br />
                            <small className="text-primary fw-bold">{b.car?.name || 'Fleet Car'}</small>
                          </td>
                          <td>
                            <div>{b.user?.name || 'Customer'}</div>
                            <small className="text-muted">{b.user?.phone || b.user?.email}</small>
                          </td>
                          <td>
                            <small className="d-block">{new Date(b.pickupDate).toLocaleDateString()} - {new Date(b.dropoffDate).toLocaleDateString()}</small>
                            <small className="text-muted">{b.totalDays} Days</small>
                          </td>
                          <td>
                            <strong className="text-success">₹{b.totalPrice}</strong>
                          </td>
                          <td>
                            <span className={`badge ${getStatusBadge(b.bookingStatus)} px-2 py-1`}>
                              {b.bookingStatus}
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="d-inline-flex align-items-center">
                              {/* Status Transition Select */}
                              {b.bookingStatus === 'PENDING' && (
                                <button
                                  className="btn btn-sm btn-outline-success me-1"
                                  disabled={changingStatusId === b._id}
                                  onClick={() => handleUpdateStatus(b._id, 'CONFIRMED')}
                                  title="Confirm Booking"
                                >
                                  <i className="bi bi-check-lg"></i> Confirm
                                </button>
                              )}
                              {b.bookingStatus === 'CONFIRMED' && (
                                <button
                                  className="btn btn-sm btn-outline-info me-1"
                                  disabled={changingStatusId === b._id}
                                  onClick={() => handleUpdateStatus(b._id, 'ACTIVE')}
                                  title="Activate Handover"
                                >
                                  <i className="bi bi-key"></i> Handover
                                </button>
                              )}
                              {b.bookingStatus === 'ACTIVE' && (
                                <button
                                  className="btn btn-sm btn-outline-primary me-1"
                                  disabled={changingStatusId === b._id}
                                  onClick={() => handleUpdateStatus(b._id, 'COMPLETED')}
                                  title="Complete Rental"
                                >
                                  <i className="bi bi-flag"></i> Complete
                                </button>
                              )}

                              <button
                                className="btn btn-sm btn-outline-info me-1"
                                onClick={() => setSelectedBooking(b)}
                                title="View Details"
                              >
                                <i className="bi bi-eye"></i>
                              </button>

                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteBooking(b._id)}
                                title="Delete Record"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                  <small className="text-muted">
                    Page {pagination.page} of {pagination.totalPages} ({pagination.totalItems} records)
                  </small>
                  <div className="btn-group">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      disabled={pagination.page <= 1}
                      onClick={() => fetchBookings(pagination.page - 1)}
                    >
                      Previous
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => fetchBookings(pagination.page + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Booking Details #{selectedBooking._id.substring(0, 8).toUpperCase()}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedBooking(null)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <h6 className="fw-bold text-muted">Vehicle Information</h6>
                    <p className="mb-1"><strong>Model:</strong> {selectedBooking.car?.name}</p>
                    <p className="mb-1"><strong>Registration:</strong> {selectedBooking.car?.registrationNumber || 'N/A'}</p>
                    <p className="mb-1"><strong>Rate:</strong> ₹{selectedBooking.pricePerDay || selectedBooking.car?.finalRentAmount}/day</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold text-muted">Customer Information</h6>
                    <p className="mb-1"><strong>Name:</strong> {selectedBooking.user?.name}</p>
                    <p className="mb-1"><strong>Email:</strong> {selectedBooking.user?.email}</p>
                    <p className="mb-1"><strong>Phone:</strong> {selectedBooking.user?.phone || 'N/A'}</p>
                  </div>
                  <div className="col-12 border-top pt-3">
                    <h6 className="fw-bold text-muted">Schedule & Locations</h6>
                    <div className="row g-2">
                      <div className="col-md-6">
                        <small className="text-muted d-block">Pickup</small>
                        <div>{new Date(selectedBooking.pickupDate).toLocaleString()}</div>
                        <small className="text-secondary">{selectedBooking.pickupLocation}</small>
                      </div>
                      <div className="col-md-6">
                        <small className="text-muted d-block">Dropoff</small>
                        <div>{new Date(selectedBooking.dropoffDate).toLocaleString()}</div>
                        <small className="text-secondary">{selectedBooking.dropoffLocation}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 border-top pt-3">
                    <h6 className="fw-bold text-muted">Financial Breakdown</h6>
                    <div className="d-flex justify-content-between py-1">
                      <span>Base Rental ({selectedBooking.totalDays} days)</span>
                      <span>₹{selectedBooking.basePrice}</span>
                    </div>
                    {selectedBooking.driverFee > 0 && (
                      <div className="d-flex justify-content-between py-1 text-success">
                        <span>Driver Add-on</span>
                        <span>+₹{selectedBooking.driverFee}</span>
                      </div>
                    )}
                    {selectedBooking.insurance > 0 && (
                      <div className="d-flex justify-content-between py-1 text-success">
                        <span>Insurance Add-on</span>
                        <span>+₹{selectedBooking.insurance}</span>
                      </div>
                    )}
                    {selectedBooking.tax > 0 && (
                      <div className="d-flex justify-content-between py-1">
                        <span>GST (18%)</span>
                        <span>₹{selectedBooking.tax}</span>
                      </div>
                    )}
                    <div className="d-flex justify-content-between py-2 border-top fw-bold fs-5 text-primary">
                      <span>Total Amount (COD)</span>
                      <span>₹{selectedBooking.totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedBooking(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
