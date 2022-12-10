import pkg from './package.json' assert { type: 'json' };

import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import typescript from 'rollup-plugin-typescript2';

const __dirname = dirname(fileURLToPath(import.meta.url));

const createPackageJson = {
  writeBundle: (opts) => {
    if (!['es', 'cjs'].includes(opts.format) || opts.file === pkg.types) return;
    const dirName = path.join(__dirname, path.dirname(opts.file));
    const output = JSON.stringify({
      type: opts.format === 'es' ? 'module' : 'commonjs',
    });
    fs.writeFileSync(path.join(dirName, 'package.json'), output);
  },
};

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      strict: true,
      compact: false,
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
      strict: true,
      compact: false,
    },
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          declarationDir: dirname(pkg.types),
        },
      },
    }),
    createPackageJson,
  ],
  external: [
    'crypto',
    'react',
    'react-dom',
    'next',
    'next/image',
    'http',
    'https',
    'node:querystring',
    '@bitpatty/imgproxy-url-builder',
  ],
};
