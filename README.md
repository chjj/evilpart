# Evilpart - a multipart parser that is positively evil.

## What is it?

Evilpart is the dirtiest, hackiest multipart parser you'll find. 

## Why is it evil? 

It's a single function (~40 lines) that expects a buffered request 
body (multipart/form-data) to parse, so it's not streaming. It also uses 
regexes to parse the body, which means it won't be able to parse binary 
encoded parts.

## No binary, no streaming, what's the point?

I specifically wrote this for parsing browser uploads of small text files (although,
it should in theory be able to handle base64 encoded parts). It will actually 
be relatively efficient as long as all the data makes it into the first packet. So, 
for text files under maybe 25-30kb, evilpart should do well. Also, frameworks like 
express/connect will buffer the request body by default and expose the raw 
request body as a string, so all you have to do is pass it in to a function. 

* * *

multipart can be complex, and I think its good to keep things simple, 
especially if you only need to parse multipart for something small, like a 
text file.

## Usage

    var evilpart = require('evilpart');
    
    // need to pass in the raw content type header
    // so evilpart can grab the boundary key
    var parts = evilpart(req.headers['content-type'], req.rawBody);
    console.log(parts.myfile);

This may yield an object looking like this:

    {
      'myfile': {
        name: 'myfile',
        filename: 'myfile.txt',
        data: 'hello world'
      },
      'other_field': {
        name: 'other_field',
        data: 'look! another form field.'
      }
    }