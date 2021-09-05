import { createSlice } from "@reduxjs/toolkit";

export const baseMapSlice = createSlice({
  name: "mapInfo",
  initialState: {
    lng: -74.5,
    lat: 40,
    zoom: 2,
    currentMap: 1,
    communityName: "hello"
  },
  reducers: {
    setLng: (state, action) => {
      state.lng = action.payload.lng;
    },
    setLat: (state, action) => {
      state.lat = action.payload.lat;
    },
    setZoom: (state, action) => {
      state.zoom = action.payload.zoom;
    },
    setCurrentMap: (state, action) => {
      state.currentMap = action.payload.currentMap;
    },
    setCommunityName: (state, action) => {
      state.communityName = action.payload;
    }
  },
});

export const mapInfoActions =  baseMapSlice.actions;

export default baseMapSlice.reducer;
