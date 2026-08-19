import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getService } from "../Redux/ActionCreators/ServiceActionCreators"
import { getSetting } from "../Redux/ActionCreators/SettingActionCreators"

export default function Service() {
    let [settingData, setSettingData] = useState({
        siteName: import.meta.env.VITE_APP_SITE_NAME,
    })
    let ServiceStateData = useSelector(state => state.ServiceStateData)
    let SettingStateData = useSelector(state => state.SettingStateData)
    let dispatch = useDispatch()

    useEffect(() => {
        (() => {
            dispatch(getService())
        })()
    }, [ServiceStateData.length])

    useEffect(() => {
        (() => {
            dispatch(getSetting())
            if (SettingStateData.length) {
                let items = {}
                Object.keys(settingData).forEach(key => items[key] = SettingStateData[0][key] || settingData[key])
                setSettingData({ ...items })
            }
        })()
    }, [SettingStateData.length])
    return (
        <div className="container-fluid service py-5">
            <div className="container py-5">
                <div className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "800px" }}>
                    <h1 className="display-5 text-capitalize mb-3">{settingData.siteName} <span className="text-primary">Services</span></h1>
                    <p className="mb-0">Explore {settingData.siteName}'s comprehensive car rental services designed for every travel need. Whether you need a self-drive car, chauffeur service, airport transfer, or long-term rental, we provide reliable vehicles, flexible plans, and exceptional customer support for a smooth journey.</p>
                </div>
                <div className="row g-4">
                    {ServiceStateData.filter(x => x.status).map(item => {
                        return <div className="col-md-6 col-lg-4 wow fadeInUp" data-wow-delay="0.1s" key={item.id}>
                            <div className="service-item p-4">
                                <div className="service-icon mb-4">
                                    <span className='fs-1 text-light' dangerouslySetInnerHTML={{ __html: item.icon }} />
                                </div>
                                <h5 className="mb-3">{item.name}</h5>
                                <p className="mb-0">{item.shortDescription}</p>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </div>
    )
}