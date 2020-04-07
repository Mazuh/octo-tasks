const SETTINGS_KEY = 'octo-settings';

export const initialSettings = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 10,
}

const retrieveSettings = async () => {
  const serialized = localStorage.getItem(SETTINGS_KEY);
  const settings = serialized ? JSON.parse(serialized) : initialSettings;
  return settings;
}

const persistSettings = async settings => {
  const serialized = JSON.stringify(settings);
  localStorage.setItem(SETTINGS_KEY, serialized);
}

export default {
  read: retrieveSettings,
  update: persistSettings,
};
