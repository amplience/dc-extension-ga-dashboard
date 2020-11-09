import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import inlineSvg from 'rollup-plugin-inline-svg';
import * as dotenv from 'dotenv';
import livereload from 'rollup-plugin-livereload';
import postcss from 'rollup-plugin-postcss';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';

dotenv.config();

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      server = require('child_process').spawn(
        'npm',
        ['run', 'start', '--', '--dev'],
        {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
        }
      );

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}

export default {
  input: 'src/main.ts',
  output: {
    sourcemap: !production,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js',
  },
  plugins: [
    replace({
      __CLIENT_ID__: process.env.CLIENT_ID,
      __CLIENT_SECRET__: () => process.env.CLIENT_SECRET,
      __HUB_ID__: () => process.env.HUB_ID,
      __API_URL__: () => process.env.API_URL,
      __AUTH_URL__: () => process.env.AUTH_URL,
      __STANDALONE__: () => process.env.STANDALONE,
      __DOCS_BASE_URL__: () => process.env.DOCS_BASE_URL,
      __GOOGLE_ANALYTICS_CLIENT_ID__: () =>
        process.env.GOOGLE_ANALYTICS_CLIENT_ID || '',
      __GOOGLE_ANALYTICS_VIEW_ID__: () =>
        process.env.GOOGLE_ANALYTICS_VIEW_ID || '',
      __GOOGLE_ANALYTICS_LOCALE__: () =>
        process.env.GOOGLE_ANALYTICS_LOCALE || '',
      __GOOGLE_ANALYTICS_CURRENCY_CODE__: () =>
        process.env.GOOGLE_ANALYTICS_CURRENCY_CODE || '',
      'process.env.NODE_ENV': JSON.stringify(
        production ? 'production' : 'development'
      ),
    }),
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css: (css) => {
        css.write('public/build/bundle.css', !production);
      },
      preprocess: sveltePreprocess(),
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),
    typescript({ inlineSources: !production }),
    json(),
    inlineSvg(),
    postcss({
      extract: false,
      minimize: true,
      use: [
        [
          'sass',
          {
            includePaths: ['./src/theme', './node_modules'],
          },
        ],
      ],
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
