import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  type: 'pomodoro',
  time: 25
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
    }
  }
});

export const { setType, setTime } = pomodoroSlice.actions;

export default pomodoroSlice.reducer;
