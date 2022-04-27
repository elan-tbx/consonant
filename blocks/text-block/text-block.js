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

import { decorateButtons } from '../../scripts/decorate.js';

/*
 * Text Block - v0.0.1
 */

function styleBackground(background) {
  background.classList.add('background');
  if (!background.querySelector(':scope img')) {
    background.children[0].style.display = 'none';
    background.setAttribute('style', `background: ${background.textContent}`);
  }
}

export default function init(el) {
  const children = el.querySelectorAll(':scope > div');
  const [background, ...rows] = children;
  rows.forEach((row) => {
    const prev = row.previousElementSibling;
    switch (row.children.length) {
      case 1:
        row.classList.add('row', 'container', 'full-width');
        row.querySelector('h1, h2, h3, h4, h5, h6').classList.add('heading');
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
  styleBackground(background);
  decorateButtons(el);
}
