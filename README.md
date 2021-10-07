# `next/image` loader for imgproxy (S3)

This library is a layer on top of the the [next/image](https://nextjs.org/docs/api-reference/next/image) component, which allows you to load images from an [imgproxy](https://github.com/imgproxy/imgproxy) instance connected to an s3.

## Sample Usage

### Installation

You can install the package via npm:

```sh
npm install --save @bitpatty/next-image-s3-imgproxy-loader
```

### Registering the endpoint

The library proxies request through a next endpoint. To register the endpoint create a [custom server](https://nextjs.org/docs/advanced-features/custom-server) in your project and add the following lines:

```js
// server.js
const imgProxy = require('@bitpatty/next-image-s3-imgproxy-loader');

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    if (pathname === imgProxy.IMGPROXY_ENDPOINT) {
      imgProxy.imageOptimizer(
        new URL('<url to your imgproxy instance>'),
        query,
        res,
        // Optional, only provide this if you use
        // imgproxy signatures
        {
          key: '<imgproxy secret>',
          salt: '<imgproxy salt>',
        },
      );
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
```

## Using the component

After registering the endpoint you can use the `<ProxyImage />` component as you would with the `Image` component from `next/image`, except that you need to provide a file (`<bucketname>/<filename>`) instead of `src` and optional proxy params for image transformations/optimizations.

```tsx
import ProxyImage, {
  ImgProxyParamBuilder,
} from '@bitpatty/next-image-s3-imgproxy-loader';

<ProxyImage
  file="mybucket/myfile.png"
  layout="fill"
  proxyParams={new ImgProxyParamBuilder().rotate(180).blur(10).build()}
/>;
```

## Using the raw path

In case using the component is not an option, you can instead use the image path itself, by utilizing the `buildProxyImagePath` function.

```tsx
import { buildProxyImagePath } from '@bitpatty/next-image-s3-imgproxy-loader';

<div
  style={{
    backgroundImage: `url(${buildProxyImagePath('test-bucket/test-image.png', {
      proxyParams: new ImgProxyParamBuilder().blur(10).build(),
    })})`,
    backgroundSize: 'cover',
  }}
>
  {/* Content */}
</div>;
```
