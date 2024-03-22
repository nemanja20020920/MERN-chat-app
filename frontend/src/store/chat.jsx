import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedChat: {},
};

const reducers = {
  setSelectedChat(state, action) {
    state.selectedChat = { ...action.payload };
  },
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers,
});

export const chatActions = chatSlice.actions;
export default chatSlice.reducer;
