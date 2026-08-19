import { put, takeEvery } from "redux-saga/effects"
import { CREATE_CATEGORY, CREATE_CATEGORY_RED, DELETE_CATEGORY, DELETE_CATEGORY_RED, GET_CATEGORY, GET_CATEGORY_RED, UPDATE_CATEGORY, UPDATE_CATEGORY_RED } from "../Constant"
import { createMultipartRecord, createRecord, deleteRecord, getRecord, updateMultipartRecord, updateRecord } from "./Services/index"
import { toast } from "react-toastify"

function* createSaga(action) {                                          //Worker
    let response = yield createRecord("category", action)
    if(response && !response.success === false) toast.success("Category Created Successfully")
    else if(response?.message) toast.error(response.message)
    yield put({ type: CREATE_CATEGORY_RED, payload: response })
}

function* getSaga(action) {                                             //Worker
    let response = yield getRecord("category")
    yield put({ type: GET_CATEGORY_RED, payload: response })
}

function* updateSaga(action) {                                          //Worker
    let response = yield updateRecord("category", action)
    if(response && !response.success === false) toast.success("Category Updated Successfully")
    else if(response?.message) toast.error(response.message)
    yield put({ type: UPDATE_CATEGORY_RED, payload: action.payload })
}

function* deleteSaga(action) {                                         //Worker
    let response = yield deleteRecord("category", action)
    if(response && !response.success === false) toast.success("Category Deleted Successfully")
    else if(response?.message) toast.error(response.message)
    yield put({ type: DELETE_CATEGORY_RED, payload: action.payload })
}

export default function* CategorySaga(){
    yield takeEvery(CREATE_CATEGORY,createSaga)                 //Watcher
    yield takeEvery(GET_CATEGORY,getSaga)                       //Watcher
    yield takeEvery(UPDATE_CATEGORY,updateSaga)                 //Watcher
    yield takeEvery(DELETE_CATEGORY,deleteSaga)                 //Watcher
}