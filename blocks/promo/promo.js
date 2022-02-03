function decorateButtons(el) {
  const buttons = el.querySelectorAll('em a, strong a');
  buttons.forEach((button) => {
    const parent = button.parentElement;
    const buttonType = parent.nodeName === 'STRONG' ? 'blue' : 'outline';
    button.classList.add('con-button', buttonType);
    parent.insertAdjacentElement('afterend', button);
    parent.remove();
  });
  if (buttons.length > 0) {
    buttons[0].closest('p').classList.add('action-area');
  }
}

export default function init(el) {
  const bgContainer = el.children[0];
  bgContainer.classList.add('hide');
  const bg = bgContainer.querySelector('div').textContent;
  el.style.background = bg;
  decorateButtons(el);
}
