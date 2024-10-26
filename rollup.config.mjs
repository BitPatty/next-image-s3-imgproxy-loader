import pkg from './package.json' with { type: 'json' };

import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import typescript from 'rollup-plugin-typescript2';

const __dirname = dirname(fileURLToPath(import.meta.url));

const transformers = [
  () => ({
    before: [],
    after: [],
  }),
];

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

export default [
  {
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
        tsconfig: 'tsconfig.build.json',
        useTsconfigDeclarationDir: true,
        transformers,
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
      'react',
      'next/image',
      'https',
      'http',
      '@bitpatty/imgproxy-url-builder',
    ],
  },
];
