import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../../Components/Admin/AdminSidebar';
import { toast } from 'react-toastify';

export default function AdminUserPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      let query = `?page=${page}&limit=10`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      if (roleFilter) query += `&role=${encodeURIComponent(roleFilter)}`;

      const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/admin/users${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data || []);
        if (data.pagination) setPagination(data.pagination);
      } else {
        toast.error(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      toast.error('Error connecting to users service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === false ? true : false;
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/admin/users/${user._id || user.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`User status updated to ${newStatus ? 'Active' : 'Inactive'}`);
        fetchUsers(pagination.page);
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (err) {
      toast.error('Failed to change user status');
    }
  };

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    setModalLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/admin/users/${user._id || user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setUserDetails(data.data);
      }
    } catch (err) {
      toast.error('Error fetching user summary');
    } finally {
      setModalLoading(false);
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
              <h5 className="mb-0 fw-bold"><i className="bi bi-people me-2"></i> Customer & User Management</h5>
              <span className="badge bg-light text-primary">{pagination.totalItems || users.length} Total Accounts</span>
            </div>

            <div className="card-body p-4">
              {/* Search and Filters */}
              <form onSubmit={handleSearchSubmit} className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by Name, Email, or Phone..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-search me-1"></i> Search
                    </button>
                  </div>
                </div>
                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="">All Roles</option>
                    <option value="user">Customers (user)</option>
                    <option value="Admin">Administrators (Admin)</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100"
                    onClick={() => {
                      setSearch('');
                      setRoleFilter('');
                      fetchUsers(1);
                    }}
                  >
                    Reset
                  </button>
                </div>
              </form>

              {/* Users Data Table */}
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>User</th>
                      <th>Email & Phone</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined Date</th>
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
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5 text-muted">
                          No users found matching the criteria.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u._id || u.id}>
                          <td>
                            <strong>{u.name}</strong>
                            <br />
                            <small className="text-muted">@{u.username || 'user'}</small>
                          </td>
                          <td>
                            <div>{u.email}</div>
                            <small className="text-muted">{u.phone || 'No phone'}</small>
                          </td>
                          <td>
                            <span className={`badge bg-${u.role === 'Admin' || u.role === 'Super Admin' ? 'primary' : 'secondary'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td>
                            <span className={`badge bg-${u.status !== false ? 'success' : 'danger'}`}>
                              {u.status !== false ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <small>{new Date(u.createdAt).toLocaleDateString()}</small>
                          </td>
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-info me-2"
                              onClick={() => handleViewUser(u)}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button
                              className={`btn btn-sm btn-outline-${u.status !== false ? 'warning' : 'success'}`}
                              onClick={() => handleToggleStatus(u)}
                              title={u.status !== false ? 'Deactivate Account' : 'Activate Account'}
                            >
                              <i className={`bi bi-${u.status !== false ? 'person-x' : 'person-check'}`}></i>
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
                      onClick={() => fetchUsers(pagination.page - 1)}
                    >
                      Previous
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => fetchUsers(pagination.page + 1)}
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

      {/* User Details Modal */}
      {selectedUser && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title"><i className="bi bi-person-badge me-2"></i> User Overview</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedUser(null)}></button>
              </div>
              <div className="modal-body p-4">
                {modalLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status"></div>
                  </div>
                ) : userDetails ? (
                  <div>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-light rounded-circle p-3 me-3 text-primary fs-3 fw-bold">
                        {userDetails.user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h5 className="mb-0">{userDetails.user.name}</h5>
                        <small className="text-muted">{userDetails.user.email}</small>
                      </div>
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <div className="p-2 border rounded bg-light">
                          <small className="text-muted d-block">Role</small>
                          <strong>{userDetails.user.role}</strong>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-2 border rounded bg-light">
                          <small className="text-muted d-block">Account Status</small>
                          <span className={`badge bg-${userDetails.user.status !== false ? 'success' : 'danger'}`}>
                            {userDetails.user.status !== false ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <h6 className="fw-bold border-top pt-3 mt-3">Activity Summary</h6>
                    <div className="d-flex justify-content-between py-1">
                      <span>Total Fleet Reservations</span>
                      <strong>{userDetails.analytics?.totalBookings || 0}</strong>
                    </div>
                    <div className="d-flex justify-content-between py-1">
                      <span>COD Payments Recorded</span>
                      <strong>{userDetails.analytics?.totalPayments || 0}</strong>
                    </div>
                    <div className="d-flex justify-content-between py-1 text-success fw-bold">
                      <span>Total Revenue Contribution</span>
                      <span>₹{userDetails.analytics?.totalSpent || 0}</span>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedUser(null)}>
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
