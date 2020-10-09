import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  type: 'pomodoro',
  time: 25,
  isRunning: false,
  start: 0
};

const pomodoroSlice = createSlice({
  name: 'pomodoro',
  initialState,
  reducers: {
    setType: (state, action) => {
      state.type = action.payload;
    },
    setTime: (state, action) => {
      state.time = action.payload;
    },
    setRunning: (state, action) => {
      state.isRunning = action.payload
    },
    setStart: (state, action) => {
      state.start = action.payload
    }
  }
});

export const {
  setType,
  setTime,
  setRunning,
  setStart
} = pomodoroSlice.actions;

export default pomodoroSlice.reducer;
