import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosConfigStay from "../../configs/axiosConfig.js";
import axios from "axios";

const stayIndex = createAsyncThunk(
    'staySlice/stayIndex',
    async (arg, thunkAPI) => {

        const state = thunkAPI.getState();

        const url = `${axiosConfigStay.BASE_URL}/searchStay2`;
        const config = {
            params: {
                serviceKey: axiosConfigStay.SERVICE_KEY,
                MobileOS: axiosConfigStay.MOBILE_OS,
                MobileApp: axiosConfigStay.MOBILE_App,
                _type: axiosConfigStay.TYPE,
                modifiedtime: axiosConfigStay.MODIFIEDTIME,
                arrange: axiosConfigStay.ARRANGE,
                numOfRows: axiosConfigStay.NUM_OF_ROWS,
                pageNo: state.stay.page + 1,
                areacode: axiosConfigStay.AREACODE,
                sigungucode: axiosConfigStay.SIGUNGUCODE,
            }
        }

    const response = await axios.get(url, config);
    return response.data.response.body;
    }
);


export { 
  stayIndex
};