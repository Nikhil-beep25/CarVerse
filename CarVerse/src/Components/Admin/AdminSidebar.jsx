import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation()
  
  return (
    <>
      <div className="list-group shadow-sm border-0">
        <Link
          to="/admin"
          className={`mb-1 list-group-item list-group-item-action ${location.pathname === '/admin' ? 'active' : ''}`}
        >
          <i className="bi bi-speedometer2 fs-5"></i>
          <span className="float-end fw-semibold">Dashboard</span>
        </Link>
        <Link
          to="/admin/booking"
          className={`mb-1 list-group-item list-group-item-action ${location.pathname.startsWith('/admin/booking') ? 'active' : ''}`}
        >
          <i className="bi bi-calendar-check fs-5"></i>
          <span className="float-end fw-semibold">Bookings</span>
        </Link>
        <Link
          to="/admin/payment"
          className={`mb-1 list-group-item list-group-item-action ${location.pathname.startsWith('/admin/payment') ? 'active' : ''}`}
        >
          <i className="bi bi-cash-coin fs-5"></i>
          <span className="float-end fw-semibold">COD Payments</span>
        </Link>
        <Link
          to="/admin/review"
          className={`mb-1 list-group-item list-group-item-action ${location.pathname.startsWith('/admin/review') ? 'active' : ''}`}
        >
          <i className="bi bi-star fs-5"></i>
          <span className="float-end fw-semibold">Reviews</span>
        </Link>
        <Link
          to="/admin/car"
          className={`mb-1 list-group-item list-group-item-action ${location.pathname.startsWith('/admin/car') ? 'active' : ''}`}
        >
          <i className="bi bi-car-front fs-5"></i>
          <span className="float-end fw-semibold">Fleet Cars</span>
        </Link>
        <Link
          to="/admin/user"
          className={`mb-1 list-group-item list-group-item-action ${location.pathname.startsWith('/admin/user') ? 'active' : ''}`}
        >
          <i className="bi bi-people fs-5"></i>
          <span className="float-end fw-semibold">Users</span>
        </Link>
        <Link
          to="/admin/brand"
          className={`mb-1 list-group-item list-group-item-action ${location.pathname.startsWith('/admin/brand') ? 'active' : ''}`}
        >
          <i className="bi bi-award fs-5"></i>
          <span className="float-end fw-semibold">Brands</span>
        </Link>
        <Link
          to="/admin/category"
          className={`mb-1 list-group-item list-group-item-action ${location.pathname.startsWith('/admin/category') ? 'active' : ''}`}
        >
          <i className="bi bi-grid fs-5"></i>
          <span className="float-end fw-semibold">Categories</span>
        </Link>
        <Link
          to="/admin/analytics"
          className={`mb-1 list-group-item list-group-item-action ${location.pathname === '/admin/analytics' ? 'active' : ''}`}
        >
          <i className="bi bi-graph-up fs-5"></i>
          <span className="float-end fw-semibold">Analytics</span>
        </Link>
        <Link
          to="/admin/feature"
          className={`mb-1 list-group-item list-group-item-action ${location.pathname.startsWith('/admin/feature') ? 'active' : ''}`}
        >
          <i className="bi bi-check-circle fs-5"></i>
          <span className="float-end fw-semibold">Features</span>
        </Link>
        <Link
          to="/admin/service"
          className={`mb-1 list-group-item list-group-item-action ${location.pathname.startsWith('/admin/service') ? 'active' : ''}`}
        >
          <i className="bi bi-wrench-adjustable fs-5"></i>
          <span className="float-end fw-semibold">Services</span>
        </Link>
        <Link
          to="/admin/faq"
          className={`mb-1 list-group-item list-group-item-action ${location.pathname.startsWith('/admin/faq') ? 'active' : ''}`}
        >
          <i className="bi bi-question-circle fs-5"></i>
          <span className="float-end fw-semibold">FAQ</span>
        </Link>
        <Link
          to="/admin/setting"
          className={`mb-1 list-group-item list-group-item-action ${location.pathname.startsWith('/admin/setting') ? 'active' : ''}`}
        >
          <i className="bi bi-gear fs-5"></i>
          <span className="float-end fw-semibold">Settings</span>
        </Link>
      </div>
    </>
  );
}
