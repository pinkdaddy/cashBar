const { shell } = require('electron'); // eslint-disable-line
const pkg = require('../../package.json');

module.exports = {
  label: 'About',
  submenu: [
    { label: `v${pkg.version}`, enabled: false },
    { label: 'Check for updates', click() { shell.openExternal('https://github.com/johneas10/cashBar/releases'); } },
    { type: 'separator' },
  ],
};
