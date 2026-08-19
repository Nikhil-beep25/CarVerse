import { CREATE_CATEGORY, DELETE_CATEGORY, GET_CATEGORY, UPDATE_CATEGORY } from "../Constant"

export function createCategory(data) {
    return {
        type: CREATE_CATEGORY,
        payload: data
    }
}

export function getCategory() {
    return {
        type: GET_CATEGORY
    }
}

export function updateCategory(data) {
    return {
        type: UPDATE_CATEGORY,
        payload: data
    }
}

export function deleteCategory(data) {
    return {
        type: DELETE_CATEGORY,
        payload: data
    }
}