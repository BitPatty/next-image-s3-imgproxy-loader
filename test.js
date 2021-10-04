const crypt = require('crypto');

const hmac = crypt.createHmac('sha256', 'secret');

hmac.update('hello');

hmac.update(
  '/rs:fill:300:400:0/g:sm/aHR0cDovL2V4YW1w/bGUuY29tL2ltYWdl/cy9jdXJpb3NpdHku/anBn.png',
);

console.log(hmac.digest().toString('base64url'));
hmac.end();
