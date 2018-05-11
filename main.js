const { app, Menu, shell, Tray, Notification } = require('electron'); // eslint-disable-line
const path = require('path');
const getPayload = require('./utils/getPayload');
const pkg = require('./package.json');

const imagesDir = path.join(__dirname, 'images');

let noInternetNotification;
let payload;
let selectedTitle = 'usd';
let tray;
let appMenu;

// return bool so setTitle knows if it should add a '+'
const isPositive = title => (title > 0);

// set title values
const setTitle = () => {
  let usd;
  let btc;

  if (payload) {
    const { data } = payload;
    const { quotes } = data;
    const { USD, BTC } = quotes;

    usd = USD;
    btc = BTC;
  }

  if (selectedTitle === 'usd') {
    tray.setTitle(payload ? `$${Math.round(usd.price)}` : '$0');
  } else if (selectedTitle === 'btc') {
    tray.setTitle(payload ? `₿${btc.price.toFixed(3)}` : '₿0');
  } else if (selectedTitle === 'change1hrUsd') {
    const title = payload ? usd.percent_change_1h : '0';
    tray.setTitle(`1h: ${(isPositive(title)) ? '+' : ''}${title}%`);
  } else if (selectedTitle === 'change24hrsUsd') {
    const title = payload ? usd.percent_change_24h : '0';
    tray.setTitle(`24h: ${(isPositive(title)) ? '+' : ''}${title}%`);
  } else if (selectedTitle === 'change7daysUsd') {
    const title = payload ? usd.percent_change_7d : '0';
    tray.setTitle(`7d: ${(isPositive(title)) ? '+' : ''}${title}%`);
  }
};

// toggle title between USD, BTC & Change %
const toggleTitle = (title) => {
  // uncheck/check selected menu item
  appMenu.getMenuItemById(selectedTitle).checked = false;
  appMenu.getMenuItemById(title).checked = true;

  //
  if (selectedTitle !== title) {
    selectedTitle = title;
  }
};

// get payload
const updatePayload = async () => {
  try {
    payload = await getPayload();
  } catch (err) {
    // try to update every 10seconds until a payload is received
    setTimeout(updatePayload, 10000);
  }
  setTitle();
};

// hide app from dock
app.dock.hide();

app.on('ready', async () => {
  // menubar icon
  const icon = `${imagesDir}/icon.png`;

  // create notification for no internet
  noInternetNotification = new Notification({
    title: 'CashBar',
    subtitle: 'No internet connection detected.',
    body: 'I\'ll keep trying until it\'s back.',
    icon: `${imagesDir}/app-icon.png`,
  });

  // get payload
  try {
    payload = await getPayload();
  } catch (err) {
    noInternetNotification.show();
    updatePayload();
  }
  tray = new Tray(icon);
  setTitle();

  // create menu
  appMenu = Menu.buildFromTemplate([

    // USD/BCH & BTC/BCH
    {
      label: 'USD', type: 'checkbox', id: 'usd', click() { toggleTitle('usd'); setTitle(); },
    },
    {
      label: 'BTC', type: 'checkbox', id: 'btc', click() { toggleTitle('btc'); setTitle(); },
    },

    // % change in USD
    {
      label: 'Change %',
      submenu: [
        {
          label: '1 Hour', type: 'checkbox', id: 'change1hrUsd', click() { toggleTitle('change1hrUsd'); setTitle(); },
        },
        {
          label: '24 Hours', type: 'checkbox', id: 'change24hrsUsd', click() { toggleTitle('change24hrsUsd'); setTitle(); },
        },
        {
          label: '7 Days', type: 'checkbox', id: 'change7daysUsd', click() { toggleTitle('change7daysUsd'); setTitle(); },
        },
      ],
    },

    { type: 'separator' },

    // contact menu
    {
      label: 'Contact',
      submenu: [
        { label: 'Twitter', click() { shell.openExternal('https://twitter.com/johneas10'); } },
        { label: 'Github', click() { shell.openExternal('https://github.com/johneas10/cashBar'); } },
      ],
    },

    // about menu
    {
      label: 'About',
      submenu: [
        { label: `v${pkg.version}`, enabled: false },
        { label: 'Check for updates', click() { shell.openExternal('https://github.com/johneas10/cashBar/releases'); } },
      ],
    },

    { type: 'separator' },
    { label: 'Quit', role: 'quit' },
  ]);

  // build menu with template, appMenu
  tray.setContextMenu(appMenu);

  appMenu.getMenuItemById('usd').checked = true;

  // rock the cashbar!
  tray.on('right-click', () => shell.openExternal('https://www.youtube.com/watch?v=bJ9r8LMU9bQ'));

  // update app every 1min
  setInterval(updatePayload, 60000);
});
