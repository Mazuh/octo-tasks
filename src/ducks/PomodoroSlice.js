import { createSlice } from '@reduxjs/toolkit';
import { initialSettings } from '../services/settings';

const initialState = {
  type: 'pomodoro',
  cofig: initialSettings
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
