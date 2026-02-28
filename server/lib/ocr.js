const Tesseract = require("tesseract.js");

async function extractNameAndIdFromImage(imageBuffer) {
  const {
    data: { text },
  } = await Tesseract.recognize(imageBuffer, "eng");
  // Split text into lines for easier processing
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // Try to extract name from a line starting with 'Name:'
  let name = null;
  for (const line of lines) {
    const match = line.match(/^Name\s*[:：]?\s*(.+)$/i);
    if (match) {
      // Remove trailing initials (e.g., 'A S') if present
      let n = match[1].replace(/\s+/g, " ").trim();
      n = n.replace(/( [A-Z]){1,3}$/g, "").trim();
      name = n;
      break;
    }
  }
  // Fallback: look for the first line with 2+ capitalized words
  if (!name) {
    const nameMatch = lines.find((l) =>
      l.match(/[A-Z][a-z]+(\s+[A-Z][a-z]+){1,}/),
    );
    if (nameMatch) {
      let n = nameMatch.match(/[A-Z][a-z]+(\s+[A-Z][a-z]+){1,}/)[0];
      n = n.replace(/( [A-Z]){1,3}$/g, "").trim();
      name = n;
    }
  }

  // Try to extract ID from a line starting with 'ID Number:' or similar
  let id = null;
  for (const line of lines) {
    const match = line.match(
      /ID\s*(Number)?\s*[:：]?\s*([A-Z]+\/[0-9]{3,6}\/[0-9]{2})/i,
    );
    if (match) {
      id = match[2].replace(/\s+/g, "").trim();
      break;
    }
  }
  // Fallback: look for any ID-like pattern in the text
  if (!id) {
    const idMatch = text.match(/(UGR|ASTU)\/[0-9]{3,6}\/[0-9]{2}/i);
    if (idMatch) id = idMatch[0].replace(/\s+/g, "").trim();
  }

  return {
    id: id || null,
    name: name || null,
    raw: text,
  };
}

module.exports = { extractNameAndIdFromImage };
