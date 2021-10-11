/*
 * Author: Maria Caravez
 * Description: Redux slice that shall contain community
 * information based on an area of interest set by the user.
 */

import { createSlice } from "@reduxjs/toolkit";

export const aoiSlice = createSlice({
  name: "areaOfInterest",
  initialState: {
    communityInfo: [],
    area: null,
    bounds: [],
    update: false,
    openDashboard: false,
  },
  reducers: {
    setCommunityInfo: (state, action) => {
      state.communityInfo.push({
        type: action.payload.type,
        label: action.payload.label,
      });
    },
    clearCommunityInfo: (state) => {
      state.communityInfo.length = 0;
    },
    setArea: (state, action) => {
      state.area = action.payload.area;
    },
    setBounds: (state, action) => {
      state.bounds.push({
        north: action.payload.north,
        east: action.payload.east,
        south: action.payload.south,
        west: action.payload.west,

      });
    },
    clearBounds: (state) => {
      state.bounds.length = 0;
    },
    updateInfo: (state, action) => {
      state.update = action.payload.update;
    },
    setOpenDashboard: (state, action) => {
      state.openDashboard = action.payload.openDashboard;
    },
  },
});

export const aoiActions = aoiSlice.actions;

export default aoiSlice.reducer;
