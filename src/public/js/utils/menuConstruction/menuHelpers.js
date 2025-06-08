// public/js/utils/menuConstruction/menuHelpers.js

import { startQuizMode } from '../quizMode/startQuizMode.js';

export function createMenuItem(text, onClick = null) {
  const el = document.createElement('div');
  el.className = 'menuItem';
  el.textContent = text;
  if (onClick) el.addEventListener('click', onClick);
  return el;
}

export function appendAddSubfolderBtn(container, label, onCreate) {
  const addItem = createMenuItem(`+ New ${label}`, () => {
    const name = prompt(`Enter new ${label.toLowerCase()} name:`);
    if (name) onCreate(name);
  });
  addItem.classList.add('add-item');
  container.appendChild(addItem);
}

export function renderFixedMenuItems(container) {
    container.appendChild(createMenuItem('🧠 Quiz Mode', startQuizMode));
  container.appendChild(createMenuItem('⚙️ Settings', () => console.log('Settings')));
}
