import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  isAdmin: false,
  iduser: undefined,
  email: '',
  phone: '',
  fn: '',
  ln: '',
  city: '',
  address: '',
  pfp: ''
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    set(state, action) {
      state.isAuth= true;
      state.isAdmin = !!(action.payload.isAdmin);
      state.iduser = action.payload.iduser;
      state.email = action.payload.email;
      state.phone = action.payload.phone;
      state.fn =  action.payload.fn;
      state.ln =  action.payload.ln;
      state.city = action.payload.city;
      state.address = action.payload.address;
      state.pfp = action.payload.pfp;
    },
    reset() {
      return initialState;
    }
  }
});

export const userActions = user.actions;

export default user.reducer;