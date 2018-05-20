const { shell } = require('electron'); // eslint-disable-line

module.exports = {
  label: 'Contact',
  submenu: [
    { label: 'Memo', click() { shell.openExternal('https://memo.cash/profile/12CLvMpDxyeTMkf2XE2LdvEAX3poShMy4n'); } },
    { label: 'Twitter', click() { shell.openExternal('https://twitter.com/johneas10'); } },
    { label: 'Github', click() { shell.openExternal('https://github.com/johneas10/cashBar'); } },
  ],
};
