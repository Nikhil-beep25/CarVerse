import { put, takeEvery } from "redux-saga/effects"
import { CREATE_FAQ, CREATE_FAQ_RED, DELETE_FAQ, DELETE_FAQ_RED, GET_FAQ, GET_FAQ_RED, UPDATE_FAQ, UPDATE_FAQ_RED } from "../Constant"
import { createMultipartRecord, createRecord, deleteRecord, getRecord, updateMultipartRecord, updateRecord } from "./Services/index"

function* createSaga(action) {                                          //Worker
    let response = yield createRecord("faq", action)
    // let response = yield createMultipartRecord("faq", action)
    yield put({ type: CREATE_FAQ_RED, payload: response })
}

function* getSaga(action) {                                             //Worker
    let response = yield getRecord("faq")
    yield put({ type: GET_FAQ_RED, payload: response })
}

function* updateSaga(action) {                                          //Worker
    yield updateRecord("faq", action)
    yield put({ type: UPDATE_FAQ_RED, payload: action.payload })
    // let response = yield updateMultipartRecord("faq", action)
    // yield put({ type: UPDATE_FAQ_RED, payload: response })
}

function* deleteSaga(action) {                                         //Worker
    yield deleteRecord("faq", action)
    yield put({ type: DELETE_FAQ_RED, payload: action.payload })
}

export default function* FaqSaga() {
    yield takeEvery(CREATE_FAQ, createSaga)                 //Watcher
    yield takeEvery(GET_FAQ, getSaga)                       //Watcher
    yield takeEvery(UPDATE_FAQ, updateSaga)                 //Watcher
    yield takeEvery(DELETE_FAQ, deleteSaga)                 //Watcher
}