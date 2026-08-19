import { CREATE_CAR_RED, DELETE_CAR_RED, GET_CAR_RED, UPDATE_CAR_RED } from "../Constant"

export default function CarReducer(state = [], action) {
    let index
    switch (action.type) {
        case CREATE_CAR_RED:
            return [...state, action.payload]

        case GET_CAR_RED:
            return Array.isArray(action.payload) ? action.payload : []

        case UPDATE_CAR_RED:
            index = state.findIndex(x => (x.id || x._id) === (action.payload.id || action.payload._id))
            if (index !== -1) {
                const newState = [...state]
                newState[index] = { ...state[index], ...action.payload }
                return newState
            }
            return state

        case DELETE_CAR_RED:
            return state.filter(x => (x.id || x._id) !== (action.payload.id || action.payload._id))

        default:
            return state
    }
}