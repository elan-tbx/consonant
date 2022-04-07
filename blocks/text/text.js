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

/*
 * Text - v0.0.1
 */

export default function init(el) {
  const rows = el.querySelectorAll(':scope > div');
  rows.forEach((row) => {
    switch (row.children.length) {
      case 1:
        row.classList.add('row', 'full-width');
        break;
      case 2:
        row.classList.add('row', 'two-up');
        if (row.previousElementSibling && row.previousElementSibling.classList.contains('full-width')) {
          row.previousElementSibling.classList.add('pre-up', 'pre-two-up');
        }
        break;
      case 3:
        row.classList.add('row', 'three-up');
        if (row.previousElementSibling && row.previousElementSibling.classList.contains('full-width')) {
          row.previousElementSibling.classList.add('pre-up', 'pre-three-up');
        }
        break;
      default:
    }
  });
}
