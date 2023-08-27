import { createSlice } from "@reduxjs/toolkit";
import { Category } from "../types/types";

const initialState = {
    isDarkMode: true,
    shop: {
        isShop: false,
        isCardMode: true,
        glowingCategory: 'machines'
    }
    
};

const visual = createSlice({
    name: 'visual',
    initialState,
    reducers: {
        toggleDarkMode(state) {
            state.isDarkMode = !state.isDarkMode;
        },
        activateShop(state) {
            state.shop.isShop = true;
            state.shop.glowingCategory = 'machines';
        },
        deactivateShop(state) {
            state.shop.isShop = false;
            state.shop.glowingCategory = '';
        },
        toggleShopMode(state) {
            state.shop.isCardMode = !state.shop.isCardMode;
        },
        setGlowingCategory(state, action: {
            payload: Category
        }) {
            state.shop.glowingCategory = action.payload;
        }
    }
})

export const visualActions = visual.actions;

export default visual.reducer;