import type { NextPage } from 'next';
import Head from 'next/head';

import ProxyImage, {
  ImgProxyParamBuilder,
  buildProxyImagePath,
} from '../../dist';

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
    layout: 'fill',
  },
  {
    label: 'Blurring',
    file: 'test-bucket/test-image.png',
    layout: 'fill',
    proxyParams: new ImgProxyParamBuilder().blur(10).build(),
  },
  {
    label: 'Trimming',
    file: 'test-bucket/test-image.png',
    layout: 'fill',
    proxyParams: new ImgProxyParamBuilder()
      .trim({
        threshold: 0,
        color: '000000',
      })
      .build(),
  },
  {
    label: 'Trimming',
    file: 'test-bucket/test-image.png',
    layout: 'fill',
    proxyParams: new ImgProxyParamBuilder().pad(50).build(),
  },
  {
    label: 'Padding with background',
    file: 'test-bucket/test-image.png',
    layout: 'fill',
    proxyParams: new ImgProxyParamBuilder()
      .pad(50)
      .setBackground('ff0000')
      .build(),
  },
  {
    label: 'Resizing',
    file: 'test-bucket/test-image.png',
    width: 100,
    height: 100,
    proxyParams: new ImgProxyParamBuilder()
      .resize({
        type: 'fit',
        width: 100,
        height: 100,
        enlarge: true,
        gravity: {
          type: 'no',
          center: {
            x: 10,
            y: 10,
          },
        },
      })
      .build(),
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
                  new ImgProxyParamBuilder().blur(10).build(),
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
