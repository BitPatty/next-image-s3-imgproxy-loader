import * as React from 'react';
import Image, { ImageLoaderProps, ImageProps } from 'next/image';

import { createHmac } from 'crypto';
import { ServerResponse, request as httpRequest } from 'http';
import { request as httpsRequest } from 'https';
import { ParsedUrlQuery } from 'node:querystring';

import ImgProxyParamBuilder from './param-builder';

const IMGPROXY_ENDPOINT = '/_next/imgproxy';

const generateSignature = (key: string, salt: string, buff: string): string => {
  const hmac = createHmac('sha256', Buffer.from(key, 'hex'));
  hmac.update(Buffer.from(salt, 'hex'));
  hmac.update(buff);
  return hmac.digest().toString('base64url');
};

const imageOptimizer = (
  imgproxyBaseUrl: URL,
  query: ParsedUrlQuery,
  res: ServerResponse,
  signatureParams?: {
    key: string;
    salt: string;
  },
) => {
  const { src, params } = query;
  if (!src) {
    res.statusCode = 400;
    res.end();
    return;
  }

  const paramString = params ? `${params}/` : '';
  const requestPath = `/${paramString}plain/s3://${src}@png`;
  const signature = signatureParams
    ? generateSignature(signatureParams.key, signatureParams.salt, requestPath)
    : '';

  const reqMethod = imgproxyBaseUrl.protocol.startsWith('https')
    ? httpsRequest
    : httpRequest;

  const req = reqMethod(
    {
      hostname: imgproxyBaseUrl.hostname,
      ...(imgproxyBaseUrl.port ? { port: imgproxyBaseUrl.port } : {}),
      path: `/${signature}${requestPath}`,
      method: 'GET',
    },
    (r) => {
      if (r.headers['content-type'])
        res.setHeader('Content-Type', r.headers['content-type']);

      if (r.statusCode) res.statusCode = r.statusCode;

      r.pipe(res);
      r.on('end', () => res.end());
    },
  );

  req.on('error', (e) => {
    console.error(e);
    res.statusCode = 500;
    res.end();
    req.destroy();
  });

  req.end();
};

type ProxyImageProps = {
  file: string;
  proxyParams?: string;
};

const ProxyImage = ({
  file,
  proxyParams,
  ...props
}: ProxyImageProps & Omit<ImageProps, 'src' | 'quality' | 'unoptimized'>) => {
  const imageLoader = ({ src, width }: ImageLoaderProps): string => {
    const urlParams = new URLSearchParams();
    urlParams.append('src', src);
    if (proxyParams) urlParams.append('params', proxyParams);

    // This doesn't actually do anything, it's just to suppress
    // this error https://nextjs.org/docs/messages/next-image-missing-loader-width
    if (width) urlParams.append('width', width.toString());

    // will return /_next/imgproxy?src=...&params=...&width=...
    return `${IMGPROXY_ENDPOINT}?${urlParams.toString()}`;
  };

  return <Image src={file} loader={imageLoader} {...props} />;
};

export default ProxyImage;
export { imageOptimizer, IMGPROXY_ENDPOINT, ImgProxyParamBuilder };
