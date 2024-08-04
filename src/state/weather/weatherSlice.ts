import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = [] as any;

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    searchHistory: (state, action: PayloadAction<any>) => {
      if (state.includes(action.payload)) {
        return state;
      } else {
        state.push(action.payload);
      }
    },
    deleteHistory: (state, action: PayloadAction<any>) => {
      return state.filter((item) => item !== action.payload);
    },
  },
});
export const { searchHistory, deleteHistory } = weatherSlice.actions;
export const reducer = weatherSlice.reducer;
export default reducer;
