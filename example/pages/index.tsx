import pb, { GravityType, ResizeType } from '@bitpatty/imgproxy-url-builder';
import type { NextPage } from 'next';
import Head from 'next/head';

import ProxyImage, {
  buildProxyImagePath,
} from '@bitpatty/next-image-s3-imgproxy-loader';

const demoContent: {
  label: string;
  file: string;
  proxyParams?: string;
  layout?: 'fill';
  width?: number;
  height?: number;
}[] = [
  {
    label: 'Original Image',
    file: 'test-bucket/test-image.png',
  },
  {
    label: 'Changing filetype',
    file: 'test-bucket/test-image.png',
  },
  {
    label: 'Blurring',
    file: 'test-bucket/test-image.png',

    proxyParams: pb().blur(10).build(),
  },
  {
    label: 'Cropping',
    file: 'test-bucket/test-image.png',

    proxyParams: pb()
      .crop({
        width: 100,
        height: 100,
      })
      .build(),
  },
  {
    label: 'Cropping 2',
    file: 'test-bucket/test-image.png',

    proxyParams: pb()
      .crop({
        width: 200,
        height: 200,
        gravity: {
          type: GravityType.NORTHEAST,
          offset: {
            x: 10,
            y: 10,
          },
        },
      })
      .build(),
  },
  {
    label: 'Trimming',
    file: 'test-bucket/test-image.png',

    proxyParams: pb()
      .trim({
        threshold: 0,
        color: '000000',
      })
      .build(),
  },
  {
    label: 'Trimming',
    file: 'test-bucket/test-image.png',

    proxyParams: pb().pad({ top: 50 }).build(),
  },
  {
    label: 'Padding with background',
    file: 'test-bucket/test-image.png',

    proxyParams: pb().pad({ top: 50 }).background('ff0000').build(),
  },
  {
    label: 'Resizing',
    file: 'test-bucket/test-image.png',
    width: 100,
    height: 100,
    proxyParams: pb()
      .resize({
        type: ResizeType.FILL,
        width: 100,
      })
      .build(),
  },
  {
    label: 'Sharpen',
    file: 'test-bucket/test-image.png',
    proxyParams: pb().sharpen(1.5).build(),
  },
  {
    label: 'PNG to JPG',
    file: 'test-bucket/test-image.png',
    proxyParams: pb().format('png').build(),
  },
  {
    label: 'SVG to PNG',
    file: 'test-bucket/test-image.svg',
    proxyParams: pb().format('png').build(),
  },
];

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main>
        <h1>next/image s3 imgproxy loader </h1>
        <div>
          {demoContent.map((d, idx) => (
            <div key={idx}>
              <h2>{d.label}</h2>
              <div className="imgcontainer">
                <ProxyImage {...d} />
              </div>
            </div>
          ))}
        </div>

        <div>
          <div>
            <h2>Background Image</h2>
            <div
              style={{
                backgroundImage: `url(${buildProxyImagePath(
                  'test-bucket/test-image.png',
                  {
                    proxyParams: pb().blur(10).build(),
                  },
                )})`,
                backgroundSize: 'cover',
                color: 'white',
                width: '200px',
              }}
            >
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Consectetur ipsam voluptates velit, perferendis alias maiores
              atque rem accusantium culpa vero doloremque repellat porro fugiat
              nam ad veniam accusamus aliquid molestias.
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
