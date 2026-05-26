function createPages(text, linesPerPage = 20) {

  const lines = text.split("\n");

  const numbered = lines.map(
    (line, i) => `${i + 1} | ${line}`
  );

  const pages = [];

  for (let i = 0; i < numbered.length; i += linesPerPage) {

    pages.push(
      numbered
        .slice(i, i + linesPerPage)
        .join("\n")
    );

  }

  return pages;
}

module.exports = {
  createPages
};