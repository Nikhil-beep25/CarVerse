import { put, takeEvery } from "redux-saga/effects"
import { CREATE_CAR, CREATE_CAR_RED, DELETE_CAR, DELETE_CAR_RED, GET_CAR, GET_CAR_RED, UPDATE_CAR, UPDATE_CAR_RED } from "../Constant"
import { createMultipartRecord, createRecord, deleteRecord, getRecord, updateMultipartRecord, updateRecord } from "./Services/index"
import { toast } from "react-toastify"

function* createSaga(action) {                                          //Worker
    let response = yield createRecord("car", action)
    if(response && !response.success === false) toast.success("Car Created Successfully")
    else if(response?.message) toast.error(response.message)
    yield put({ type: CREATE_CAR_RED, payload: response })
}

function* getSaga(action) {                                             //Worker
    let response = yield getRecord("car")
    yield put({ type: GET_CAR_RED, payload: response })
}

function* updateSaga(action) {                                          //Worker
    let response = yield updateRecord("car", action)
    if(response && !response.success === false) toast.success("Car Updated Successfully")
    else if(response?.message) toast.error(response.message)
    yield put({ type: UPDATE_CAR_RED, payload: action.payload })
}

function* deleteSaga(action) {                                         //Worker
    let response = yield deleteRecord("car", action)
    if(response && !response.success === false) toast.success("Car Deleted Successfully")
    else if(response?.message) toast.error(response.message)
    yield put({ type: DELETE_CAR_RED, payload: action.payload })
}

export default function* CarSaga() {
    yield takeEvery(CREATE_CAR, createSaga)                 //Watcher
    yield takeEvery(GET_CAR, getSaga)                       //Watcher
    yield takeEvery(UPDATE_CAR, updateSaga)                 //Watcher
    yield takeEvery(DELETE_CAR, deleteSaga)                 //Watcher
}