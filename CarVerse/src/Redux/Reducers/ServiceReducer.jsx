import { CREATE_SERVICE_RED, DELETE_SERVICE_RED, GET_SERVICE_RED, UPDATE_SERVICE_RED } from "../Constant"

export default function ServiceReducer(state = [], action) {
    let index
    switch (action.type) {
        case CREATE_SERVICE_RED:
            return [...state, action.payload]

        case GET_SERVICE_RED:
            return action.payload

        case UPDATE_SERVICE_RED:
            index = state.findIndex(x => x.id === action.payload.id)
            state[index] = { ...action.payload }
            return state

        case DELETE_SERVICE_RED:
            return state.filter(x => x.id !== action.payload.id)

        default:
            return state
    }
}