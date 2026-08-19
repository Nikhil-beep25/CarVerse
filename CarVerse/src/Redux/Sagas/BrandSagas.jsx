import { put, takeEvery } from "redux-saga/effects"
import { CREATE_BRAND, CREATE_BRAND_RED, DELETE_BRAND, DELETE_BRAND_RED, GET_BRAND, GET_BRAND_RED, UPDATE_BRAND, UPDATE_BRAND_RED } from "../Constant"
import { createMultipartRecord, createRecord, deleteRecord, getRecord, updateMultipartRecord, updateRecord } from "./Services/index"
import { toast } from "react-toastify"

function* createSaga(action) {                                          //Worker
    let response = yield createRecord("brand", action)
    if(response && !response.success === false) toast.success("Brand Created Successfully")
    else if(response?.message) toast.error(response.message)
    yield put({ type: CREATE_BRAND_RED, payload: response })
}

function* getSaga(action) {                                             //Worker
    let response = yield getRecord("brand")
    yield put({ type: GET_BRAND_RED, payload: response })
}

function* updateSaga(action) {                                          //Worker
    let response = yield updateRecord("brand", action)
    if(response && !response.success === false) toast.success("Brand Updated Successfully")
    else if(response?.message) toast.error(response.message)
    yield put({ type: UPDATE_BRAND_RED, payload: action.payload })
}

function* deleteSaga(action) {                                         //Worker
    let response = yield deleteRecord("brand", action)
    if(response && !response.success === false) toast.success("Brand Deleted Successfully")
    else if(response?.message) toast.error(response.message)
    yield put({ type: DELETE_BRAND_RED, payload: action.payload })
}

export default function* BrandSaga() {
    yield takeEvery(CREATE_BRAND, createSaga)                 //Watcher
    yield takeEvery(GET_BRAND, getSaga)                       //Watcher
    yield takeEvery(UPDATE_BRAND, updateSaga)                 //Watcher
    yield takeEvery(DELETE_BRAND, deleteSaga)                 //Watcher
}