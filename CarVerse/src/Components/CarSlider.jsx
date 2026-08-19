import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';

import CarCard from './CarCard';
import { getCar } from "../Redux/ActionCreators/CarActionCreators"
let sliderOptions = {
    breakpoints: {
        640: {
            slidesPerView: 1,
            spaceBetween: 0,
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 20,
        }
    },
    loop: true,
    autoplay: {
        delay: 2000,
        disableOnInteraction: false,
    },
    modules: [Autoplay]
}
export default function CarSlider() {
    let CarStateData = useSelector(state => state.CarStateData)
    let dispatch = useDispatch()

    useEffect(() => {
        (() => {
            dispatch(getCar())
        })()
    }, [CarStateData.length])
    return (
        <div className="container-fluid categories pb-5">
            <div className="container pb-5">
                <div className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "800px" }}>
                    <h1 className="display-5 text-capitalize mb-3">Popular <span className="text-primary">Vehicle</span></h1>
                    <p className="mb-0">Discover our extensive fleet of clean, reliable, and well-maintained vehicles, carefully selected to suit every travel need and budget. From compact city cars and spacious SUVs to premium luxury models, RentDrive offers the perfect ride for business trips, family vacations, and everyday journeys.</p>
                </div>
                <div className="categories-carousel wow fadeInUp" data-wow-delay="0.1s">
                    <Swiper {...sliderOptions}>
                        {CarStateData.filter(x => x.status).map((item => {
                            return <SwiperSlide key={item.id}>
                                <CarCard item={item} />
                            </SwiperSlide>
                        }))}
                    </Swiper>
                </div>
            </div>
        </div>
    )
}