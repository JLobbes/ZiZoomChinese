// public/main.js

import { initUIListeners } from './js/uiListeners.js';
import { applyPersistedSettings } from './js/utils/userSettings/settingsMain.js';
import { renderMenu } from './js/utils/menuConstruction/renderMenuMain.js';

document.addEventListener('DOMContentLoaded', () => {
  applyPersistedSettings();
  renderMenu();
  initUIListeners();
});
