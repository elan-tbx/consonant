window.hlx.initSidekick({
  project: 'Consonant',
  hlx3: true,
  plugins: [
    {
      id: 'blocks',
      condition: true,
      button: {
        text: 'Blocks',
        action: (_, sk) => {
          console.log(sk);
        },
      },
    },
  ],
});
