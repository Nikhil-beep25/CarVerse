import { CREATE_SERVICE, DELETE_SERVICE, GET_SERVICE, UPDATE_SERVICE } from "../Constant"

export function createService(data) {
    return {
        type: CREATE_SERVICE,
        payload: data
    }
}

export function getService() {
    return {
        type: GET_SERVICE
    }
}

export function updateService(data) {
    return {
        type: UPDATE_SERVICE,
        payload: data
    }
}

export function deleteService(data) {
    return {
        type: DELETE_SERVICE,
        payload: data
    }
}