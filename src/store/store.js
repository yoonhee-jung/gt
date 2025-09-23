import { configureStore } from "@reduxjs/toolkit";
import festivalReducer from './slices/festivalSlice.js';
import festivalShowReducer from './slices/festivalShowSlice.js';
import stayReducer from './slices/staySlice.js';
import stayShowReducer from './slices/stayShowSlice.js';

export default configureStore({
  reducer: {
    festival: festivalReducer,
    festivalShow: festivalShowReducer,
    stay: stayReducer,
    stayShow: stayShowReducer,
  }
});