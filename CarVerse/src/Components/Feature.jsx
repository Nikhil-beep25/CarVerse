import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getFeature } from "../Redux/ActionCreators/FeatureActionCreators"
import { getSetting } from "../Redux/ActionCreators/SettingActionCreators"
export default function Feature() {
    let [settingData, setSettingData] = useState({
        siteName: import.meta.env.VITE_APP_SITE_NAME,
    })
    let FeatureStateData = useSelector(state => state.FeatureStateData)
    let SettingStateData = useSelector(state => state.SettingStateData)
    let dispatch = useDispatch()

    useEffect(() => {
        (() => {
            dispatch(getFeature())
        })()
    }, [FeatureStateData.length])

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
        <>
            <div className="container-fluid feature py-5">
                <div className="container py-5">
                    <div className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "800px" }}>
                        <h1 className="display-5 text-capitalize mb-3">{settingData.siteName} <span className="text-primary">Features</span></h1>
                        <p className="mb-0">Discover the features that make {settingData.siteName} your trusted car rental partner. From affordable pricing and a diverse vehicle fleet to easy online booking and 24/7 customer support, we deliver a seamless, safe, and comfortable travel experience every time.</p>
                    </div>
                    <div className="row g-4 align-items-center">
                        {FeatureStateData.filter(x => x.status).map((item) => {
                            return <div className="col-xl-4" key={item.id}>
                                <div className="row gy-4 gx-0">
                                    <div className="col-12 wow fadeInUp" data-wow-delay="0.1s">
                                        <div className="feature-item">
                                            <div className="feature-icon">
                                                <span className='fs-1 text-light' dangerouslySetInnerHTML={{ __html: item.icon }} />
                                            </div>
                                            <div className="ms-4">
                                                <h5 className="mb-3">{item.name}</h5>
                                                <p className="mb-0">{item.shortDescription}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}