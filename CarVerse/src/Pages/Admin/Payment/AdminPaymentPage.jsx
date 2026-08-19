import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../../Components/Admin/AdminSidebar';
import { toast } from 'react-toastify';

export default function AdminPaymentPage() {
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [collectingId, setCollectingId] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [receiptLoading, setReceiptLoading] = useState(false);

  const fetchPayments = async (page = 1) => {
    setLoading(true);
    try {
      let query = `?page=${page}&limit=10`;
      if (statusFilter) query += `&status=${encodeURIComponent(statusFilter)}`;

      const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/payments${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setPayments(data.data || []);
        if (data.pagination) setPagination(data.pagination);
      } else {
        toast.error(data.message || 'Failed to fetch payments');
      }
    } catch (err) {
      toast.error('Error connecting to payment service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(1);
  }, [statusFilter]);

  const handleCollectCash = async (paymentId) => {
    if (!window.confirm('Confirm that cash payment has been collected from the customer?')) return;
    setCollectingId(paymentId);
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/payments/${paymentId}/collect`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ notes: 'Cash collected by staff at handover depot' }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Cash collected! Receipt #${data.data.receiptNumber} generated.`);
        fetchPayments(pagination.page);
      } else {
        toast.error(data.message || 'Failed to collect payment');
      }
    } catch (err) {
      toast.error('Error processing cash collection');
    } finally {
      setCollectingId(null);
    }
  };

  const handleViewReceipt = async (paymentId) => {
    setReceiptLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/payments/${paymentId}/receipt`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setReceipt(data.data);
      } else {
        toast.error(data.message || 'Failed to load receipt');
      }
    } catch (err) {
      toast.error('Error retrieving payment receipt');
    } finally {
      setReceiptLoading(false);
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
              <h5 className="mb-0 fw-bold"><i className="bi bi-cash-coin me-2"></i> Cash on Delivery (COD) Ledger</h5>
              <span className="badge bg-light text-primary">{pagination.totalItems || payments.length} Total Records</span>
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
                    <option value="">All Payment Statuses</option>
                    <option value="PENDING">PENDING (Uncollected Cash)</option>
                    <option value="PAID">PAID (Cash Collected)</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => {
                      setStatusFilter('');
                      fetchPayments(1);
                    }}
                  >
                    Reset Filter
                  </button>
                </div>
              </div>

              {/* Payments Table */}
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Receipt / Ref</th>
                      <th>Customer</th>
                      <th>Vehicle</th>
                      <th>Amount</th>
                      <th>Payment Status</th>
                      <th className="text-end">Actions</th>
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
                    ) : payments.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5 text-muted">
                          No payment records found.
                        </td>
                      </tr>
                    ) : (
                      payments.map((p) => (
                        <tr key={p._id || p.id}>
                          <td>
                            <strong>{p.receiptNumber || 'PENDING'}</strong>
                            <br />
                            <small className="text-muted">Method: {p.paymentMethod || 'COD'}</small>
                          </td>
                          <td>
                            <div>{p.user?.name || 'Customer'}</div>
                            <small className="text-muted">{p.user?.email}</small>
                          </td>
                          <td>
                            <div>{p.booking?.car?.name || 'Fleet Car'}</div>
                            <small className="text-muted">{p.booking?.car?.registrationNumber || 'Verified'}</small>
                          </td>
                          <td>
                            <strong className="text-success fs-6">₹{p.amount}</strong>
                          </td>
                          <td>
                            <span className={`badge bg-${p.paymentStatus === 'PAID' ? 'success' : p.paymentStatus === 'CANCELLED' ? 'danger' : 'warning text-dark'} px-2 py-1`}>
                              {p.paymentStatus}
                            </span>
                          </td>
                          <td className="text-end">
                            {p.paymentStatus === 'PENDING' && (
                              <button
                                className="btn btn-sm btn-success me-2"
                                disabled={collectingId === p._id}
                                onClick={() => handleCollectCash(p._id)}
                                title="Mark Cash Collected"
                              >
                                <i className="bi bi-cash me-1"></i> {collectingId === p._id ? 'Collecting...' : 'Collect Cash'}
                              </button>
                            )}
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleViewReceipt(p._id)}
                              title="View Official Receipt"
                            >
                              <i className="bi bi-receipt me-1"></i> Receipt
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
                      onClick={() => fetchPayments(pagination.page - 1)}
                    >
                      Previous
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => fetchPayments(pagination.page + 1)}
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

      {/* Official Receipt Modal */}
      {receipt && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title"><i className="bi bi-receipt me-2"></i> Official Billing Receipt</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setReceipt(null)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="border rounded p-4 bg-light">
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                    <div>
                      <h4 className="fw-bold text-primary mb-0">CarVerse Fleet Rentals</h4>
                      <small className="text-muted">Official Cash on Delivery Billing Voucher</small>
                    </div>
                    <div className="text-end">
                      <h6 className="mb-0 fw-bold">{receipt.receiptNumber}</h6>
                      <small className="text-muted">Date: {new Date(receipt.generatedDate).toLocaleDateString()}</small>
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <small className="text-muted d-block">Billed To</small>
                      <strong>{receipt.customerName}</strong>
                      <div>{receipt.customerEmail}</div>
                      <div>{receipt.customerPhone}</div>
                    </div>
                    <div className="col-6 text-end">
                      <small className="text-muted d-block">Vehicle Reserved</small>
                      <strong>{receipt.carName}</strong>
                      <div>Reg: {receipt.registrationNumber}</div>
                      <div>Duration: {receipt.totalDays} Days</div>
                    </div>
                  </div>

                  <div className="table-responsive mb-3">
                    <table className="table table-sm table-bordered bg-white">
                      <thead className="table-light">
                        <tr>
                          <th>Description</th>
                          <th className="text-end">Amount (INR)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Base Rental Charge ({receipt.totalDays} Days)</td>
                          <td className="text-end">₹{receipt.breakdown?.basePrice}</td>
                        </tr>
                        {receipt.breakdown?.driverFee > 0 && (
                          <tr>
                            <td>Driver Assistance Fee</td>
                            <td className="text-end">₹{receipt.breakdown?.driverFee}</td>
                          </tr>
                        )}
                        {receipt.breakdown?.insurance > 0 && (
                          <tr>
                            <td>Comprehensive Insurance</td>
                            <td className="text-end">₹{receipt.breakdown?.insurance}</td>
                          </tr>
                        )}
                        {receipt.breakdown?.discount > 0 && (
                          <tr>
                            <td>Promotional Discount</td>
                            <td className="text-end text-danger">-₹{receipt.breakdown?.discount}</td>
                          </tr>
                        )}
                        {receipt.breakdown?.tax > 0 && (
                          <tr>
                            <td>GST (18%)</td>
                            <td className="text-end">₹{receipt.breakdown?.tax}</td>
                          </tr>
                        )}
                        {receipt.breakdown?.securityDeposit > 0 && (
                          <tr>
                            <td>Security Deposit (Refundable)</td>
                            <td className="text-end">₹{receipt.breakdown?.securityDeposit}</td>
                          </tr>
                        )}
                        <tr className="table-light fs-6">
                          <td><strong>Total Paid (Cash on Delivery)</strong></td>
                          <td className="text-end text-success"><strong>₹{receipt.paymentAmount}</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="d-flex justify-content-between align-items-center border-top pt-2">
                    <small className="text-muted">Payment Method: <strong>{receipt.paymentMethod}</strong></small>
                    <span className={`badge bg-${receipt.paymentStatus === 'PAID' ? 'success' : 'warning text-dark'} fs-6`}>
                      {receipt.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setReceipt(null)}>
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
