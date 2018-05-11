const fetch = require('node-fetch');

const errorResponse = response => response.status >= 400;

module.exports = async () => {
  try {
    const endpoint = 'https://api.coinmarketcap.com/v2/ticker/1831/?convert=BTC';
    const response = await fetch(endpoint, { timeout: 2000 });
    const jsonResponse = await response.json();
    if (errorResponse(response)) {
      throw new Error(response);
    }
    return jsonResponse;
  } catch (err) {
    throw new Error(err);
  }

  // this can be used for development without an internet connection.
  // return require('../fixtures/payload.json');
};
