/* global ClipboardItem */
const INVENTORY = 'http://localhost:3000/documentation/block-inventory.json';
const PLUGIN_PATH = 'http://localhost:3000/tools/sidekick/plugins';

const CONTENT_TYPES = ['Blocks', 'Placeholders', 'Colors', 'Assets'];

function getMarquee(variant, background) {
  return `
  <table>
    <tr><td colspan="2">${variant}</td></tr>
    ${background}
    <tr>
      <td><h1>Title here</h1><p>Content here</p><p><strong><a href="#">Call to Action</a></strong></p></td>
      <td><img src="./placeholder.png" alt="Placeholder"/></td>
    </tr>
  </table>`;
}

function createCopy(variant) {
  const hasBg = !variant.includes('Quiet');
  const bg = hasBg ? '<tr><td colspan="2"><img src="./placeholder.png" alt="Placeholder"/></td></tr>' : '';
  const marquee = getMarquee(variant, bg);
  const type = 'text/html';
  const blob = new Blob([marquee], { type });
  // eslint-disable-next-line no-undef
  const data = [new ClipboardItem({ [type]: blob })];
  navigator.clipboard.write(data);
}

async function createImgCopy(img) {
  try {
    const data = await fetch(img.src);
    const blob = await data.blob();
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob }),
    ]);
    console.log('Image copied.');
  } catch (err) {
    console.error(err.name, err.message);
  }

  // console.log(img);
  // const range = document.createRange();
  // range.selectNode(img);
  // window.getSelection().addRange(range);
  // try {
  //   const suc = document.execCommand('copy');
  //   console.log(suc);
  // } catch (err) {
  //   console.log('didnt copy');
  // }
  // window.getSelection().removeAllRanges();
}

function loadStyle(href, callback) {
  if (!document.querySelector(`head > link[href="${href}"]`)) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href);
    if (typeof callback === 'function') {
      link.onload = (e) => callback(e.type);
      link.onerror = (e) => callback(e.type);
    }
    document.head.appendChild(link);
  } else if (typeof callback === 'function') {
    callback('noop');
  }
}

async function loadBlockList(list) {
  const resp = await fetch(INVENTORY);
  if (resp.status === 200) {
    const json = await resp.json();
    json.data.forEach((block) => {
      const blockItem = document.createElement('li');
      const { name, variant } = block;
      const blockName = document.createElement('p');
      blockName.textContent = name;

      const copy = document.createElement('button');
      copy.addEventListener('click', (e) => {
        e.target.classList.add('copied');
        setTimeout(() => {
          e.target.classList.remove('copied');
        }, 3000);
        createCopy(variant);
      });
      blockItem.append(blockName);
      blockItem.append(copy);
      list.append(blockItem);
    });
  }
}

async function loadAssetList(list) {
  const resp = await fetch('https://localhost:8443/api/assets/we-retail/en/activities/hiking-camping.json',
    { credentials: 'same-origin' });
  if (resp.status === 200) {
    const json = await resp.json();
    json.entities.forEach((entity) => {
      const item = document.createElement('li');
      const img = document.createElement('img');
      const { href } = entity.links[0];
      img.src = href.replace(/\.[^/.]+$/, '');

      const copy = document.createElement('button');
      copy.addEventListener('click', (e) => {
        e.target.classList.add('copied');
        setTimeout(() => {
          e.target.classList.remove('copied');
        }, 3000);
        createImgCopy(img);
      });

      item.append(img);
      item.append(copy);
      list.append(item);
    });
  }
}

function loadList(type, list) {
  list.innerHTML = '';
  switch (type) {
    case 'Blocks':
      loadBlockList(list);
      break;
    case 'Assets':
      loadAssetList(list);
      break;
    default:
      console.log('no list');
  }
}

(function loadContentFinder() {
  loadStyle(`${PLUGIN_PATH}/blocks.css`);
  const finder = document.createElement('div');
  finder.className = 'con-finder';

  // Header
  const header = document.createElement('div');
  header.className = 'con-header';
  header.insertAdjacentHTML('afterbegin', '<p class="heading">Helix Finder</p>');
  const back = document.createElement('button');
  back.addEventListener('click', () => {
    const insetEls = finder.querySelectorAll('.inset');
    insetEls.forEach((el) => {
      el.classList.remove('inset');
    });
    finder.classList.remove('allow-back');
  });
  header.append(back);
  finder.append(header);

  // Container
  const container = document.createElement('div');
  container.className = 'con-container';
  finder.append(container);

  const contentList = document.createElement('ul');
  container.append(contentList);

  CONTENT_TYPES.forEach((type) => {
    const item = document.createElement('li');
    item.className = 'content-type';
    item.innerHTML = `<p>${type}</p>`;
    contentList.appendChild(item);

    const typeList = document.createElement('ul');
    typeList.classList.add('con-type-list', `con-${type}-list`);
    container.append(typeList);

    item.addEventListener('click', () => {
      contentList.classList.add('inset');
      typeList.classList.add('inset');
      finder.classList.add('allow-back');
      loadList(type, typeList);
    });
  });
  document.body.append(finder);
}());
