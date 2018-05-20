const isPositive = require('../utils/isPositive');

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
      tray.setTitle(payload ? `₿${btc.price.toFixed(3)}` : '₿0');
      break;
    case 'change1hrUsd':
      title = payload ? usd.percent_change_1h : '0';
      tray.setTitle(`1h: ${(isPositive(title)) ? '+' : ''}${title}%`);
      break;
    case 'change24hrsUsd':
      title = payload ? usd.percent_change_24h : '0';
      tray.setTitle(`24h: ${(isPositive(title)) ? '+' : ''}${title}%`);
      break;
    case 'change7daysUsd':
      title = payload ? usd.percent_change_7d : '0';
      tray.setTitle(`7d: ${(isPositive(title)) ? '+' : ''}${title}%`);
      break;
    default:
      tray.setTitle(payload ? `$${Math.round(usd.price)}` : '$0');
  }
};
