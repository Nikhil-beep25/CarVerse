import React from 'react'

import EnquiryForm from '../Components/EnquiryForm'
import Feature from '../Components/Feature'
import About from '../Components/About'
import Stats from '../Components/Stats'
import Service from '../Components/Service'
import CarSlider from '../Components/CarSlider'
import Process from '../Components/Process'
import Banner from '../Components/Banner'
import Testimonial from '../Components/Testimonial'
import { Link } from 'react-router-dom'
import Cars from '../Components/Cars'

export default function HomePage() {
  return (
    <>
      <div className="header-carousel">
        <div id="carouselId" className="carousel slide" data-bs-ride="carousel" data-bs-interval="false">
          <ol className="carousel-indicators">
            <li data-bs-target="#carouselId" data-bs-slide-to="0" className="active" aria-current="true" aria-label="First slide"></li>
            <li data-bs-target="#carouselId" data-bs-slide-to="1" aria-label="Second slide"></li>
          </ol>
          <div className="carousel-inner" role="listbox">
            <div className="carousel-item active">
              <img src="img/carousel-2.jpg" className="img-fluid w-100" alt="First slide" />
              <div className="carousel-caption">
                <div className="container py-4">
                  <div className="row g-5">
                    <div className="col-lg-6 fadeInLeft animated" data-animation="fadeInLeft" data-delay="1s" style={{ animationDelay: "1s" }}>
                      <h1 className='display-5 text-white'>Drive Your Journey with Confidence</h1>
                      <h5 className='text-white'>Reliable Cars • Affordable Prices • Hassle-Free Rentals</h5>
                      <p className='text-white'>Explore every destination with RentDrive's premium car rental services. Choose from a wide range of well-maintained vehicles, enjoy flexible rental plans, transparent pricing, and exceptional customer support for a safe and comfortable travel experience.</p>
                      <Link to="/car" className='btn btn-primary btn-lg'>Explore Our Latest Cars</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img src="img/carousel-1.jpg" className="img-fluid w-100" alt="First slide" />
              <div className="carousel-caption">
                <div className="container py-4">
                  <div className="row g-5">
                    <div className="col-lg-6 fadeInLeft animated" data-animation="fadeInLeft" data-delay="1s" style={{ animationDelay: "1s" }}>
                      <h1 className='display-5 text-white'>Your Perfect Ride, Ready When You Are</h1>
                      <h5 className='text-white'>Book Fast • Travel Smart • Drive Happy</h5>
                      <p className='text-white'>Whether it's a business trip, family vacation, or weekend getaway, RentDrive provides dependable vehicles to suit every journey. Experience easy online booking, competitive rates, and reliable service that keeps you moving with confidence.</p>
                      <Link to="/car" className='btn btn-primary btn-lg'>Explore Our Latest Cars</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Cars/>
      <Feature />
      <About />
      <Stats />
      <Service />
      <CarSlider />
      <Process />
      <Banner />
      <Testimonial />
    </>
  )
}