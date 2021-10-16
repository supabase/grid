import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import tailwindcss from 'tailwindcss';

const tailwindconfig = require('./tailwind.config');
const packageJson = require('./package.json');

export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  watch: {
    include: 'src/**',
  },
  plugins: [
    peerDepsExternal(),
    nodeResolve(),
    json(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true, abortOnError: false }),
    postcss({
      plugins: [
        tailwindcss(tailwindconfig),
        autoprefixer(),
        cssnano({
          preset: 'default',
        }),
      ],
    }),
  ],
};
