# text-backend.js

[![Build Status](https://travis-ci.org/paulvollmer/text-backend.js.svg?branch=master)](https://travis-ci.org/paulvollmer/text-backend.js)

Create text content programmatically.  
The main usage is the creation of source code.


## Simple API, simple example

Here is a simple example how to use ```text-backend.js```

    var text = new TextBackend();
    text.write('hello world');
    console.log(text.getString());


## Server / Client

```text-backend.js``` can be used at server and client site.


## Installation

    npm install paulvollmer/text-backend.js


## Running Tests

run the tests:

    npm test


## License

[MIT](LICENSE)
