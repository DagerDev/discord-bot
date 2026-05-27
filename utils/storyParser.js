function extractNodes(content) {

  const start = content.indexOf("var nodes := {");

  if (start === -1) return null;

  const slice = content.slice(start);

  // find matching closing brace
  let depth = 0;
  let endIndex = -1;

  for (let i = 0; i < slice.length; i++) {

    if (slice[i] === "{") depth++;
    if (slice[i] === "}") depth--;

    if (depth === 0) {
      endIndex = i;
      break;
    }
  }

  if (endIndex === -1) return null;

  let raw = slice.slice(14, endIndex + 1); // inside { }

  try {

    // convert GDScript → JS-safe format
    raw = raw
      .replace(/(\w+)\s*:/g, '"$1":')   // keys
      .replace(/'/g, '"');             // quotes

    return JSON.parse(raw);

  } catch (e) {

    console.log("Parse error:", e);

    return null;
  }
}

module.exports = {
  extractNodes
};