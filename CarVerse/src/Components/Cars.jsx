import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { getCar } from "../Redux/ActionCreators/CarActionCreators"
import CarCard from './CarCard';
export default function Cars() {
    let CarStateData = useSelector(state => state.CarStateData)
    let dispatch = useDispatch()

    useEffect(() => {
        (() => {
            dispatch(getCar())
        })()
    }, [CarStateData.length])
    return (
        <div className="container-fluid categories pb-5 my-5">
            <div className="container pb-5">
                <div className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "800px" }}>
                    <h1 className="display-5 text-capitalize mb-3">Our <span className="text-primary">Vehicle</span></h1>
                    <p className="mb-0">Discover our extensive fleet of clean, reliable, and well-maintained vehicles, carefully selected to suit every travel need and budget. From compact city cars and spacious SUVs to premium luxury models, RentDrive offers the perfect ride for business trips, family vacations, and everyday journeys.</p>
                </div>
                <div className="categories-carousel wow fadeInUp" data-wow-delay="0.1s">
                    <div className="row">
                        {CarStateData.length === 0 ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className='col-xl-4 col-md-6 mb-4'>
                                    <div className="card border-0 shadow-sm">
                                        <div className="skeleton skeleton-img"></div>
                                        <div className="card-body">
                                            <div className="skeleton skeleton-text"></div>
                                            <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            CarStateData.filter(x => x.status).slice(0, 24).map((item) => {
                                return <div key={item.id} className='col-xl-4 col-md-6'>
                                    <CarCard item={item} />
                                </div>
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}