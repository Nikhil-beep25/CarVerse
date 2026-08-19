import { CREATE_FEATURE_RED, DELETE_FEATURE_RED, GET_FEATURE_RED, UPDATE_FEATURE_RED } from "../Constant"

export default function FeatureReducer(state = [], action) {
    let index
    switch (action.type) {
        case CREATE_FEATURE_RED:
            return [...state, action.payload]

        case GET_FEATURE_RED:
            return action.payload

        case UPDATE_FEATURE_RED:
            index = state.findIndex(x => x.id === action.payload.id)
            state[index] = { ...action.payload }
            return state

        case DELETE_FEATURE_RED:
            return state.filter(x => x.id !== action.payload.id)

        default:
            return state
    }
}