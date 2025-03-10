import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  adminInfo: localStorage.getItem('adminInfo')
    ? JSON.parse(localStorage.getItem('adminInfo'))
    : null,
};

const adminSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.adminInfo = action.payload;
      localStorage.setItem('adminInfo', JSON.stringify(action.payload));
    },
    adminlogout: (state) => {
      state.adminInfo = null;
      localStorage.removeItem('adminInfo');
    },
  },
});

export const { setCredentials, adminlogout } = adminSlice.actions;
export default adminSlice.reducer;
