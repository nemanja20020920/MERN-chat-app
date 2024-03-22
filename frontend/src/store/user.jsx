import { createSlice } from '@reduxjs/toolkit';

const userData = JSON.parse(localStorage.getItem('userData'));

const initialState = {
  _id: userData?._id ?? '',
  fullName: userData?.fullName ?? '',
  email: userData?.email ?? '',
  pic: userData?.pic ?? '',
  token: userData?.token ?? '',
  chatCreated: true,
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
  setChatCreated: (state) => {
    state.chatCreated = !state.chatCreated;
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
