// i truly apologize for this: 
// the dirtiest multipart parser ever
// (c) Copyright 2011, Christopher Jeffrey (//github.com/chjj) (MIT Licensed)

module.exports = function evilpart(type, body) {
  var parts = {}, key, part;
  type = (type || '').match(/boundary=([^;]+)/);
  if (!type || !body) return parts;
  
  key = '--' + type[1].trim()
    .replace(/^["']|["']$/g, '')
    .replace(/([-.*+?^${}()|\[\]\\])/g, '\\$1');
  part = new RegExp(key + '\\r\\n([\\s\\S]+?)\\r\\n' + key + '--', 'g');
  
  body.replace(part, function(__, data) {
    var head = {}, meta = {};
    data = data.match(/^([\s\S]+?)(?:\r\n){2}([\s\S]+)$/);
    if (!data) return;
    data[1].replace(/([^\s:]+):([^\r\n]+)/g, function(__, key, val) {
        head[key.toLowerCase()] = val.trim();
    });
    if (!head['content-disposition']) return;
    head['content-disposition']
      .replace(/([^;\s=]+)=([^;]+)/g, function(__, key, val) {
        key = key.trim().replace(/^["']|["']$/g, '').toLowerCase();
        val = val.trim().replace(/^["']|["']$/g, '');
        meta[key] = val;
      });
    if (!meta.name && !meta.filename) return;
    data = data[2];
    if (head['content-encoding'] === 'base64') {
      data = new Buffer(data, 'base64');
    }
    parts[meta.name || meta.filename] = {
      name: meta.name,
      filename: meta.filename,
      data: data
    };
  });
  
  return parts;
};