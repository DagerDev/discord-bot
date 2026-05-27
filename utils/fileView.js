// utils/fileView.js

const PAGE_SIZE = 20;

function formatLine(num, text, selectedLine) {
  const prefix = selectedLine === num ? ">" : " ";
  return `${prefix}${num} | ${text}`;
}

function renderLines(view) {
  const start = view.page * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  return view.rawLines.slice(start, end).map((lineObj) => {
    const num = lineObj.num;
    const text = lineObj.text;
    return formatLine(num, text, view.selectedLine);
  });
}

function buildPanel(view) {
  return [
    `File: ${view.file || "none"}`,
    `Page ${view.page + 1}`,
    "",
    "!select <line>",
    "!line <line>",
    "!high <line>",
    "!git open <file>",
    "!git get"
  ].join("\n");
}

function renderPage(message, view) {
  return message.channel.send(
`::: FILE VIEW :::

\`\`\`txt
${renderLines(view).join("\n")}
\`\`\`

\`\`\`txt
${buildPanel(view)}
\`\`\``
  );
}

module.exports = {
  PAGE_SIZE,
  renderPage
};