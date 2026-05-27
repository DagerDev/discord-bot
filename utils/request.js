const https = require("https");

let axios = null;

try {
  axios = require("axios");
} catch (e) {
  axios = null;
}

function httpGet(url) {

  return new Promise((resolve, reject) => {

    https.get(url, {
      headers: {
        "User-Agent": "discord-bot"
      }
    }, (res) => {

      let data = "";

      res.on("data", chunk => data += chunk);

      res.on("end", () => {

        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }

      });

    }).on("error", reject);

  });

}

async function request(url) {

  // Priority 1: axios
  if (axios) {
    const res = await axios.get(url, {
      headers: { "User-Agent": "discord-bot" }
    });
    return res.data;
  }

  // Fallback: https
  return await httpGet(url);
}

module.exports = { request };