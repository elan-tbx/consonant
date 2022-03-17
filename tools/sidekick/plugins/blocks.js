/* global ClipboardItem */
const DOMAIN = 'http://localhost:3000';
const BLOCK_LIBRARY = `${DOMAIN}/docs/block-library.json`;
const TEMPLATE_LIBRARY = `${DOMAIN}/docs/template-library.json`;
const COLOR_LIBRARY = `${DOMAIN}/docs/color-library.json`;
const PLACEHOLDER_LIBRARY = `${DOMAIN}/docs/placeholder-library.json`;
const PLUGIN_PATH = `${DOMAIN}/tools/sidekick/plugins`;
const ASSETS_FOLDER = 'https://localhost:8443/api/assets/i-love-helix.json';

const CONTENT_TYPES = ['Blocks', 'Templates', 'Placeholders', 'Colors', 'Assets'];

function createCopy(blob) {
  const data = [new ClipboardItem({ [blob.type]: blob })];
  navigator.clipboard.write(data);
}

function loadStyle(href) {
  if (!document.head.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href);
    document.head.appendChild(link);
  }
}

function getTable(blockName, block) {
  const rows = [...block.children];
  const maxCols = rows.reduce((cols, row) => (
    row.children.length > cols ? row.children.length : cols), 0);
  const table = document.createElement('table');
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `<th colspan="${maxCols}">${blockName}</th>`;
  table.append(headerRow);
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((col) => {
      const td = document.createElement('td');
      if (row.children.length < maxCols) {
        td.setAttribute('colspan', maxCols);
      }
      td.innerHTML = col.innerHTML;
      tr.append(td);
    });
    table.append(tr);
  });
  return table.outerHTML;
}

async function loadBlockList(list) {
  const resp = await fetch(BLOCK_LIBRARY);
  if (resp.status === 200) {
    const json = await resp.json();
    json.data.forEach(async (blockGroup) => {
      const pageResp = await fetch(`${DOMAIN}${blockGroup.path}.plain.html`);
      const html = await pageResp.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const titles = doc.body.querySelectorAll(':scope > div > h2');
      titles.forEach((title) => {
        const blockItem = document.createElement('li');
        const blockName = document.createElement('p');
        blockName.textContent = title.textContent;
        const table = getTable(title.textContent, title.nextElementSibling);

        const copy = document.createElement('button');
        copy.addEventListener('click', (e) => {
          e.target.classList.add('copied');
          setTimeout(() => {
            e.target.classList.remove('copied');
          }, 3000);
          const blob = new Blob([table], { type: 'text/html' });
          createCopy(blob);
        });

        blockItem.append(blockName);
        blockItem.append(copy);
        list.append(blockItem);
      });
    });
  }
}

async function loadTemplateList(list) {
  const resp = await fetch(TEMPLATE_LIBRARY);
  if (resp.status === 200) {
    const json = await resp.json();
    json.data.forEach(async (template) => {
      const item = document.createElement('li');
      const tempName = document.createElement('p');
      tempName.textContent = template.Name;

      const copy = document.createElement('button');
      copy.addEventListener('click', async (e) => {
        e.target.classList.add('copied');
        setTimeout(() => {
          e.target.classList.remove('copied');
        }, 3000);
        const plain = await fetch(`${DOMAIN}${template.path}.plain.html`);
        const text = await plain.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const content = doc.querySelectorAll('body > div > *');
        const html = [...content].reduce((red, el) => {
          if (el.nodeName === 'DIV') {
            return `${red}${getTable(el.className, el)}<br>`;
          }
          return `${red}${el.outerHTML}<br>`;
        }, '');
        const blob = new Blob([html], { type: 'text/html' });
        createCopy(blob);
      });
      item.append(tempName);
      item.append(copy);

      list.append(item);
    });
  }
}

async function loadAssetList(list) {
  const resp = await fetch(ASSETS_FOLDER,
    { credentials: 'same-origin' });
  if (resp.status === 200) {
    const json = await resp.json();
    json.entities.forEach((entity) => {
      const item = document.createElement('li');
      const img = document.createElement('img');
      const { href } = entity.links[0];
      img.src = href.replace(/\.[^/.]+$/, '');

      const copy = document.createElement('button');
      copy.addEventListener('click', async (e) => {
        e.target.classList.add('copied');
        setTimeout(() => {
          e.target.classList.remove('copied');
        }, 3000);
        const data = await fetch(img.src);
        const blob = await data.blob();
        createCopy(blob);
      });

      item.append(img);
      item.append(copy);
      list.append(item);
    });
  }
}

async function loadPlaceholderList(list) {
  const resp = await fetch(PLACEHOLDER_LIBRARY);
  const json = await resp.json();
  json.data.forEach((placeholder) => {
    const item = document.createElement('li');
    const text = document.createElement('p');
    text.textContent = placeholder.key;

    const copy = document.createElement('button');
    copy.addEventListener('click', (e) => {
      e.target.classList.add('copied');

      const blob = new Blob([`{{${text.textContent}}}`], { type: 'text/plain' });
      createCopy(blob);
      setTimeout(() => {
        e.target.classList.remove('copied');
      }, 3000);
    });

    item.append(text);
    item.append(copy);
    list.append(item);
  });
}

async function loadColorList(list) {
  const resp = await fetch(COLOR_LIBRARY);
  const json = await resp.json();
  json.data.forEach((color) => {
    const item = document.createElement('li');
    const name = document.createElement('p');
    name.textContent = color.key;
    item.style.background = color.value;

    const copy = document.createElement('button');
    copy.addEventListener('click', (e) => {
      e.target.classList.add('copied');
      const blob = new Blob([color.value], { type: 'text/plain' });
      createCopy(blob);
      setTimeout(() => {
        e.target.classList.remove('copied');
      }, 3000);
    });

    item.append(name);
    item.append(copy);
    list.append(item);
  });
}

function loadList(type, list) {
  list.innerHTML = '';
  switch (type) {
    case 'Blocks':
      loadBlockList(list);
      break;
    case 'Templates':
      loadTemplateList(list);
      break;
    case 'Assets':
      loadAssetList(list);
      break;
    case 'Placeholders':
      loadPlaceholderList(list);
      break;
    case 'Colors':
      loadColorList(list);
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
  header.insertAdjacentHTML('afterbegin', '<p class="heading">Library</p>');
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
