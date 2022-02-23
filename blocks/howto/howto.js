export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const name = rows.shift().textContent;

  const schema = {
    '@context': 'http://schema.org',
    '@type': 'HowTo',
    name,
    step: [],
  };

  rows.forEach((row, idx) => {
    const stepName = row.querySelector(':scope > div:first-of-type').textContent;
    const stepDirection = row.querySelector(':scope > div:last-of-type').textContent;
    schema.step.push({
      '@type': 'HowToStep',
      position: idx + 1,
      name: stepName,
      itemListElement: {
        '@type': 'HowToDirection',
        text: stepDirection,
      },
    });
  });

  const script = document.createElement('script');
  script.setAttribute('type', 'application/ld+json');
  script.innerHTML = JSON.stringify(schema);
  document.head.append(script);
}
