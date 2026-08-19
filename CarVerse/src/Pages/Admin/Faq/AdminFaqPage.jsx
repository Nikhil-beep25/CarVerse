import React, { useEffect, useState } from 'react'
import AdminSidebar from '../../../Components/Admin/AdminSidebar'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import DataTable from 'datatables.net-dt';
import "datatables.net-dt/css/dataTables.dataTables.min.css"


import { getFaq, deleteFaq } from "../../../Redux/ActionCreators/FaqActionCreators"
export default function AdminFaqPage() {
  let [data, setData] = useState([])

  let FaqStateData = useSelector(state => state.FaqStateData)
  let dispatch = useDispatch()

  function deleteRecord(id) {
    if (window.confirm("Are You Sure You Want to Delete That Record")) {
      dispatch(deleteFaq({ id: id }))
      setData(data.filter(x => x.id !== id))
    }
  }

  useEffect(() => {
    let time = (() => {
      dispatch(getFaq())
      if (FaqStateData.length) {
        setData(FaqStateData)
        return setTimeout(() => new DataTable('#myTable'), 500)
      }
    })()
    return () => clearTimeout(time)
  }, [FaqStateData.length])
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <AdminSidebar />
          </div>
          <div className="col-md-9">
            <h5 className='bg-primary text-light text-center p-2'>Faq
              <Link to="/admin/faq/create"><i className='bi bi-plus text-light float-end'></i></Link>
            </h5>
            <div className="table-responsive">
              <table id='myTable' className='table table-bordered text-dark'>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Question</th>
                    <th>Answer</th>
                    <th>Status</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(item => {
                    return <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.question}</td>
                      <td>{item.answer}</td>
                      <td>{item.status ? "Active" : "Inactive"}</td>
                      <td><Link to={`/admin/faq/update/${item.id}`} className='btn btn-primary'><i className='bi bi-pencil-square'></i></Link></td>
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