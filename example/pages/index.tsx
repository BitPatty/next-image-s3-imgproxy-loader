import type { NextPage } from 'next';
import Head from 'next/head';

import ProxyImage, { ImgProxyParamBuilder } from '../../dist';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main>
        <h1>next/image s3 imgproxy loader </h1>

        <h2>Original Image</h2>
        <div className="imgcontainer">
          <ProxyImage file="mybucket/buff.png" layout="fill" />
        </div>

        <h2>Trimming</h2>
        <div className="imgcontainer">
          <ProxyImage
            file="mybucket/buff.png"
            layout="fill"
            proxyParams={new ImgProxyParamBuilder()
              .trim({
                threshold: 0,
                color: '000000',
              })
              .build()}
          />
        </div>

        <h2>Padding</h2>
        <div className="imgcontainer">
          <ProxyImage
            file="mybucket/buff.png"
            layout="fill"
            proxyParams={new ImgProxyParamBuilder().pad(50).build()}
          />
        </div>

        <h2>Padding with background</h2>
        <div className="imgcontainer">
          <ProxyImage
            file="mybucket/buff.png"
            layout="fill"
            proxyParams={new ImgProxyParamBuilder()
              .pad(50)
              .setBackground('ff0000')
              .build()}
          />
        </div>

        <h2>Resizing</h2>
        <div className="imgcontainer">
          <ProxyImage
            file="mybucket/buff.png"
            width={100}
            height={100}
            proxyParams={new ImgProxyParamBuilder()
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
              .build()}
          />
        </div>
      </main>
    </>
  );
};

export default Home;
