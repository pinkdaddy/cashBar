const { app, Menu, shell, Tray, Notification } = require('electron'); // eslint-disable-line
const path = require('path');
const Store = require('electron-store');
const getPayload = require('./app/serviceCalls/getPayload');
const setTitle = require('./app/utils/setTitle');
const donateMenu = require('./app/menus/donate');
const contactMenu = require('./app/menus/contact');
const aboutMenu = require('./app/menus/about');
const noInternetNotification = require('./app/notifications/noInternet');
const toggleTitle = require('./app/utils/toggleTitle');

const imagesDir = path.join(__dirname, '/app/images');

const store = new Store();
let tray;

const initialiseLocalStorage = () => {
  if (store.get('selectedTitle') === undefined) {
    store.set('selectedTitle', 'usd');
  }
};

const updatePayload = async () => {
  try {
    const payload = await getPayload();
    store.set({ payload });
  } catch (err) {
    // try to update every 10seconds until a payload is received
    setTimeout(updatePayload, 10000);
  }
  setTitle(store, tray);
};

if (process.platform === 'darwin') {
  app.dock.hide();
}

app.on('ready', async () => {
  initialiseLocalStorage();
  try {
    const payload = await getPayload();
    store.set({ payload });
  } catch (err) {
    new Notification(noInternetNotification).show();
    updatePayload();
  }
  tray = new Tray(`${imagesDir}/icon.png`);
  setTitle(store, tray);

  const appMenu = Menu.buildFromTemplate([
    {
      label: 'USD', type: 'checkbox', id: 'usd', click() { toggleTitle(store, 'usd', appMenu); setTitle(store, tray); },
    },
    {
      label: 'BTC', type: 'checkbox', id: 'btc', click() { toggleTitle(store, 'btc', appMenu); setTitle(store, tray); },
    },
    {
      label: 'Change %',
      submenu: [{
        label: '1 Hour', type: 'checkbox', id: 'change1hrUsd', click() { toggleTitle(store, 'change1hrUsd', appMenu); setTitle(store, tray); },
      },
      {
        label: '24 Hours', type: 'checkbox', id: 'change24hrsUsd', click() { toggleTitle(store, 'change24hrsUsd', appMenu); setTitle(store, tray); },
      },
      {
        label: '7 Days', type: 'checkbox', id: 'change7daysUsd', click() { toggleTitle(store, 'change7daysUsd', appMenu); setTitle(store, tray); },
      }],
    },
    { type: 'separator' },
    donateMenu,
    contactMenu,
    aboutMenu,
    { type: 'separator' },
    { label: 'Quit', role: 'quit' },
  ]);

  tray.setContextMenu(appMenu);

  // default checked item to usd
  appMenu.getMenuItemById(store.get('selectedTitle')).checked = true;

  tray.on('right-click', () => shell.openExternal('https://www.youtube.com/watch?v=bJ9r8LMU9bQ'));

  // update app every 5min
  setInterval(updatePayload, 300000);
});
