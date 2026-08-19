import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import AdminSidebar from '../../../Components/Admin/AdminSidebar'

import ImageValidators from '../../../FormValidators/ImageValidators'
import TextValidators from '../../../FormValidators/TextValidators'

import { createCar } from "../../../Redux/ActionCreators/CarActionCreators"
import { getCategory } from "../../../Redux/ActionCreators/CategoryActionCreators"
import { getBrand } from "../../../Redux/ActionCreators/BrandActionCreators"

export default function AdminCreateCarPage() {
  let [data, setData] = useState({
    name: '',
    registrationNumber: '',
    drivingMode: 'Manual',
    driver: false,
    type: 'Petrol',
    seatingCapacity: '5',
    category: '',
    brand: '',
    baseRentAmount: '',
    discount: 0,
    finalRentAmount: 0,
    address: '',
    pic: [],
    status: true
  })
  let [errorMessage, setErrorMessage] = useState({
    name: 'Name Field is Mendatory',
    registrationNumber: 'Registration Number Field is Mendatory',
    baseRentAmount: 'Base Rent Amount Field is Mendatory',
    discount: 'Discount Field is Mendatory',
    address: 'Address Field is Mendatory',
    pic: 'Pic Field is Mendatory'
  })
  let [show, setShow] = useState(false)
  let [showWaitButton, setShowWaitButton] = useState(false)

  let CategoryStateData = useSelector(state => state.CategoryStateData)
  let BrandStateData = useSelector(state => state.BrandStateData)
  let dispatch = useDispatch()

  let navigate = useNavigate()

  function getInputData(e) {
    let name = e.target.name
    let value = name === "pic" ? Array.from(e.target.files).map(x => "car/" + x.name) : e.target.value

    setData({ ...data, [name]: (name === "status" || name === "driver") ? (value === "1" ? true : false) : value })
    setErrorMessage({ ...errorMessage, [name]: name === "pic" ? ImageValidators(e) : TextValidators(e) })
  }

  async function postData(e) {
    e.preventDefault()
    let error = Object.values(errorMessage).find(x => x !== "")
    if (error)
      setShow(true)
    else {
      setShowWaitButton(true)
      let response = await fetch(`https://nominatim.openstreetmap.org/search?q=${data.address}&format=jsonv2&limit=1`)
      response = await response.json()

      if (response.length === 0) {
        setErrorMessage({ ...errorMessage, address: "Invalid Address, Please Enter Correct Address" })
        setShow(true)
        setShowWaitButton(false)
        return
      }

      let bp = parseInt(data.baseRentAmount) || 0
      let d = parseInt(data.discount) || 0
      let fp = parseInt(bp - bp * d / 100)

      dispatch(createCar({
        ...data,
        category: data.category || (CategoryStateData[0]?.name ?? ''),
        brand: data.brand || (BrandStateData[0]?.name ?? ''),
        baseRentAmount: bp,
        discount: d,
        finalRentAmount: fp,
        address: {
          address: data.address,
          lat: response[0]?.lat,
          lon: response[0]?.lon,
        }
      }))

      navigate("/admin/car")
    }
  }

  useEffect(() => {
    dispatch(getCategory())
  }, [dispatch, CategoryStateData.length])

  useEffect(() => {
    dispatch(getBrand())
  }, [dispatch, BrandStateData.length])

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <AdminSidebar />
          </div>
          <div className="col-md-9">
            <h5 className='bg-primary text-light text-center p-2'>Create Car
              <Link to="/admin/car"><i className='bi bi-arrow-left text-light float-end'></i></Link>
            </h5>
            <form onSubmit={postData}>
              <div className="row">
                <div className="col-xl-9 col-md-6 mb-3">
                  <label>Name*</label>
                  <input type="text" name="name" value={data.name ?? ''} onChange={getInputData} placeholder='Car Name' className={`form-control ${show && errorMessage.name ? 'border-danger' : 'border-dark'}`} />
                  {show && errorMessage.name ? <p className='text-danger text-capitalize'>{errorMessage.name}</p> : null}
                </div>

                <div className="col-xl-3 col-md-6 mb-3">
                  <label>Registration Number*</label>
                  <input type="text" name="registrationNumber" value={data.registrationNumber ?? ''} onChange={getInputData} placeholder='Registration Number' className={`form-control ${show && errorMessage.registrationNumber ? 'border-danger' : 'border-dark'}`} />
                  {show && errorMessage.registrationNumber ? <p className='text-danger text-capitalize'>{errorMessage.registrationNumber}</p> : null}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Category*</label>
                  <select name="category" value={data.category ?? ''} onChange={getInputData} className='form-select border-primary'>
                    <option value="">Select Category</option>
                    {CategoryStateData.filter(x => x.status).map((item) => {
                      return <option key={item.id || item._id} value={item.name}>{item.name}</option>
                    })}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label>Brand*</label>
                  <select name="brand" value={data.brand ?? ''} onChange={getInputData} className='form-select border-primary'>
                    <option value="">Select Brand</option>
                    {BrandStateData.filter(x => x.status).map((item) => {
                      return <option key={item.id || item._id} value={item.name}>{item.name}</option>
                    })}
                  </select>
                </div>


                <div className="col-md-6 mb-3">
                  <label>Base Rent Amount Per Day*</label>
                  <input type="number" name="baseRentAmount" value={data.baseRentAmount ?? ''} onChange={getInputData} placeholder='Basic Rent Amount Per Day' className={`form-control ${show && errorMessage.baseRentAmount ? 'border-danger' : 'border-dark'}`} />
                  {show && errorMessage.baseRentAmount ? <p className='text-danger text-capitalize'>{errorMessage.baseRentAmount}</p> : null}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Discount (%)*</label>
                  <input type="number" name="discount" value={data.discount ?? 0} onChange={getInputData} placeholder='Discount' className={`form-control ${show && errorMessage.discount ? 'border-danger' : 'border-dark'}`} />
                  {show && errorMessage.discount ? <p className='text-danger text-capitalize'>{errorMessage.discount}</p> : null}
                </div>

                <div className="col-xl-3 col-md-6 mb-3">
                  <label>Driving Mode*</label>
                  <select name="drivingMode" value={data.drivingMode ?? 'Manual'} onChange={getInputData} className='form-select border-primary'>
                    <option value="Manual">Manual</option>
                    <option value="Autometic">Automatic</option>
                  </select>
                </div>

                <div className="col-xl-3 col-md-6 mb-3">
                  <label>Driver Required*</label>
                  <select name="driver" value={data.driver ? "1" : "0"} onChange={getInputData} className='form-select border-primary'>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>

                <div className="col-xl-3 col-md-6 mb-3">
                  <label>Seating Capacity*</label>
                  <select name="seatingCapacity" value={data.seatingCapacity ?? '5'} onChange={getInputData} className='form-select border-primary'>
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="7">7</option>
                    <option value="11">11</option>
                  </select>
                </div>

                <div className="col-xl-3 col-md-6 mb-3">
                  <label>Type*</label>
                  <select name="type" value={data.type ?? 'Petrol'} onChange={getInputData} className='form-select border-primary'>
                    <option value="CNG">CNG</option>
                    <option value="Petrol">Petrol</option>
                    <option value="EV">EV</option>
                    <option value="Petrol + Hybrid">Petrol + Hybrid</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>

                <div className="col-12 mb-3">
                  <label>Address / City*</label>
                  <input type="text" name="address" value={data.address ?? ''} onChange={getInputData} placeholder='Address or City' className={`form-control ${show && errorMessage.address ? 'border-danger' : 'border-dark'}`} />
                  {show && errorMessage.address ? <p className='text-danger text-capitalize'>{errorMessage.address}</p> : null}
                </div>

                <div className="col-xl-6 col-md-6 mb-3">
                  <label>Pic*</label>
                  <input type="file" name="pic" multiple onChange={getInputData} className={`form-control ${show && errorMessage.pic ? 'border-danger' : 'border-dark'}`} />
                  {show && errorMessage.pic ? <p className='text-danger text-capitalize'>{errorMessage.pic}</p> : null}
                </div>

                <div className="col-xl-6 col-md-6 mb-3">
                  <label>Status*</label>
                  <select name="status" value={data.status ? "1" : "0"} className='form-select border-dark' onChange={getInputData}>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>

                <div className="col-12 mb-3">
                  <button type='submit' className='btn btn-primary w-100'>{showWaitButton ? "Please Wait..." : "Create Car"}</button>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}