import { createSlice } from "@reduxjs/toolkit";

const festivalShowSlice = createSlice({
  name: 'festivalShowSlice', //일반적으로 파일명과 동일함
  initialState: {

    festivalInfo: {},
  },
  reducers: {
    setFestivalInfo(state, action) {
      state.festivalInfo = action.payload;
    },
  },

});

export const {
setFestivalInfo

} =festivalShowSlice.actions;

export default festivalShowSlice.reducer;