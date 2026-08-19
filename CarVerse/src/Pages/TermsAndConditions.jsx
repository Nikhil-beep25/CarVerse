import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Breadcrum from '../Components/Breadcrum'


import { getSetting } from "../Redux/ActionCreators/SettingActionCreators"
export default function TermsandConditionsPage() {
    let [settingData, setSettingData] = useState({
            dataPolicy: "",
        })
        let SettingStateData = useSelector(state => state.SettingStateData)
        let dispatch = useDispatch()
    
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
            <Breadcrum title="Terms and Conditions" />
            <div className="container my-3">
                    <div dangerouslySetInnerHTML={{__html:settingData.dataPolicy}}/>
            </div>
        </>
    )
}