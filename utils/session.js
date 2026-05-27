// utils/session.js

const views = new Map();

function setView(client, userId, view) {

  if (views.has(userId)) {
    clearTimeout(views.get(userId).timeout);
  }

  view.timeout = setTimeout(() => {
    views.delete(userId);
  }, 5 * 60 * 1000);

  views.set(userId, view);
}

function getView(client, userId) {
  return views.get(userId);
}

function clearView(client, userId) {
  views.delete(userId);
}

module.exports = {
  setView,
  getView,
  clearView
};