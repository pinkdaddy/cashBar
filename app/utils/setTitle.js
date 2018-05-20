const isPositive = require('../utils/isPositive');

const setTitle = (input, tray) => {
  if (process.platform === 'darwin') {
    tray.setTitle(input);
  } else if (process.platform === 'win32') {
    tray.setToolTip(input);
  }
};

module.exports = (store, tray) => {
  const payload = store.get('payload');
  const selectedTitle = store.get('selectedTitle');

  let usd;
  let btc;
  let title;

  if (payload) {
    const { data } = payload;
    const { quotes } = data;
    const { USD, BTC } = quotes;

    usd = USD;
    btc = BTC;
  }

  switch (selectedTitle) {
    case 'btc':
      setTitle(payload ? `₿${btc.price.toFixed(3)}` : '₿0', tray);
      break;
    case 'change1hrUsd':
      title = payload ? usd.percent_change_1h : '0';
      setTitle(`1h: ${(isPositive(title)) ? '+' : ''}${title}%`, tray);
      break;
    case 'change24hrsUsd':
      title = payload ? usd.percent_change_24h : '0';
      setTitle(`24h: ${(isPositive(title)) ? '+' : ''}${title}%`, tray);
      break;
    case 'change7daysUsd':
      title = payload ? usd.percent_change_7d : '0';
      setTitle(`7d: ${(isPositive(title)) ? '+' : ''}${title}%`, tray);
      break;
    default:
      setTitle(payload ? `$${Math.round(usd.price)}` : '$0', tray);
  }
};
