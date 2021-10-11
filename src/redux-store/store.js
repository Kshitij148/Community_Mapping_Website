import {configureStore} from "@reduxjs/toolkit";
import mapReducer from "./mapSlice";
import aoiReducer from "./aoiSlice";


export default configureStore({
  reducer: {
    mapInfo: mapReducer,
    areaOfInterest: aoiReducer
  },
})