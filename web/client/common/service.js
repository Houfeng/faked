//const fetch = require('fetch-polyfill');

exports.save = async function (data) {
  let res = await fetch('/api/data', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'PUT',
    body: JSON.stringify(data)
  });
  return res.json();
};

exports.read = async function () {
  let res = await fetch('/api/data', {
    method: 'GET'
  });
  return res.json();
}