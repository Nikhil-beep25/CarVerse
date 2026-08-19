import { combineReducers } from "@reduxjs/toolkit";

import CategoryReducer from "./CategoryReducer";
import CarReducer from "./CarReducer";
import BrandReducer from "./BrandReducer";
import FaqReducer from "./FaqReducer";
import FeatureReducer from "./FeatureReducer";
import ServiceReducer from "./ServiceReducer";
import SettingReducer from "./SettingReducer";
import AuthReducer from "./AuthSlice";

export default combineReducers({
    CategoryStateData: CategoryReducer,
    CarStateData: CarReducer,
    BrandStateData: BrandReducer,
    FaqStateData: FaqReducer,
    FeatureStateData: FeatureReducer,
    ServiceStateData: ServiceReducer,
    SettingStateData: SettingReducer,
    AuthStateData: AuthReducer,
})