import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import Breadcrum from '../../Components/Breadcrum';
import AdminSidebar from '../../Components/Admin/AdminSidebar';
import { toast } from 'react-toastify';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [datePreset, setDatePreset] = useState('all');
  const [customDates, setCustomDates] = useState({ dateFrom: '', dateTo: '' });
  const [year, setYear] = useState(new Date().getFullYear());

  const [overview, setOverview] = useState(null);
  const [bookingTrends, setBookingTrends] = useState(null);
  const [revenueTrends, setRevenueTrends] = useState(null);
  const [carPerformance, setCarPerformance] = useState([]);
  const [categoryPerformance, setCategoryPerformance] = useState([]);
  const [customerAnalytics, setCustomerAnalytics] = useState([]);

  const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      let queryParam = `?preset=${encodeURIComponent(datePreset)}`;
      if (datePreset === 'custom' && customDates.dateFrom && customDates.dateTo) {
        queryParam = `?dateFrom=${encodeURIComponent(customDates.dateFrom)}&dateTo=${encodeURIComponent(customDates.dateTo)}`;
      }

      const [overviewRes, bookingRes, revRes, carsRes, catsRes, custRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/admin/analytics/overview${queryParam}`, { headers: getAuthHeader() }),
        fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/admin/analytics/bookings?year=${year}`, { headers: getAuthHeader() }),
        fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/admin/analytics/revenue?year=${year}`, { headers: getAuthHeader() }),
        fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/admin/analytics/cars${queryParam}&limit=5`, { headers: getAuthHeader() }),
        fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/admin/analytics/categories${queryParam}`, { headers: getAuthHeader() }),
        fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/admin/analytics/customers${queryParam}&limit=5`, { headers: getAuthHeader() }),
      ]);

      const [overviewData, bookingData, revData, carsData, catsData, custData] = await Promise.all([
        overviewRes.json(),
        bookingRes.json(),
        revRes.json(),
        carsRes.json(),
        catsRes.json(),
        custRes.json(),
      ]);

      if (overviewData.success) setOverview(overviewData.data);
      if (bookingData.success) setBookingTrends(bookingData.data);
      if (revData.success) setRevenueTrends(revData.data);
      if (carsData.success) setCarPerformance(carsData.data || []);
      if (catsData.success) setCategoryPerformance(catsData.data || []);
      if (custData.success) setCustomerAnalytics(custData.data || []);
    } catch (err) {
      toast.error('Error loading business intelligence metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [datePreset, year]);

  const handleExportCSV = (reportType) => {
    let queryParam = `?format=csv&preset=${encodeURIComponent(datePreset)}`;
    if (datePreset === 'custom' && customDates.dateFrom && customDates.dateTo) {
      queryParam = `?format=csv&dateFrom=${encodeURIComponent(customDates.dateFrom)}&dateTo=${encodeURIComponent(customDates.dateTo)}`;
    }

    const exportUrl = `${import.meta.env.VITE_APP_BACKEND_SERVER}/admin/reports/${reportType}${queryParam}`;

    // Trigger download with auth token
    fetch(exportUrl, { headers: getAuthHeader() })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to export CSV');
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType}-report-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        toast.success(`${reportType.toUpperCase()} CSV Export downloaded successfully`);
      })
      .catch((err) => {
        toast.error('Failed to export CSV report');
      });
  };

  // Chart 1: Booking Volume Trend Chart
  const bookingChartData = {
    labels: bookingTrends?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Total Bookings',
        data: bookingTrends?.datasets?.map((d) => d.totalBookings) || Array(12).fill(0),
        backgroundColor: 'rgba(13, 110, 253, 0.7)',
        borderColor: 'rgb(13, 110, 253)',
        borderWidth: 1,
      },
      {
        label: 'Completed Rentals',
        data: bookingTrends?.datasets?.map((d) => d.completed) || Array(12).fill(0),
        backgroundColor: 'rgba(25, 135, 84, 0.7)',
        borderColor: 'rgb(25, 135, 84)',
        borderWidth: 1,
      },
      {
        label: 'Cancelled',
        data: bookingTrends?.datasets?.map((d) => d.cancelled) || Array(12).fill(0),
        backgroundColor: 'rgba(220, 53, 69, 0.7)',
        borderColor: 'rgb(220, 53, 69)',
        borderWidth: 1,
      },
    ],
  };

  // Chart 2: Cash Flow (COD Collected vs Pending)
  const revenueChartData = {
    labels: revenueTrends?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        type: 'line',
        label: 'Collected COD (₹)',
        data: revenueTrends?.datasets?.map((d) => d.collectedCOD) || Array(12).fill(0),
        borderColor: '#198754',
        backgroundColor: 'rgba(25, 135, 84, 0.15)',
        tension: 0.3,
        fill: true,
      },
      {
        type: 'bar',
        label: 'Pending COD (₹)',
        data: revenueTrends?.datasets?.map((d) => d.pendingCOD) || Array(12).fill(0),
        backgroundColor: 'rgba(255, 193, 7, 0.7)',
        borderColor: '#ffc107',
        borderWidth: 1,
      },
    ],
  };

  // Chart 3: Booking Status Breakdown (Doughnut)
  const statusDoughnutData = {
    labels: ['Completed', 'Confirmed', 'Active', 'Pending', 'Cancelled', 'Rejected'],
    datasets: [
      {
        data: [
          overview?.bookings?.completed || 0,
          overview?.bookings?.confirmed || 0,
          overview?.bookings?.active || 0,
          overview?.bookings?.pending || 0,
          overview?.bookings?.cancelled || 0,
          overview?.bookings?.rejected || 0,
        ],
        backgroundColor: ['#198754', '#0d6efd', '#0dcaf0', '#ffc107', '#dc3545', '#6c757d'],
      },
    ],
  };

  // Chart 4: Category Distribution
  const categoryChartData = {
    labels: categoryPerformance.map((c) => c.categoryName),
    datasets: [
      {
        label: 'Bookings by Category',
        data: categoryPerformance.map((c) => c.totalBookings),
        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'],
      },
    ],
  };

  return (
    <>
      <Breadcrum title="Business Intelligence & Analytics" />
      <div className="container-fluid my-4">
        <div className="row g-4">
          <div className="col-lg-3">
            <AdminSidebar />
          </div>

          <div className="col-lg-9">
            {/* Header & Date Range Control Bar */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body p-3">
                <div className="row g-3 align-items-center justify-content-between">
                  <div className="col-md-5">
                    <h5 className="mb-0 fw-bold text-primary">
                      <i className="bi bi-graph-up-arrow me-2"></i> Executive BI Dashboard
                    </h5>
                    <small className="text-muted">Real-time database aggregated reporting</small>
                  </div>

                  <div className="col-md-7">
                    <div className="d-flex flex-wrap gap-2 justify-content-md-end align-items-center">
                      <select
                        className="form-select form-select-sm w-auto"
                        value={datePreset}
                        onChange={(e) => setDatePreset(e.target.value)}
                      >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="thisMonth">This Month</option>
                        <option value="lastMonth">Last Month</option>
                        <option value="thisYear">This Year</option>
                        <option value="custom">Custom Range</option>
                      </select>

                      {datePreset === 'custom' && (
                        <div className="d-flex gap-1 align-items-center">
                          <input
                            type="date"
                            className="form-control form-control-sm"
                            value={customDates.dateFrom}
                            onChange={(e) => setCustomDates({ ...customDates, dateFrom: e.target.value })}
                          />
                          <span className="text-muted small">to</span>
                          <input
                            type="date"
                            className="form-control form-control-sm"
                            value={customDates.dateTo}
                            onChange={(e) => setCustomDates({ ...customDates, dateTo: e.target.value })}
                          />
                          <button className="btn btn-sm btn-primary" onClick={fetchAnalytics}>
                            Apply
                          </button>
                        </div>
                      )}

                      <select
                        className="form-select form-select-sm w-auto"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                      >
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading Analytics...</span>
                </div>
                <p className="mt-2 text-muted">Calculating real-time database aggregations...</p>
              </div>
            ) : (
              <>
                {/* KPI Metrics Cards */}
                <div className="row g-3 mb-4">
                  <div className="col-xl-3 col-md-6">
                    <div className="card shadow-sm border-0 border-start border-primary border-4 h-100">
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="text-muted small text-uppercase fw-bold">Total Booking Value</div>
                            <div className="fs-4 fw-bold text-primary">₹{(overview?.bookings?.totalBookingValue || 0).toLocaleString()}</div>
                            <small className="text-muted">{overview?.bookings?.total || 0} Total Reservations</small>
                          </div>
                          <div className="bg-primary-subtle text-primary p-3 rounded-circle">
                            <i className="bi bi-wallet2 fs-4"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-6">
                    <div className="card shadow-sm border-0 border-start border-success border-4 h-100">
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="text-muted small text-uppercase fw-bold">COD Collected</div>
                            <div className="fs-4 fw-bold text-success">₹{(overview?.payments?.collectedCOD || 0).toLocaleString()}</div>
                            <small className="text-success fw-semibold">{overview?.payments?.collectionRate || 0}% Collection Rate</small>
                          </div>
                          <div className="bg-success-subtle text-success p-3 rounded-circle">
                            <i className="bi bi-cash-coin fs-4"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-6">
                    <div className="card shadow-sm border-0 border-start border-warning border-4 h-100">
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="text-muted small text-uppercase fw-bold">Pending COD</div>
                            <div className="fs-4 fw-bold text-warning">₹{(overview?.payments?.pendingCOD || 0).toLocaleString()}</div>
                            <small className="text-muted">{overview?.payments?.pendingCount || 0} Invoices Pending</small>
                          </div>
                          <div className="bg-warning-subtle text-warning p-3 rounded-circle">
                            <i className="bi bi-hourglass-split fs-4"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-6">
                    <div className="card shadow-sm border-0 border-start border-info border-4 h-100">
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="text-muted small text-uppercase fw-bold">Fleet & Customers</div>
                            <div className="fs-4 fw-bold text-info">{overview?.cars?.total || 0} Vehicles</div>
                            <small className="text-muted">{overview?.users?.customers || 0} Registered Clients</small>
                          </div>
                          <div className="bg-info-subtle text-info p-3 rounded-circle">
                            <i className="bi bi-car-front fs-4"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Row 1: Booking Volume & COD Cash Flow */}
                <div className="row g-4 mb-4">
                  <div className="col-lg-6">
                    <div className="card shadow-sm border-0 h-100">
                      <div className="card-header bg-white py-3">
                        <h6 className="mb-0 fw-bold"><i className="bi bi-bar-chart-fill text-primary me-2"></i> {year} Monthly Booking Trend</h6>
                      </div>
                      <div className="card-body p-3">
                        <Bar
                          data={bookingChartData}
                          options={{
                            responsive: true,
                            plugins: { legend: { position: 'top' } },
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="card shadow-sm border-0 h-100">
                      <div className="card-header bg-white py-3">
                        <h6 className="mb-0 fw-bold"><i className="bi bi-currency-rupee text-success me-2"></i> {year} COD Cash Flow Trend</h6>
                      </div>
                      <div className="card-body p-3">
                        <Line
                          data={revenueChartData}
                          options={{
                            responsive: true,
                            plugins: { legend: { position: 'top' } },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Row 2: Status Doughnut & Category Breakdown */}
                <div className="row g-4 mb-4">
                  <div className="col-lg-4">
                    <div className="card shadow-sm border-0 h-100">
                      <div className="card-header bg-white py-3">
                        <h6 className="mb-0 fw-bold"><i className="bi bi-pie-chart-fill text-info me-2"></i> Booking Status Distribution</h6>
                      </div>
                      <div className="card-body p-3 d-flex justify-content-center align-items-center">
                        <div style={{ maxWidth: '280px' }}>
                          <Doughnut data={statusDoughnutData} options={{ responsive: true }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-8">
                    <div className="card shadow-sm border-0 h-100">
                      <div className="card-header bg-white py-3">
                        <h6 className="mb-0 fw-bold"><i className="bi bi-grid-fill text-warning me-2"></i> Rentals by Vehicle Category</h6>
                      </div>
                      <div className="card-body p-3">
                        {categoryPerformance.length === 0 ? (
                          <div className="text-center py-5 text-muted">No rental data by category available.</div>
                        ) : (
                          <Bar
                            data={categoryChartData}
                            options={{
                              responsive: true,
                              plugins: { legend: { display: false } },
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Table 1: Top Performing Fleet Vehicles */}
                <div className="card shadow-sm border-0 mb-4">
                  <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center flex-wrap">
                    <h6 className="mb-0 fw-bold"><i className="bi bi-trophy-fill text-warning me-2"></i> Top Fleet Vehicles by Rental Demand</h6>
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => handleExportCSV('cars')}
                    >
                      <i className="bi bi-file-earmark-spreadsheet me-1"></i> Export CSV
                    </button>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Vehicle</th>
                            <th>Category</th>
                            <th>Daily Rate</th>
                            <th>Total Bookings</th>
                            <th>Completed Rentals</th>
                            <th>Total Booking Value</th>
                            <th>Avg Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {carPerformance.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="text-center py-4 text-muted">No rental history available for vehicles.</td>
                            </tr>
                          ) : (
                            carPerformance.map((c, idx) => (
                              <tr key={idx}>
                                <td>
                                  <strong>{c.carName}</strong>
                                  <br />
                                  <small className="text-muted">{c.registrationNumber || 'N/A'}</small>
                                </td>
                                <td><span className="badge bg-light text-dark">{c.category || 'Standard'}</span></td>
                                <td>₹{c.pricePerDay}/day</td>
                                <td><span className="badge bg-primary-subtle text-primary">{c.totalBookings}</span></td>
                                <td><span className="badge bg-success-subtle text-success">{c.completedRentals}</span></td>
                                <td><strong>₹{c.totalBookingValue?.toLocaleString()}</strong></td>
                                <td>{c.avgDurationDays} Days</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Data Table 2: Top Customers by Spend & Bookings */}
                <div className="card shadow-sm border-0 mb-4">
                  <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center flex-wrap">
                    <h6 className="mb-0 fw-bold"><i className="bi bi-people-fill text-primary me-2"></i> Most Active Customers</h6>
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => handleExportCSV('customers')}
                    >
                      <i className="bi bi-file-earmark-spreadsheet me-1"></i> Export CSV
                    </button>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Customer</th>
                            <th>Phone</th>
                            <th>Total Bookings</th>
                            <th>Completed Rentals</th>
                            <th>Total Spent (Paid)</th>
                            <th>Total Booking Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customerAnalytics.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="text-center py-4 text-muted">No customer reservation history available.</td>
                            </tr>
                          ) : (
                            customerAnalytics.map((u, idx) => (
                              <tr key={idx}>
                                <td>
                                  <strong>{u.name}</strong>
                                  <br />
                                  <small className="text-muted">{u.email}</small>
                                </td>
                                <td>{u.phone || 'N/A'}</td>
                                <td><span className="badge bg-primary-subtle text-primary">{u.totalBookings}</span></td>
                                <td><span className="badge bg-success-subtle text-success">{u.completedRentals}</span></td>
                                <td><strong className="text-success">₹{u.totalSpent?.toLocaleString()}</strong></td>
                                <td><strong>₹{u.totalBookingValue?.toLocaleString()}</strong></td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
