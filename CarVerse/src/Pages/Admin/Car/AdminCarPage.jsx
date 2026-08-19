import { useEffect, useState, useRef, useMemo } from 'react'
import AdminSidebar from '../../../Components/Admin/AdminSidebar'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import DataTable from 'datatables.net-dt';
import "datatables.net-dt/css/dataTables.dataTables.min.css"

import { getCar, deleteCar } from "../../../Redux/ActionCreators/CarActionCreators"

export default function AdminCarPage() {
  const [deletedIds, setDeletedIds] = useState([])
  const dataTableRef = useRef(null)

  const CarStateData = useSelector(state => state.CarStateData)
  const dispatch = useDispatch()

  function deleteRecord(id) {
    if (window.confirm("Are you sure you want to delete this car record?")) {
      dispatch(deleteCar({ id: id }))
      setDeletedIds(prev => [...prev, id])
    }
  }

  useEffect(() => {
    dispatch(getCar())
  }, [dispatch])

  const data = useMemo(() => {
    if (!Array.isArray(CarStateData)) return []
    return CarStateData
      .filter(car => !deletedIds.includes(car.id || car._id))
      .map(car => ({
        id: car.id || car._id,
        _id: car._id || car.id,
        name: car.name || 'Unnamed Car',
        registrationNumber: car.registrationNumber || 'N/A',
        drivingMode: car.drivingMode || car.transmission || 'Automatic',
        driver: Boolean(car.driver),
        type: car.type || car.fuelType || 'Petrol',
        seatingCapacity: car.seatingCapacity ?? 5,
        category: (typeof car.category === 'object' ? car.category?.name : car.category) || 'N/A',
        brand: (typeof car.brand === 'object' ? car.brand?.name : car.brand) || 'N/A',
        baseRentAmount: car.baseRentAmount ?? car.pricePerDay ?? 0,
        discount: car.discount ?? 0,
        finalRentAmount: car.finalRentAmount ?? car.pricePerDay ?? 0,
        city: car.city || 'Delhi',
        pic: Array.isArray(car.pic) && car.pic.length > 0
          ? car.pic
          : (Array.isArray(car.images) && car.images.length > 0
              ? car.images
              : (typeof car.pic === 'string' && car.pic ? [car.pic] : [])),
        status: car.status !== false && car.status !== 'inactive'
      }))
  }, [CarStateData, deletedIds])

  const loading = !Array.isArray(CarStateData) || (CarStateData.length === 0 && deletedIds.length === 0)

  useEffect(() => {
    let timer;
    if (data.length > 0) {
      timer = setTimeout(() => {
        try {
          if (dataTableRef.current) {
            dataTableRef.current.destroy()
          }
          const tableElement = document.querySelector('#myTable');
          if (tableElement) {
            dataTableRef.current = new DataTable('#myTable', {
              destroy: true,
              pageLength: 10,
              responsive: true,
            });
          }
        } catch (err) {
          console.error("DataTable notice:", err);
        }
      }, 100);
    }
    return () => {
      clearTimeout(timer);
      if (dataTableRef.current) {
        try {
          dataTableRef.current.destroy();
          dataTableRef.current = null;
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, [data]);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <AdminSidebar />
          </div>
          <div className="col-md-9">
            <h5 className='bg-primary text-light text-center p-2 d-flex justify-content-between align-items-center mb-3'>
              <span className="ms-2">Fleet Cars</span>
              <Link to="/admin/car/create" className="btn btn-sm btn-light me-2">
                <i className='bi bi-plus-lg me-1'></i> Add Car
              </Link>
            </h5>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading fleet cars...</span>
                </div>
                <p className="mt-2 text-muted">Loading fleet cars...</p>
              </div>
            ) : data.length === 0 ? (
              <div className="alert alert-info text-center my-4 py-4">
                <h5>No cars found.</h5>
                <p className="text-muted mb-3">Your fleet is currently empty.</p>
                <Link to="/admin/car/create" className="btn btn-primary">
                  <i className="bi bi-plus-lg me-1"></i> Add First Car
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table id='myTable' className='table table-bordered table-hover text-dark'>
                  <thead className="table-light">
                    <tr>
                      <th>Id</th>
                      <th>Name</th>
                      <th>Registration Number</th>
                      <th>Driving Mode</th>
                      <th>Driver</th>
                      <th>Type</th>
                      <th>Seats</th>
                      <th>Category</th>
                      <th>Brand</th>
                      <th>Base Rent</th>
                      <th>Discount</th>
                      <th>Final Rent</th>
                      <th>City</th>
                      <th>Pic</th>
                      <th>Status</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(item => {
                      const recordId = item.id || item._id;
                      return (
                        <tr key={recordId}>
                          <td><small className="text-muted">{recordId}</small></td>
                          <td className="fw-semibold">{item.name}</td>
                          <td>{item.registrationNumber}</td>
                          <td>{item.drivingMode}</td>
                          <td>{item.driver ? "Yes" : "No"}</td>
                          <td>{item.type}</td>
                          <td>{item.seatingCapacity}</td>
                          <td><span className="badge bg-secondary">{item.category}</span></td>
                          <td><span className="badge bg-dark">{item.brand}</span></td>
                          <td>&#8377;{item.baseRentAmount}</td>
                          <td>{item.discount}% Off</td>
                          <td className="fw-bold text-success">&#8377;{item.finalRentAmount}</td>
                          <td>{item.city}</td>
                          <td>
                            <div style={{ width: 140 }} className="d-flex flex-wrap gap-1">
                              {item.pic.length > 0 ? (
                                item.pic.slice(0, 2).map((pic, index) => {
                                  const imgUrl = pic.startsWith('http') ? pic : `${import.meta.env.VITE_APP_IMAGE_SERVER}${pic}`;
                                  return (
                                    <Link key={index} to={imgUrl} target='_blank' rel="noreferrer">
                                      <img
                                        src={imgUrl}
                                        height={50}
                                        width={60}
                                        style={{ objectFit: 'cover' }}
                                        className='rounded border'
                                        alt={item.name}
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=60";
                                        }}
                                      />
                                    </Link>
                                  );
                                })
                              ) : (
                                <span className="text-muted small">No images</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${item.status ? 'bg-success' : 'bg-danger'}`}>
                              {item.status ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td>
                            <Link to={`/admin/car/update/${recordId}`} className='btn btn-sm btn-primary'>
                              <i className='bi bi-pencil-square'></i>
                            </Link>
                          </td>
                          <td>
                            <button onClick={() => deleteRecord(recordId)} className='btn btn-sm btn-danger'>
                              <i className='bi bi-trash'></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}