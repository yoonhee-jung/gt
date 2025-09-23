import { createSlice } from "@reduxjs/toolkit";
import { stayIndex } from "../thunks/stayThunk.js"
import { localStorageUtilStay } from "../../utils/localStorageUtilStay.js";

const staySlice = createSlice({
    name: 'staySlice',
    initialState: {
        list: localStorageUtilStay.getStayList() ? localStorageUtilStay.getStayList() : [],
        page: localStorageUtilStay.getStayList() ? localStorageUtilStay.getStayPage() : 0,
        scrollEventFlg: localStorageUtilStay.getStayScrollFlg() ? localStorageUtilStay.getStayScrollFlg() : true,
    },
    reducers: {
        setScrollEventFlg: (state, action) => {
            state.scrollEventFlg = action.payload;
        }
    },
    extraReducers: builder => {
        builder
        .addCase(stayIndex.fulfilled, (state,action) => {
                if(action.payload.items?.item) {
                    state.list = [...state.list, ...action.payload.items.item];
                    state.page = action.payload.pageNo;
                    state.scrollEventFlg = true;

                    localStorageUtilStay.setStayList(state.list);
                    localStorageUtilStay.setStayPage(state.page);
                    localStorageUtilStay.setStayScrollFlg(state.scrollEventFlg);

        } else {
          state.scrollEventFlg = false;
        }
    }) 
    .addMatcher(
        action => action.type.endsWith('/rejected'),
        (state, action) => {
            console.error('에러', action.error);
        }
    );
        }
    });

    export const {
        setScrollEventFlg
    } = staySlice.actions;

    export default staySlice.reducer;