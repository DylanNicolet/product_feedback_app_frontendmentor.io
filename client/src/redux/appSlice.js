import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
  name: 'appState',
  initialState: {
    screenWidth: window.innerWidth,
    activeFilter: "All",
    currentUser: "",
    currentUserUpvotes: []
  },
  reducers: {
    updateState: (state, action) => {
      state.screenWidth = action.payload.screenWidth
    },
    updateActiveFilter: (state, action) => {
      state.activeFilter = action.payload.activeFilter
    },
    updateCurrentUser: (state, action) => {
      state.currentUser = action.payload.currentUser
    },
    updateCurrentUserUpvotes: (state, action) => {
      state.currentUserUpvotes = action.payload.currentUserUpvotes
    }
  }
})

export const { updateState, updateActiveFilter, updateCurrentUser, updateCurrentUserUpvotes } = appSlice.actions

export default appSlice.reducer