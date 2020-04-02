const SETTINGS_KEY = 'octo-settings';

const initialSettings = {
  promodoro: 25,
  shortBreak: 5,
  longBreak: 10,
}

export const retrieveSettings = async () => {
  const serialized = localStorage.getItem(SETTINGS_KEY);
  const settings = serialized ? JSON.parse(serialized) : [];
  return settings;
}

export const persistSettings = async settings => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
