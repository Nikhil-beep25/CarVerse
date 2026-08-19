import { CREATE_SETTING_RED, DELETE_SETTING_RED, GET_SETTING_RED, UPDATE_SETTING_RED } from "../Constant"

export default function SettingReducer(state = [], action) {
    switch (action.type) {
        case CREATE_SETTING_RED:
            return Array.isArray(action.payload) ? action.payload : [...state, action.payload]

        case GET_SETTING_RED:
            return Array.isArray(action.payload) ? action.payload : (action.payload ? [action.payload] : [])

        case UPDATE_SETTING_RED: {
            const payload = action.payload || {}
            const id = payload.id || payload._id
            if (!Array.isArray(state) || state.length === 0) {
                return [payload]
            }
            const index = state.findIndex(x => (x.id || x._id) === id)
            if (index !== -1) {
                const newState = [...state]
                newState[index] = { ...state[index], ...payload }
                return newState
            }
            return [{ ...state[0], ...payload }]
        }

        case DELETE_SETTING_RED:
            return state.filter(x => (x.id || x._id) !== (action.payload?.id || action.payload?._id))

        default:
            return state
    }
}