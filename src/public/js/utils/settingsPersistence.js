const SETTINGS_KEY = 'ziZoomUserSettings';

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadSettings() {
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) : {};
}