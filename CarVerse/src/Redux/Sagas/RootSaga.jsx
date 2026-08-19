import { all } from "redux-saga/effects";
import CategorySaga from "./CategorySagas";
import BrandSaga from "./BrandSagas";
import CarSaga from "./CarSagas";
import FaqSaga from "./FaqSagas";
import FeatureSaga from "./FeatureSagas";
import ServiceSaga from "./ServiceSagas";
import SettingSaga from "./SettingSagas";

export default function* RootSaga() {
    yield all([
        CategorySaga(),
        CarSaga(),
        BrandSaga(),
        FaqSaga(),
        FeatureSaga(),
        ServiceSaga(),
        SettingSaga()
    ])
}