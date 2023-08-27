import { createSlice } from "@reduxjs/toolkit";

const initialState: number[] = [];

const favs = createSlice({
    name: 'favs',
    initialState,
    reducers: {
        add (state, action) {
            return [...state, action.payload];
        },
        remove (state, action) {
            return state.filter(i => i !== action.payload);
        },
        set (state, action) {
            return action.payload;
        },
        reset (state) {
            return initialState;
        }
    }
});

export const favsActions = favs.actions;

export default favs.reducer;