import { createSlice } from '@reduxjs/toolkit'

export const user = createSlice({
  name: 'user',
  initialState: { info: '' },

  reducers: {
    setUserInfo: (state, action) => {
      state.info = action.payload
    },
  },
})

export const { setUserInfo } = user.actions
