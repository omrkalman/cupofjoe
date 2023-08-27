import { configureStore } from "@reduxjs/toolkit";
import visual from "./visual";
import user from "./user";
import filters from "./filters";
import favs from './favs';

const store = configureStore({
    reducer: {
        visual,
        user,
        filters,
        favs
    }
});
  
export default store;
  
