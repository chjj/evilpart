var http = require('http');
var evilpart = require('./evilpart');

http.createServer(function(req, res) {
  if (req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end([
      '<!doctype html>',
      '<title>multi</title>',
      '<form action="/" method="POST" enctype="multipart/form-data">',
      '  <input type="file" name="myfile">',
      '  <input type="submit" value="submit">',
      '</form>'
    ].join('\n'));
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    var body = '';
    req.on('data', function(data) {
      body += data.toString('utf-8');
    }).on('end', function() {
      res.end(JSON.stringify(evilpart(req.headers['content-type'], body), null, 2));
    });
  }
}).listen(8080);

/*
http.createServer(function(req, res) {
  if (req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end([
      '<!doctype html>',
      '<title>multi</title>',
      '<form action="/" method="POST" enctype="multipart/form-data">',
      '  <input type="file" name="content">',
      '  <input type="submit" value="go">',
      '</form>'
    ].join('\n'));
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.write(JSON.stringify(req.headers, null, 2) + '\n');
    req.on('data', function(data) {
      res.write(data.toString('utf-8'));
    }).on('end', function() {
      res.end();
    });
  }
}).listen(8080);
*/