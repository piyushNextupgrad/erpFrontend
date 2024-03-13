import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "loader",
  initialState: {
    value: false,
  },
  reducers: {
    change: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { change } = counterSlice.actions;

export default counterSlice.reducer;
