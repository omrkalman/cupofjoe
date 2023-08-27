import { createSlice } from "@reduxjs/toolkit";
import { ProductFilters } from "../types/types";

const initialState: ProductFilters = {
  name: '',
  category: '',
  min: undefined,
  max: undefined,
  sort: '',
  page: undefined,
  amount: undefined
}

const filters = createSlice({
  name: "filters",
  initialState,
  reducers: {
    set(state, action) {
      return action.payload;
    },
    nextPage(state) {
      state.page ||= 1;
      state.page++;
    },
    resetPage(state) {
      state.page = undefined;
    },
    reset() {
      return initialState;
    }
  }
});

export const filtersActions = filters.actions;

export default filters.reducer;