import React from 'react'
import { Link } from 'react-router-dom'

export default function CarCard({ item }) {
    const rawPic = (item.pic && item.pic.length > 0) 
        ? item.pic[0] 
        : (item.images && item.images.length > 0 ? item.images[0] : 'car/default_car.jpg')
    
    const imageUrl = rawPic.startsWith('http') ? rawPic : `${import.meta.env.VITE_APP_IMAGE_SERVER}${rawPic}`

    return (
        <div className="categories-item p-4">
            <div className="categories-item-inner">
                <div className="categories-img rounded-top">
                    <img 
                        src={imageUrl} 
                        className="img-fluid w-100 rounded-top" 
                        alt={item.name || "Car"} 
                        loading="lazy" 
                        style={{ height: 250, objectFit: 'cover' }} 
                        onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=60"
                        }}
                    />
                </div>
                <div className="categories-content rounded-bottom p-4">
                    <h5>{item.name}</h5>
                    <div className="mb-4">
                        <h6 className="bg-white text-primary rounded-pill py-2 mb-0"><del>&#8377;{item.baseRentAmount || item.pricePerDay}</del> &#8377;{item.finalRentAmount || item.pricePerDay}/Day <small><sup>{item.discount || 0}% Off</sup></small></h6>
                    </div>
                    <div className="row gy-2 gx-0 mb-4">
                        <div className="col-6 d-flex align-items-center">
                            <i className="fa fa-users text-dark"></i>
                            <span className="text-body text-start ms-1">{item.seatingCapacity || 5} Seat</span>
                        </div>
                        <div className="col-6 d-flex align-items-center">
                            <i className="fa fa-car text-dark"></i>
                            <span className="text-body text-start ms-1">{item.drivingMode || item.transmission || 'Manual'}</span>
                        </div>
                        <div className="col-6 d-flex align-items-center">
                            <i className="fa fa-gas-pump text-dark"></i>
                            <span className="text-body text-start ms-1">{item.type || item.fuelType || 'Petrol'}</span>
                        </div>
                        <div className="col-6 d-flex align-items-center">
                            <i className="fa fa-id-card text-dark"></i>
                            <span className="text-body text-start ms-1">{item.registrationNumber || 'Verified'}</span>
                        </div>
                    </div>
                    <Link to={`/car/${item.id || item._id}`} className="btn btn-primary rounded-pill d-flex justify-content-center py-3">Book Now</Link>
                </div>
            </div>
        </div>
    )
}