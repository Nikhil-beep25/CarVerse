import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserSidebar from '../../Components/User/UserSidebar';
import { toast } from 'react-toastify';

export default function MyWishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/wishlist`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setWishlist(data.data || []);
      } else {
        toast.error(data.message || 'Failed to load wishlist');
      }
    } catch (err) {
      toast.error('Network error loading wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (carId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/wishlist/${carId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.info('Vehicle removed from wishlist');
        setWishlist((prev) => prev.filter((item) => item.car?._id !== carId && item.car?.id !== carId));
      } else {
        toast.error(data.message || 'Failed to remove vehicle');
      }
    } catch (err) {
      toast.error('Error removing vehicle from wishlist');
    }
  };

  return (
    <div className="container-fluid my-4">
      <div className="row g-4">
        <div className="col-lg-3">
          <UserSidebar />
        </div>

        <div className="col-lg-9">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-primary text-white py-3 d-flex justify-content-between align-items-center flex-wrap">
              <h5 className="mb-0 fw-bold"><i className="bi bi-heart me-2"></i> My Saved Wishlist</h5>
              <span className="badge bg-light text-primary">{wishlist.length} Vehicles Saved</span>
            </div>

            <div className="card-body p-4">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : wishlist.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-heartbreak fs-1 text-muted d-block mb-3"></i>
                  <h5>Your wishlist is currently empty</h5>
                  <p className="text-muted">Explore our luxury & standard fleet and save your favorite rides!</p>
                  <Link to="/car" className="btn btn-primary px-4 py-2 mt-2">
                    <i className="bi bi-car-front me-1"></i> Browse Fleet
                  </Link>
                </div>
              ) : (
                <div className="row g-4">
                  {wishlist.map((item) => {
                    const car = item.car;
                    if (!car) return null;
                    const carId = car._id || car.id;
                    return (
                      <div key={item._id || item.id} className="col-md-6 col-xl-4">
                        <div className="card h-100 border-0 shadow-sm overflow-hidden position-relative">
                          <button
                            onClick={() => handleRemove(carId)}
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle shadow-sm"
                            style={{ width: '32px', height: '32px', padding: 0, zIndex: 10 }}
                            title="Remove from Wishlist"
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>

                          <img
                            src={car.pic?.[0] ? `${import.meta.env.VITE_APP_IMAGE_SERVER}${car.pic[0]}` : '/img/placeholder.png'}
                            className="card-img-top"
                            alt={car.name}
                            style={{ height: '180px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=60';
                            }}
                          />

                          <div className="card-body p-3 d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="badge bg-secondary-subtle text-dark small">{car.brand?.name || 'Brand'}</span>
                              <div className="text-warning small">
                                <i className="bi bi-star-fill me-1"></i>
                                <strong>{car.rating || 'New'}</strong>
                              </div>
                            </div>

                            <h6 className="card-title fw-bold mb-2">{car.name}</h6>

                            <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                              <div>
                                <span className="fs-5 fw-bold text-primary">₹{car.finalRentAmount || car.pricePerDay || car.baseRentAmount}</span>
                                <small className="text-muted"> / Day</small>
                              </div>
                              <Link to={`/car/${carId}`} className="btn btn-sm btn-primary">
                                Rent Now
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
