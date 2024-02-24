import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
  name: 'appState',
  initialState: {
    screenWidth: window.innerWidth,
    cartOpen: false,
  },
  reducers: {
    updateState: (state, action) => {
      state.screenWidth = action.payload.screenWidth
    },
    updateCartOpen: (state, action) => {
      state.cartOpen = action.payload.cartOpen
    },
  }
})

// Action creators are generated for each case reducer function
export const { updateState, updateCartOpen } = appSlice.actions

export default appSlice.reducer