import React from 'react'

export default function EnquiryForm() {
    return (
        <div className="bg-secondary rounded p-5">
            <h4 className="text-white mb-4">CONTINUE CAR RESERVATION</h4>
            <form>
                <div className="row g-3">
                    <div className="col-12">
                        <select className="form-select" aria-label="Default select example">
                            <option selected>Select Your Car type</option>
                            <option value="1">VW Golf VII</option>
                            <option value="2">Audi A1 S-Line</option>
                            <option value="3">Toyota Camry</option>
                            <option value="4">BMW 320 ModernLine</option>
                        </select>
                    </div>
                    <div className="col-12">
                        <div className="input-group">
                            <div className="d-flex align-items-center bg-light text-body rounded-start p-2">
                                <span className="fas fa-map-marker-alt"></span> <span className="ms-1">Pick Up</span>
                            </div>
                            <input className="form-control" type="text" placeholder="Enter a City or Airport" aria-label="Enter a City or Airport" />
                        </div>
                    </div>
                    <div className="col-12">
                        <a href="#" className="text-start text-white d-block mb-2">Need a different drop-off location?</a>
                        <div className="input-group">
                            <div className="d-flex align-items-center bg-light text-body rounded-start p-2">
                                <span className="fas fa-map-marker-alt"></span><span className="ms-1">Drop off</span>
                            </div>
                            <input className="form-control" type="text" placeholder="Enter a City or Airport" aria-label="Enter a City or Airport" />
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="input-group">
                            <div className="d-flex align-items-center bg-light text-body rounded-start p-2">
                                <span className="fas fa-calendar-alt"></span><span className="ms-1">Pick Up</span>
                            </div>
                            <input className="form-control" type="date" />
                            <select className="form-select ms-3" aria-label="Default select example">
                                <option selected>12:00AM</option>
                                <option value="1">1:00AM</option>
                                <option value="2">2:00AM</option>
                                <option value="3">3:00AM</option>
                                <option value="4">4:00AM</option>
                                <option value="5">5:00AM</option>
                                <option value="6">6:00AM</option>
                                <option value="7">7:00AM</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="input-group">
                            <div className="d-flex align-items-center bg-light text-body rounded-start p-2">
                                <span className="fas fa-calendar-alt"></span><span className="ms-1">Drop off</span>
                            </div>
                            <input className="form-control" type="date" />
                            <select className="form-select ms-3" aria-label="Default select example">
                                <option selected>12:00AM</option>
                                <option value="1">1:00AM</option>
                                <option value="2">2:00AM</option>
                                <option value="3">3:00AM</option>
                                <option value="4">4:00AM</option>
                                <option value="5">5:00AM</option>
                                <option value="6">6:00AM</option>
                                <option value="7">7:00AM</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-12">
                        <button className="btn btn-light w-100 py-2">Book Now</button>
                    </div>
                </div>
            </form>
        </div>
    )
}