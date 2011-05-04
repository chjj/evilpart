// i truly apologize for this: 
// the dirtiest multipart parser ever
// (c) Copyright 2011, Christopher Jeffrey (//github.com/chjj) (MIT Licensed)

module.exports = function evilpart(type, body) {
  var parts = {}, key, part;
  try {
    type = type.match(/boundary=([^;]+)/);
    
    key = '--' + type[1].replace(/^["']|["']$/g, '').trim()
      .replace(/([-.*+?^${}()|\[\]\\])/g, '\\$1');
    part = new RegExp(key + '\\r\\n([\\s\\S]+?)\\r\\n' + key + '--', 'g');
    
    body.replace(part, function(__, data) {
      var head = {}, meta = {};
      data = data.match(/^([\s\S]+?)(?:\r\n){2}([\s\S]+)$/);
      if (!data) return;
      data[1].replace(/([^\r\n]+):([^\r\n]+)/g, function(__, name, content) {
          head[name.trim().toLowerCase()] = content.trim();
      });
      data = data[2];
      if (!head['content-disposition']) return;
      head['content-disposition'].replace(/([^\s=]+)=([^;]+)/g, function(__, name, content) {
        name = name.trim().toLowerCase().replace(/^["']|["']$/g, '');
        content = content.trim().replace(/^["']|["']$/g, '');
        meta[name] = content;
      });
      if (!meta.name) return;
      if (head['content-encoding'] === 'base64') {
        data = new Buffer(data, 'base64');
      }
      parts[meta.name] = {
        name: meta.name,
        filename: meta.filename,
        data: data
      };
    });
  } finally {
    return parts;
  }
};