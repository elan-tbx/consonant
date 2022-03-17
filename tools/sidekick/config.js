window.hlx.initSidekick({
  project: 'Consonant',
  hlx3: true,
  plugins: [
    {
      id: 'library',
      button: {
        text: 'Library',
        action: () => {
          const script = document.createElement('script');
          script.src = 'http://localhost:3000/tools/sidekick/plugins/blocks.js';
          document.head.appendChild(script);
        },
      },
    },
  ],
});
