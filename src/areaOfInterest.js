import { createSlice } from "@reduxjs/toolkit";

export const aoiSlice = createSlice({
  name: "areaOfInterest",
  initialState: {
    location: null,
    name: null,
    longitude: null,
    latitude: null,
    area: null,
  },
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload.location;
    },
    setName: (state, action) => {
      state.name = action.payload.name;
    },
    setLongitude: (state, action) => {
      state.longitude = action.payload.longitude;
    },
    setLatitude: (state, action) => {
      state.latitude = action.payload.latitude;
    },
    setArea: (state, action) => {
      state.area = action.payload.area;
    },
  },
});

export const aoiActions =  aoiSlice.actions;

export default aoiSlice.reducer;