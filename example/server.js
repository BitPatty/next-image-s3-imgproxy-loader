// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const imgProxy = require('../dist');

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    if (pathname === imgProxy.IMGPROXY_ENDPOINT) {
      imgProxy.imageOptimizer(new URL('http://localhost:4000/'), query, res, {
        signature: {
          key: '91bdcda48ce22cd7d8d3a0eda930b3db1762bc1cba5dc13542e723b68fe55d6f9d18199cbe35191a45faf22593405cad0fe76ffec67d24f8aee861ac8fe44d96',
          salt: '72456c286761260f320391fe500fcec53755958dabd288867a6db072e1bc1dbd84b15079838a83a715edc1ecad50c3ce91dd8fdef6f981816fa274f91d8ecf06',
        },
        bucketWhitelist: ['test-bucket'],
      });
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
