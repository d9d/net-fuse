const MAX_WRAP_WIDTH = 100;

module.exports = function(text) {
  let width = Math.min(process.stdout.columns, MAX_WRAP_WIDTH);
  let out = [];

  while (text.length > width) {
    let pos = text.substr(0, width).lastIndexOf(' ');
    if (pos < 0) { pos = width; }

    out.push(text.substr(0, pos));
    text = text.substr(pos + 1).trimLeft();
  }

  if (text.length) {
    out.push(text);
  }

  return out.join('\n');
};
