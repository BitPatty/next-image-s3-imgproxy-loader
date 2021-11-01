# `next/image` loader for imgproxy (S3)

This library is a layer on top of the the [next/image](https://nextjs.org/docs/api-reference/next/image) component, which allows you to load images from an [imgproxy](https://github.com/imgproxy/imgproxy) instance connected to an S3. With this library, the NextJS server acts as a middleman between the client and the imgproxy instance to perform additional tasks, such as applying signatures and/or guards before loading an image.

> **If you want to access the imgproxy instance directly from your client you can simply use the `next/image` component itself - no need to install this library** (you might wanna look into the [imgproxy-url-builder](https://github.com/BitPatty/imgproxy-url-builder) to build the request URL however).

![Request Flow](https://github.com/BitPatty/next-image-s3-imgproxy-loader/raw/master/request_flow.png)

## Sample Usage

> You can find additional examples in the [demo project](https://github.com/BitPatty/next-image-s3-imgproxy-loader/blob/master/example/pages/index.tsx).

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
      // Add other middleware here, such as auth guards
      // ...
      imgProxy.imageOptimizer(
        new URL('<url to your imgproxy instance>'),
        query,
        res,
        // (Optional) Additional configuration options
        {
          // (Optional) If your imgproxy uses signatures, specify
          // the key and salt here
          signature: {
            // (Required) The IMGPROXY_KEY (hex encoded)
            key: '<imgproxy secret>',
            // (Required) The IMGPROXY_SALT (hex encoded)
            salt: '<imgproxy salt>',
          },
          // (Optional) If your imgproxy instance uses
          // the IMGPROXY_SECRET, specify the token here
          authToken: '<my-token>'
          // (Optional) If you wanna restrict access to specific
          // buckets add an array of valid bucket names
          bucketWhitelist: ['<my-bucket>'],
          // (Optional) A list of imgproxy headers that should be
          // forwarded through the imgproxy endpoint
          forwardedHeaders: ['<my-header>'],
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
import ProxyImage from '@bitpatty/next-image-s3-imgproxy-loader';
import pb from '@bitpatty/imgproxy-url-builder';

<ProxyImage
  file="mybucket/myfile.png"
  proxyParams={pb().rotate(180).blur(10).build()}
/>;
```

> Note: The layout prop is automatically set to 'fill' if no width is set

## Using the raw path

In case using the component is not an option, you can instead use the image path itself, by utilizing the `buildProxyImagePath` function.

```tsx
import { buildProxyImagePath } from '@bitpatty/next-image-s3-imgproxy-loader';
import pb from '@bitpatty/imgproxy-url-builder';

const imagePath = buildProxyImagePath('test-bucket/test-image.png', {
  proxyParams: pb().blur(10).build(),
});

<img src={imagePath} />;
```

or as background image

```tsx
import { buildProxyImagePath } from '@bitpatty/next-image-s3-imgproxy-loader';
import pb from '@bitpatty/imgproxy-url-builder';

const imagePath = buildProxyImagePath('test-bucket/test-image.png', {
  proxyParams: pb().blur(10).format('jpg').build(),
});

<div
  style={{
    backgroundImage: `url(${imagePath})`,
    backgroundSize: 'cover',
  }}
>
  {/* Content */}
</div>;
```

## Overriding the endpoint

You can override the default endpoint address or use an absolute address in the component instead.

```js
// server.js
createServer((req, res) => {
  // ...
  if (pathname === '/my-endpoint') {
    // ...
  }
}
```

```tsx
<ProxyImage file="mybucket/myfile.png" endpoint="/my-endpoint" />;

// Or
buildProxyImagePath('test-bucket/test-image.png', {
  endpoint: '/my-endpoint',
});
```
