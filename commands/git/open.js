const { createPages } =
  require("../../utils/pagination");

const pages = createPages(decoded);

message.client.views.set(message.author.id, {
  pages,
  page: 0
});

return message.channel.send(
  "```js\n" +
  `PAGE 1/${pages.length}\n\n` +
  pages[0] +
  "\n```"
);