// public/js/utils/menuConstruction/renderMenuMain.js

import { renderImageSection } from './renderImagesMenu.js';
import { renderFixedMenuItems } from './menuHelpers.js';
import uiElements from '../../uiElements.js';

export async function renderMenu() {
  const menu = uiElements.menu;
  menu.innerHTML = '';

  await renderImageSection(menu);
  renderFixedMenuItems(menu);
}