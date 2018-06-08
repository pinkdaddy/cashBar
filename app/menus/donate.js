const { shell, clipboard } = require('electron'); // eslint-disable-line

module.exports = {
  label: 'Donate',
  submenu: [
    { label: 'qqt6s297xutn7vfpj3k2tuua6fgdz2a95v9kyz69ws', click() { clipboard.writeText('qqt6s297xutn7vfpj3k2tuua6fgdz2a95v9kyz69ws'); } },
    { type: 'separator' },
    { label: '(click to copy)', enabled: false },
  ],
};
