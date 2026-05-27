const axios = require("axios");

const BASE = "https://api.github.com";

function headers() {

  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    "User-Agent": "discord-bot"
  };

}

async function getTree() {

  const { data } = await axios.get(
    `${BASE}/repos/${process.env.GITHUB_USERNAME}/${process.env.GITHUB_REPO}/git/trees/main?recursive=1`,
    { headers: headers() }
  );

  return data.tree;

}

async function getFile(path) {

  const { data } = await axios.get(
    `${BASE}/repos/${process.env.GITHUB_USERNAME}/${process.env.GITHUB_REPO}/contents/${path}`,
    { headers: headers() }
  );

  return Buffer.from(data.content, "base64").toString("utf8");

}

module.exports = {
  getTree,
  getFile
};