import { configureStore } from '@reduxjs/toolkit';
import pomodoroReducer from '../ducks/PomodoroSlice';
import tasksReducer from '../ducks/TaskResource';

const store = configureStore({
  reducer: {
    pomodoro: pomodoroReducer,
    tasks: tasksReducer
  }
});

export default store;
