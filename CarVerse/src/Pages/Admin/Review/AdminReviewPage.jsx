import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../../Components/Admin/AdminSidebar';
import { toast } from 'react-toastify';

export default function AdminReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState('');

  const fetchReviews = async (page = 1) => {
    setLoading(true);
    try {
      let query = `?page=${page}&limit=10`;
      if (ratingFilter) query += `&rating=${encodeURIComponent(ratingFilter)}`;

      const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/reviews/admin/all${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setReviews(data.data || []);
        if (data.pagination) setPagination(data.pagination);
      } else {
        toast.error(data.message || 'Failed to fetch reviews');
      }
    } catch (err) {
      toast.error('Error connecting to reviews service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1);
  }, [ratingFilter]);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete/moderate this customer review?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Review deleted and car rating updated');
        fetchReviews(pagination.page);
      } else {
        toast.error(data.message || 'Failed to delete review');
      }
    } catch (err) {
      toast.error('Error deleting review');
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
              <h5 className="mb-0 fw-bold"><i className="bi bi-star me-2"></i> Customer Reviews & Moderation</h5>
              <span className="badge bg-light text-primary">{pagination.totalItems || reviews.length} Total Reviews</span>
            </div>

            <div className="card-body p-4">
              {/* Filter Bar */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                  >
                    <option value="">All Star Ratings</option>
                    <option value="5">5 Stars (★★★★★)</option>
                    <option value="4">4 Stars (★★★★☆)</option>
                    <option value="3">3 Stars (★★★☆☆)</option>
                    <option value="2">2 Stars (★★☆☆☆)</option>
                    <option value="1">1 Star (★☆☆☆☆)</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => {
                      setRatingFilter('');
                      fetchReviews(1);
                    }}
                  >
                    Reset Filter
                  </button>
                </div>
              </div>

              {/* Reviews Table */}
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Vehicle</th>
                      <th>Customer</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Date</th>
                      <th className="text-end">Moderation</th>
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
                    ) : reviews.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5 text-muted">
                          No reviews found.
                        </td>
                      </tr>
                    ) : (
                      reviews.map((r) => (
                        <tr key={r._id || r.id}>
                          <td>
                            <strong>{r.car?.name || 'Fleet Car'}</strong>
                            <br />
                            <small className="text-muted">{r.car?.registrationNumber || 'Verified'}</small>
                          </td>
                          <td>
                            <div>{r.user?.name || 'Customer'}</div>
                            <small className="text-muted">{r.user?.email}</small>
                          </td>
                          <td>
                            <div className="text-warning">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <i key={i} className={`bi bi-star${i < r.rating ? '-fill' : ''}`}></i>
                              ))}
                            </div>
                            <small className="fw-bold">{r.rating} / 5</small>
                          </td>
                          <td style={{ maxWidth: '300px' }}>
                            {r.title && <strong className="d-block text-dark">{r.title}</strong>}
                            <small className="text-secondary">{r.comment}</small>
                          </td>
                          <td>
                            <small>{new Date(r.createdAt).toLocaleDateString()}</small>
                          </td>
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteReview(r._id || r.id)}
                              title="Delete/Moderate Review"
                            >
                              <i className="bi bi-trash me-1"></i> Delete
                            </button>
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
                      onClick={() => fetchReviews(pagination.page - 1)}
                    >
                      Previous
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => fetchReviews(pagination.page + 1)}
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
    </div>
  );
}
