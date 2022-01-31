window.hlx.initSidekick({
  project: 'Consonant',
  hlx3: true,
  plugins: [
    {
      id: 'blocks',
      condition: (sk) => sk.isEditor() && (sk.location.search.includes('.docx&')),
      button: {
        text: 'Blocks',
        action: (_, sk) => {
          console.log(sk);
        },
      },
    },
  ],
});
