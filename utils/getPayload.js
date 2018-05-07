const fetch = require('node-fetch');

const errorResponse = response => response.status >= 400;

module.exports = async () => {
  const endpoint = 'https://api.coinmarketcap.com/v2/ticker/1831/?convert=BTC';
  const response = await fetch(endpoint);
  const jsonResponse = await response.json();
  if (errorResponse(response)) {
    throw jsonResponse;
  }
  return jsonResponse;

  // this can be used for development without an internet connection.
  // return require('../fixtures/payload.json');
};
