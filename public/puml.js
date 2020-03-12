var socket = io.connect(window.location.origin)

function encode64(data) {
  for (var r = '', i = 0, n = data.length; i < n; i += 3)
    r += append3bytes(
      data.charCodeAt(i),
      i + 1 != n ? data.charCodeAt(i + 1) : 0,
      i + 2 != n ? data.charCodeAt(i + 2) : 0);
  return r;
}

function append3bytes(b1, b2, b3) {
  var c1 = b1 >> 2;
  var c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
  var c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
  var c4 = b3 & 0x3F;
  var r =
    encode6bit(c1 & 0x3F) +
    encode6bit(c2 & 0x3F) +
    encode6bit(c3 & 0x3F) +
    encode6bit(c4 & 0x3F);
  return r;
}

function encode6bit(b) {
  if (b < 10)
    return String.fromCharCode(48 + b);
  b -= 10;
  if (b < 26)
    return String.fromCharCode(65 + b);
  b -= 26;
  if (b < 26)
    return String.fromCharCode(97 + b);
  b -= 26;
  if (b == 0)
    return '-';
  if (b == 1)
    return '_';
  return '?';
}

socket.on('content', function(data) {
  document.querySelectorAll('pre.language-plantuml').forEach(function(block, index) {
    var code = block.textContent;
    var s = unescape(encodeURIComponent(code));
    //var url = 'http://www.plantuml.com/img/' + encode64(deflate(s));
    var url = 'http://localhost:8080/svg/' + encode64(deflate(s));
    var img = new Image();
    img.src = url;
    var div = document.createElement('div');
    div.appendChild(img);
    block.replaceWith(div);
  });

  document.querySelectorAll('p').forEach(function(block) {
    const html = block.innerHTML;
    if (block.innerHTML) {
      const matches = html.match(/!\[[^\[\]]*\]\(([^\(\)]+)\)/);
      if (matches && matches[1]) {
        const code = $('<textarea />')
          .html(matches[1]).text()
          .replace(/.*\n@startuml/, '@startuml');
        var url = 'http://localhost:8080/svg/' + encode64(deflate(s));
        var img = new Image();
        img.src = url;
        var div = document.createElement('div');
        div.appendChild(img);
        block.replaceWith(div);
      }
    }
  });
})
