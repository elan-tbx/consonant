import { decorateBlock, loadBlock } from '../../scripts/scripts.js';

const fetchFragment = async (path) => {
  const resp = await fetch(`${path}.plain.html`);
  if (resp.ok) {
    return resp.text();
  }
  return null;
};

const loadFragment = async (fragmentEl) => {
  const path = fragmentEl.querySelector('div > div').textContent;
  const html = await fetchFragment(path);
  if (html) {
    fragmentEl.insertAdjacentHTML('beforeend', html);
    fragmentEl.querySelector('div').remove();

    const blocks = fragmentEl.querySelectorAll('div[class]');
    blocks.forEach((block) => {
      console.log(block);
      decorateBlock(block);
      loadBlock(block, true);
    });

    fragmentEl.classList.add('is-Visible');
  }
};

export default loadFragment;
