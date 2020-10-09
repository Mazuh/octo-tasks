import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  type: 'pomodoro'
};

const pomodoroSlice = createSlice({
  name: 'pomodoro',
  initialState,
  reducers: {
    setType: (state, action) => {
      state.type = action.payload;
    }
  }
});

export const { setType } = pomodoroSlice.actions;

export default pomodoroSlice.reducer;
