import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Breadcrum from '../Components/Breadcrum'
import CarCard from '../Components/CarCard'

import { getCar } from "../Redux/ActionCreators/CarActionCreators"
import { getCategory } from "../Redux/ActionCreators/CategoryActionCreators"
import { getBrand } from "../Redux/ActionCreators/BrandActionCreators"

export default function CarsPage() {
  let [data, setData] = useState([])
  let [selected, setSelected] = useState({
    category: [],
    brand: []
  })

  let CarStateData = useSelector(state => state.CarStateData)
  let CategoryStateData = useSelector(state => state.CategoryStateData)
  let BrandStateData = useSelector(state => state.BrandStateData)

  let dispatch = useDispatch()

  function getCheckboxInputData(key, value) {
    let arr = [...selected[key]]
    if (arr.includes(value))
      arr = arr.filter(x => x !== value)
    else
      arr.push(value)

    setSelected({ ...selected, [key]: arr })
  }

  useEffect(() => {
    dispatch(getCar())
    dispatch(getCategory())
    dispatch(getBrand())
  }, [dispatch])

  useEffect(() => {
    let filtered = CarStateData.filter(x => x.status !== false)
    
    if (selected.category.length > 0) {
      filtered = filtered.filter(car => {
        const catName = typeof car.category === 'object' ? car.category?.name : car.category
        return selected.category.includes(catName)
      })
    }
    
    if (selected.brand.length > 0) {
      filtered = filtered.filter(car => {
        const brandName = typeof car.brand === 'object' ? car.brand?.name : car.brand
        return selected.brand.includes(brandName)
      })
    }

    setData(filtered)
  }, [CarStateData, selected])

  return (
    <>
      <Breadcrum title="Cars" />

      <div className="container-fluid my-3">
        <div className="row">
          <div className="col-md-3">
            <ul className="list-group mb-3">
              <li className="list-group-item active" aria-current="true">Category</li>
              {CategoryStateData.filter(x => x.status !== false).map(item => {
                const isSelected = selected.category?.includes(item.name)
                return (
                  <li 
                    key={item.id || item._id} 
                    className={`list-group-item d-flex justify-content-between align-items-center ${isSelected ? 'bg-light font-weight-bold' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => getCheckboxInputData('category', item.name)}
                  >
                    <span>{item.name}</span>
                    {isSelected ? <i className='bi bi-check-circle-fill text-primary'></i> : <i className='bi bi-circle text-muted'></i>}
                  </li>
                )
              })}
            </ul>
            <ul className="list-group mb-3">
              <li className="list-group-item active" aria-current="true">Brand</li>
              {BrandStateData.filter(x => x.status !== false).map(item => {
                const isSelected = selected.brand?.includes(item.name)
                return (
                  <li 
                    key={item.id || item._id} 
                    className={`list-group-item d-flex justify-content-between align-items-center ${isSelected ? 'bg-light font-weight-bold' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => getCheckboxInputData('brand', item.name)}
                  >
                    <span>{item.name}</span>
                    {isSelected ? <i className='bi bi-check-circle-fill text-primary'></i> : <i className='bi bi-circle text-muted'></i>}
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="col-md-9">
            <div className="row">
              {CarStateData.length === 0 ? (
                // Skeleton Loaders
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className='col-lg-4 col-md-6 mb-4'>
                    <div className="card border-0 shadow-sm">
                      <div className="skeleton skeleton-img"></div>
                      <div className="card-body">
                        <div className="skeleton skeleton-text"></div>
                        <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : data.length > 0 ? (
                data.map(item => {
                  return <div key={item.id || item._id} className='col-lg-4 col-md-6 mb-4'>
                    <CarCard item={item} />
                  </div>
                })
              ) : (
                <div className="col-12 text-center py-5">
                  <h4 className="text-muted">No Cars Found</h4>
                  <p className="text-muted">Try adjusting your filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}