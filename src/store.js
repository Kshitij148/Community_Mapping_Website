import {configureStore} from "@reduxjs/toolkit";
import mapReducer from "./mapSlice";
import aoiReducer from "./areaOfInterest";


export default configureStore({
  reducer: {
    mapInfo: mapReducer,
    areaOfInterest: aoiReducer
  },
})