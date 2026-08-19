import { CREATE_FAQ, DELETE_FAQ, GET_FAQ, UPDATE_FAQ } from "../Constant"

export function createFaq(data) {
    return {
        type: CREATE_FAQ,
        payload: data
    }
}

export function getFaq() {
    return {
        type: GET_FAQ
    }
}

export function updateFaq(data) {
    return {
        type: UPDATE_FAQ,
        payload: data
    }
}

export function deleteFaq(data) {
    return {
        type: DELETE_FAQ,
        payload: data
    }
}