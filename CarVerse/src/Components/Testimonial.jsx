import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';

export default function Testimonial() {
    let sliderOptions = {
        breakpoints: {
            640: {
                slidesPerView: 1,
                spaceBetween: 0,
            },
            768: {
                slidesPerView: 2,
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
    return (
        <div className="container-fluid testimonial pb-5">
            <div className="container pb-5">
                <div className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "800px" }}>
                    <h1 className="display-5 text-capitalize mb-3">Our Clients<span className="text-primary"> Riviews</span></h1>
                    <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut amet nemo expedita asperiores commodi accusantium at cum harum, excepturi, quia tempora cupiditate! Adipisci facilis modi quisquam quia distinctio,
                    </p>
                </div>
                <div className="testimonial-carousel wow fadeInUp" data-wow-delay="0.1s">
                    <Swiper {...sliderOptions}>
                        <SwiperSlide>
                            <div className="testimonial-item">
                                <div className="testimonial-quote"><i className="fa fa-quote-right fa-2x"></i>
                                </div>
                                <div className="testimonial-inner p-4">
                                    <img src="img/testimonial-1.jpg" className="img-fluid" alt="" />
                                    <div className="ms-4">
                                        <h4>Person Name</h4>
                                        <p>Profession</p>
                                        <div className="d-flex text-primary">
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star text-body"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-top rounded-bottom p-4">
                                    <p className="mb-0">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam soluta neque ab repudiandae reprehenderit ipsum eos cumque esse repellendus impedit.</p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="testimonial-item">
                                <div className="testimonial-quote"><i className="fa fa-quote-right fa-2x"></i>
                                </div>
                                <div className="testimonial-inner p-4">
                                    <img src="img/testimonial-2.jpg" className="img-fluid" alt="" />
                                    <div className="ms-4">
                                        <h4>Person Name</h4>
                                        <p>Profession</p>
                                        <div className="d-flex text-primary">
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star text-body"></i>
                                            <i className="fas fa-star text-body"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-top rounded-bottom p-4">
                                    <p className="mb-0">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam soluta neque ab repudiandae reprehenderit ipsum eos cumque esse repellendus impedit.</p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="testimonial-item">
                                <div className="testimonial-quote"><i className="fa fa-quote-right fa-2x"></i>
                                </div>
                                <div className="testimonial-inner p-4">
                                    <img src="img/testimonial-3.jpg" className="img-fluid" alt="" />
                                    <div className="ms-4">
                                        <h4>Person Name</h4>
                                        <p>Profession</p>
                                        <div className="d-flex text-primary">
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star text-body"></i>
                                            <i className="fas fa-star text-body"></i>
                                            <i className="fas fa-star text-body"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-top rounded-bottom p-4">
                                    <p className="mb-0">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam soluta neque ab repudiandae reprehenderit ipsum eos cumque esse repellendus impedit.</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </div>
    )
}