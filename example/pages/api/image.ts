import { NextApiRequest, NextApiResponse } from 'next';
import { handle } from '@bitpatty/next-image-s3-imgproxy-loader';

const handler = (req: NextApiRequest, res: NextApiResponse): void => {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.send('');
    return;
  }

  handle(new URL('http://localhost:4000/'), req.query, res, {
    signature: {
      key: '91bdcda48ce22cd7d8d3a0eda930b3db1762bc1cba5dc13542e723b68fe55d6f9d18199cbe35191a45faf22593405cad0fe76ffec67d24f8aee861ac8fe44d96',
      salt: '72456c286761260f320391fe500fcec53755958dabd288867a6db072e1bc1dbd84b15079838a83a715edc1ecad50c3ce91dd8fdef6f981816fa274f91d8ecf06',
    },
    bucketWhitelist: ['test-bucket'],
  });
};

export default handler;
