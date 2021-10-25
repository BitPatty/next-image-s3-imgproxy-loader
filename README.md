# `next/image` loader for imgproxy (S3)

This library is a layer on top of the the [next/image](https://nextjs.org/docs/api-reference/next/image) component, which allows you to load images from an [imgproxy](https://github.com/imgproxy/imgproxy) instance connected to an s3.

## Requirements

This package requires **NodeJS version 15.7.0 or later**, due to the base64url encoding used to sign URLs which isn't available in earlier versions.

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
import ProxyImage, {
  ImgProxyParamBuilder,
} from '@bitpatty/next-image-s3-imgproxy-loader';

<ProxyImage
  file="mybucket/myfile.png"
  proxyParams={new ImgProxyParamBuilder().rotate(180).blur(10).build()}
/>;
```

> Note: The layout prop is automatically set to 'fill' if no width is set

## Using the raw path

In case using the component is not an option, you can instead use the image path itself, by utilizing the `buildProxyImagePath` function.

```tsx
import { buildProxyImagePath } from '@bitpatty/next-image-s3-imgproxy-loader';

const imagePath = buildProxyImagePath('test-bucket/test-image.png', {
  proxyParams: new ImgProxyParamBuilder().blur(10).build(),
});

<img src={imagePath} />;
```

or as background image

```tsx
import { buildProxyImagePath } from '@bitpatty/next-image-s3-imgproxy-loader';

const imagePath = buildProxyImagePath('test-bucket/test-image.png', {
  proxyParams: new ImgProxyParamBuilder().blur(10).format('jpg').build(),
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

## Available Transformations

The following transformations have been implemented (Note that it is not planned to implement PRO transformations).

| Transformation                                                                                                                    | Supported                |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| [`Signature`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#signature)                     | :white_check_mark:       |
| [`Blur`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#blur)                               | :white_check_mark:       |
| [`Resize`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#resize)                           | :white_check_mark:       |
| [`Size`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#size)                               | :wavy_dash: (via Resize) |
| [`Width`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#width)                             | :wavy_dash: (via Resize) |
| [`Height`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#height)                           | :wavy_dash: (via Resize) |
| [`Dpr`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#dpr)                                 | :white_check_mark:       |
| [`Enlarge`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#enlarge)                         | :wavy_dash: (via Resize) |
| [`Extend`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#extend)                           | :wavy_dash: (via Resize) |
| [`Gravity`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#gravity)                         | :wavy_dash: (via Resize) |
| [`Crop`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#crop)                               | :white_check_mark:       |
| [`Padding`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#padding)                         | :white_check_mark:       |
| [`Trim`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#trim)                               | :white_check_mark:       |
| [`Rotate`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#rotate)                           | :white_check_mark:       |
| [`Quality`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#quality)                         | :white_check_mark:       |
| [`Max Bytes`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#max-bytes)                     | :white_check_mark:       |
| [`Background`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#background)                   | :white_check_mark:       |
| [`Sharpen`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#sharpen)                         | :white_check_mark:       |
| [`Watermark`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#watermark)                     | :x:                      |
| [`Preset`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#preset)                           | :x:                      |
| [`Cache Buster`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#cache-buster)               | :x:                      |
| [`Strip Metadata`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#strip-metadata)           | :x:                      |
| [`Strip Color Profile`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#strip-color-profile) | :x:                      |
| [`Auto Rotate`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#auto-rotate)                 | :x:                      |
| [`Filename`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#filename)                       | :x:                      |
| [`Format`](https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md#format)                           | :white_check_mark:       |
