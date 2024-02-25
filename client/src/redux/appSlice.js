import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
  name: 'appState',
  initialState: {
    screenWidth: window.innerWidth,
    activeFilter: "All"
  },
  reducers: {
    updateState: (state, action) => {
      state.screenWidth = action.payload.screenWidth
    },
    updateActiveFilter: (state, action) => {
      state.activeFilter = action.payload.activeFilter
    },
  }
})

// Action creators are generated for each case reducer function
export const { updateState, updateActiveFilter } = appSlice.actions

export default appSlice.reducer