const { app, Menu, shell, Tray } = require('electron'); // eslint-disable-line
const path = require('path');
const getPayload = require('./utils/getPayload');
const pkg = require('./package.json');

const iconsDir = path.join(__dirname, 'images');

let tray;
let payload;
let selectedTitle = 'usd';

// returns bool so setTitle knows if it should add a '+'
const isPositive = title => (title > 0);

// sets title values
const setTitle = () => {
  const { data } = payload;
  const { quotes } = data;
  const { USD, BTC } = quotes;

  if (selectedTitle === 'usd') {
    tray.setTitle(`$${Math.round(USD.price)}`);
  } else if (selectedTitle === 'btc') {
    tray.setTitle(`₿${BTC.price.toFixed(3)}`);
  } else if (selectedTitle === 'change1hrUsd') {
    const title = USD.percent_change_1h;
    tray.setTitle(`1h: ${(isPositive(title)) ? '+' : ''}${title}%`);
  } else if (selectedTitle === 'change24hrsUsd') {
    const title = USD.percent_change_24h;
    tray.setTitle(`24h: ${(isPositive(title)) ? '+' : ''}${title}%`);
  } else if (selectedTitle === 'change7daysUsd') {
    const title = USD.percent_change_7d;
    tray.setTitle(`7d: ${(isPositive(title)) ? '+' : ''}${title}%`);
  }
};

// toggles title between USD and BTC
const toggleTitle = (title) => {
  if (selectedTitle !== title) {
    selectedTitle = title;
  }
};

// gets payload from API
const updatePayload = async () => {
  payload = await getPayload();
  setTitle();
};

// hides app from dock
app.dock.hide();

app.on('ready', async () => {
  const icon = `${iconsDir}/icon.png`;
  payload = await getPayload();
  tray = new Tray(icon);
  setTitle();

  // creates menu
  const appMenu = Menu.buildFromTemplate([

    // USD/BCH & BTC/BCH
    { label: 'USD', type: 'radio', click() { toggleTitle('usd'); setTitle(); } },
    { label: 'BTC', type: 'radio', click() { toggleTitle('btc'); setTitle(); } },

    // % changed in USD
    { label: 'Change % 1hr', type: 'radio', click() { toggleTitle('change1hrUsd'); setTitle(); } },
    { label: 'Change % 24hr', type: 'radio', click() { toggleTitle('change24hrsUsd'); setTitle(); } },
    { label: 'Change % 7d', type: 'radio', click() { toggleTitle('change7daysUsd'); setTitle(); } },

    { type: 'separator' },

    {
      label: 'About',
      submenu: [
        { label: 'Check for updates', click() { shell.openExternal('https://github.com/johneas10/cashBar/releases'); } },
        { label: `Version v${pkg.version}`, enabled: false },
      ],
    },
    {
      label: 'Contact',
      submenu: [
        { label: 'Twitter', click() { shell.openExternal('https://twitter.com/johneas10'); } },
        { label: 'Github', click() { shell.openExternal('https://github.com/johneas10/cashBar'); } },
      ],
    },
    { type: 'separator' },
    { label: 'Quit', role: 'quit' },
  ]);

  // builds menu with template, appMenu
  tray.setContextMenu(appMenu);

  // rock the cashbar!
  tray.on('right-click', () => shell.openExternal('https://www.youtube.com/watch?v=bJ9r8LMU9bQ'));

  // updates app every 1min
  setInterval(updatePayload, 60000);
});
