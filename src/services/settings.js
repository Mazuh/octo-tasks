const SETTINGS_KEY = 'octo-settings';

const initialSettings = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 10,
}

export const retrieveSettings = () => {
  const serialized = localStorage.getItem(SETTINGS_KEY);
  const settings = serialized ? JSON.parse(serialized) : [initialSettings];
  return settings;
}

export const persistSettings = async settings => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
