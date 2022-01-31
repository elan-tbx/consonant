window.hlx.initSidekick({
  project: 'Consonant',
  hlx3: true,
  plugins: [
    {
      id: 'blocks',
      button: {
        text: 'Blocks',
        action: (_, sk) => {
          console.log(sk);
        },
      },
    },
  ],
});
