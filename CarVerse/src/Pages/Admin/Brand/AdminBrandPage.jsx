import { useEffect, useState } from 'react'
import AdminSidebar from '../../../Components/Admin/AdminSidebar'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import DataTable from 'datatables.net-dt';
import "datatables.net-dt/css/dataTables.dataTables.min.css"


import { getBrand, deleteBrand } from "../../../Redux/ActionCreators/BrandActionCreators"
export default function AdminBrandPage() {
  let [data, setData] = useState([])

  let BrandStateData = useSelector(state => state.BrandStateData)
  let dispatch = useDispatch()

  function deleteRecord(id) {
    if (window.confirm("Are You Sure You Want to Delete That Record")) {
      dispatch(deleteBrand({ id: id }))
      setData(data.filter(x => x.id !== id))
    }
  }

  useEffect(() => {
    let time = (() => {
      dispatch(getBrand())
      if (BrandStateData.length) {
        setData(BrandStateData)
        return setTimeout(() => new DataTable('#myTable'), 500)
      }
    })()
    return () => clearTimeout(time)
  }, [BrandStateData.length])
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <AdminSidebar />
          </div>
          <div className="col-md-9">
            <h5 className='bg-primary text-light text-center p-2'>Brand
              <Link to="/admin/brand/create"><i className='bi bi-plus text-light float-end'></i></Link>
            </h5>
            <div className="table-responsive">
              <table id='myTable' className='table table-bordered text-dark'>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Pic</th>
                    <th>Status</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(item => {
                    return <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>
                        <Link to={`${import.meta.env.VITE_APP_IMAGE_SERVER}${item.pic}`} target='_blank'>
                          <img src={`${import.meta.env.VITE_APP_IMAGE_SERVER}${item.pic}`} height={60} width={100} alt="" />
                        </Link>
                      </td>
                      <td>{item.status ? "Active" : "Inactive"}</td>
                      <td><Link to={`/admin/brand/update/${item.id}`} className='btn btn-primary'><i className='bi bi-pencil-square'></i></Link></td>
                      <td><button onClick={() => deleteRecord(item.id)} className='btn btn-danger'><i className='bi bi-x'></i></button></td>
                    </tr>
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}