import { createSlice } from '@reduxjs/toolkit';
import { initialSettings } from '../services/settings';

const initialState = {
  type: 'pomodoro',
  time: 25,
  isRunning: false,
  start: 0,
  config: initialSettings,
  compact: false
};

const pomodoroSlice = createSlice({
  name: 'pomodoro',
  initialState,
  reducers: {
    setType: (state, action) => {
      state.type = action.payload;
      state.time = state.config[action.payload];
      state.start = 0;
      state.isRunning = false;
    },
    setTime: (state, action) => {
      state.time = action.payload;
    },
    setRunning: (state, action) => {
      state.isRunning = action.payload;
    },
    setStart: (state, action) => {
      state.start = action.payload;
    },
    setConfig: (state, action) => {
      state.config = action.payload;
    },
    setCompact: (state, action) => {
      state.compact = action.payload;
    }
  }
});

export const {
  setType,
  setTime,
  setRunning,
  setStart,
  setConfig,
  setCompact
} = pomodoroSlice.actions;

export default pomodoroSlice.reducer;
