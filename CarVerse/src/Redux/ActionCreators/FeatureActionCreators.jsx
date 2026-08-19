import { CREATE_FEATURE, DELETE_FEATURE, GET_FEATURE, UPDATE_FEATURE } from "../Constant"

export function createFeature(data) {
    return {
        type: CREATE_FEATURE,
        payload: data
    }
}

export function getFeature() {
    return {
        type: GET_FEATURE
    }
}

export function updateFeature(data) {
    return {
        type: UPDATE_FEATURE,
        payload: data
    }
}

export function deleteFeature(data) {
    return {
        type: DELETE_FEATURE,
        payload: data
    }
}