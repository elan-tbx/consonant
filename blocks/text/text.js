/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { decorateButtons, decorateContent } from '../../scripts/decorate.js';

/*
 * Text Block - v0.0.1
 */

export default function init(el) {
  const children = el.querySelectorAll(':scope > div');
  const [background, ...rows] = children;
  // basic background handling
  if (!background.querySelector(':scope img')) {
    el.setAttribute('style', `background: ${background.textContent}`);
    background.remove();
  }

  // create foreground
  const container = document.createElement('div');
  container.classList.add('foreground', 'container');
  el.appendChild(container);

  // process rows
  rows.forEach((row, idx) => {
    let headingClass = 'heading-M';
    if (idx === 0 && (el.classList.contains('full-width') || el.classList.contains('has-intro'))) {
      row.children[0].classList.add('full-width');
      headingClass = el.classList.contains('large') ? 'heading-XL' : 'heading-L';
    }
    decorateContent(row, ['', headingClass, 'body-M']);
    container.insertAdjacentElement('beforeend', row.children[0]);
    row.remove();

    const prev = row.previousElementSibling;
    switch (row.children.length) {
      case 1:
        break;
      case 2:
        row.classList.add('row', 'container', 'vertical', 'two-up');
        if (prev && prev.classList.contains('full-width')) {
          prev.classList.add('pre-up', 'pre-two-up');
        }
        break;
      case 3:
        row.classList.add('row', 'container', 'vertical', 'three-up');
        if (prev && prev.classList.contains('full-width')) {
          prev.classList.add('pre-up', 'pre-three-up');
        }
        break;
      default:
        // invalid number of columns, hide row
        row.classList.add('hidden');
    }
  });
  decorateButtons(el);
}
