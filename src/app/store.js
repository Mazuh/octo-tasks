import { configureStore } from '@reduxjs/toolkit';
import pomodoroReducer from '../ducks/PomodoroSlice';

const store = configureStore({
  reducer: {
    pomodoro: pomodoroReducer
  }
});

export default store;
