function extractNodes(content) {

  const startKey = "nodes :=";
  const start = content.indexOf(startKey);

  if (start === -1) return null;

  const slice = content.slice(start);

  let open = 0;
  let startObj = slice.indexOf("{");

  if (startObj === -1) return null;

  let obj = "";

  for (let i = startObj; i < slice.length; i++) {

    const c = slice[i];
    obj += c;

    if (c === "{") open++;
    if (c === "}") open--;

    if (open === 0) break;
  }

  try {
    // SAFE: return raw object text (not JSON parsed)
    return eval("(" + obj + ")");
  } catch (e) {
    console.log(e);
    return null;
  }
}

module.exports = { extractNodes };