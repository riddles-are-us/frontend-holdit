import { combineReducers } from "redux";
import resourcesReducer from "./resources"
import propertiesReducer from "./properties"

export default combineReducers({
    resources: resourcesReducer,
    properties: propertiesReducer
})