import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import AdminSidebar from '../../../Components/Admin/AdminSidebar'

import TextValidators from '../../../FormValidators/TextValidators'

import { getService, updateService } from "../../../Redux/ActionCreators/ServiceActionCreators"
export default function AdminUpdateServicePage() {
  let { id } = useParams()

  let [data, setData] = useState({
    name: '',
    icon: '',
    shortDescription: '',
    status: true
  })
  let [errorMessage, setErrorMessage] = useState({
    name: '',
    icon: '',
    shortDescription: ''
  })
  let [show, setShow] = useState(false)

  let ServiceStateData = useSelector(state => state.ServiceStateData)
  let dispatch = useDispatch()

  let navigate = useNavigate()

  function getInputData(e) {
    let { name, value } = e.target

    setData({ ...data, [name]: name === "status" ? (value === "1" ? true : false) : value })
    setErrorMessage({ ...errorMessage, [name]: TextValidators(e) })
  }


  function postData(e) {
    e.preventDefault()
    let error = Object.values(errorMessage).find(x => x !== "")
    if (error)
      setShow(true)
    else {
      let item = ServiceStateData.find(x => x.id !== id && x.name?.toLocaleLowerCase() === data.name?.toLocaleLowerCase())
      if (item) {
        setShow(true)
        setErrorMessage({ ...errorMessage, name: "Service With This Name Already Exist" })
        return
      }

      dispatch(updateService({ ...data }))
      navigate("/admin/service")
    }
  }

  useEffect(() => {
    dispatch(getService())
    if (ServiceStateData.length) {
      let item = ServiceStateData.find(x => x.id === id)
      if (item)
        setData({ ...data, ...item })
      else
        navigate("/admin/service")
    }
  }, [ServiceStateData.length])
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <AdminSidebar />
          </div>
          <div className="col-md-9">
            <h5 className='bg-primary text-light text-center p-2'>Update Service
              <Link to="/admin/service"><i className='bi bi-arrow-left text-light float-end'></i></Link>
            </h5>
            <form onSubmit={postData}>
              <div className="row">
                <div className="col-12 mb-3">
                  <label>Name*</label>
                  <input type="text" name="name" value={data.name} onChange={getInputData} placeholder='Service Name' className={`form-control ${show && errorMessage.name ? 'border-danger' : 'border-dark'}`} />
                  {show && errorMessage.name ? <p className='text-danger text-capitalize'>{errorMessage.name}</p> : null}
                </div>

                <div className="col-12 mb-3">
                  <label>Short Description*</label>
                  <textarea name="shortDescription" value={data.shortDescription} rows={3} onChange={getInputData} placeholder='Service Short Description' className={`form-control ${show && errorMessage.shortDescription ? 'border-danger' : 'border-dark'}`} />
                  {show && errorMessage.shortDescription ? <p className='text-danger text-capitalize'>{errorMessage.shortDescription}</p> : null}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Icon*</label>
                  <input type="text" name="icon" value={data.icon} placeholder="Icon Tag From Bootstrap Icons like <i class='bi bi-list'></i>" onChange={getInputData} className={`form-control ${show && errorMessage.icon ? 'border-danger' : 'border-dark'}`} />
                  {show && errorMessage.icon ? <p className='text-danger text-capitalize'>{errorMessage.icon}</p> : null}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Status*</label>
                  <select name="status" value={data.status ? "1" : "0"} className='form-select border-dark' onChange={getInputData}>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>

                <div className="col-12 mb-3">
                  <button type='submit' className='btn btn-primary w-100'>Update</button>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}