const path = require('path');

const imagesDir = path.join(__dirname, '../images');

module.exports = {
  title: 'CashBar',
  subtitle: 'No internet connection detected.',
  body: 'I\'ll keep trying until it\'s back.',
  icon: `${imagesDir}/app-icon.png`,
};
