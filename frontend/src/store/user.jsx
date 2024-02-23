import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  _id: '',
  fullName: '',
  email: '',
  pic: '',
  token: '',
};

const reducers = {
  setUser: (state, action) => {
    const userData = action.payload;

    state._id = userData._id;
    state.fullName = userData.fullName;
    state.email = userData.email;
    state.pic = userData.pic;
    state.token = userData.token;
  },
  logout: (state) => {
    state._id = '';
    state.fullName = '';
    state.email = '';
    state.pic = '';
    state.token = '';
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers,
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
