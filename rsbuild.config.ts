import { join } from 'node:path';

import { WebUpdateNotificationPlugin } from '@plugin-web-update-notification/webpack';
import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginStylus } from '@rsbuild/plugin-stylus';
import { pluginSvgr } from '@rsbuild/plugin-svgr';
// import { pluginBabel } from '@rsbuild/plugin-babel';

const { publicVars } = loadEnv({ prefixes: ['REACT_APP_'] });

export default defineConfig({
    plugins: [pluginReact(), pluginSvgr(), pluginStylus()],
    server: {
        port: 8900,
        proxy: {
            '/api': {
                target: 'http://0.0.0.0:3009',
            },
        },
    },
    html: {
        template: './public/index.html',
    },
    output: {
        polyfill: 'entry',
        legalComments: 'none',
        filename:
            process.env.NODE_ENV === 'production'
                ? {
                      js: '[name].[contenthash:16].js',
                      css: '[name].[contenthash:16].css',
                      svg: '[name].[contenthash:16].svg',
                      font: '[name].[contenthash:16][ext]',
                      image: '[name].[contenthash:16][ext]',
                      media: '[name].[contenthash:16][ext]',
                  }
                : {
                      js: '[name].js',
                      css: '[name].css',
                      svg: '[name].[contenthash:16].svg',
                      font: '[name].[contenthash:16][ext]',
                      image: '[name].[contenthash:16][ext]',
                      media: '[name].[contenthash:16][ext]',
                  },
    },
    tools: {
        rspack: {
            plugins: [
                process.env.NODE_ENV === 'production' &&
                    new WebUpdateNotificationPlugin({
                        logVersion: true,
                    }),
            ].filter(Boolean) as any,
        },
        bundlerChain(chain, utils) {
            chain.module
                .rule('svg')
                .oneOf('sprite')
                .test(/./)
                .include.add(join(__dirname, './src/icons/svg'))
                .end()
                .before('svg-asset-url')
                .use('compat-svg-sprite-loader')
                .loader(join(__dirname, './scripts/compat-svg-sprite-loader.mjs'))
                .options({ symbolId: 'icon-[name]' })
                .end();
        },
    },
    source: {
        define: publicVars,
        alias: {
            '@': './src',
            '#': './types',
        },
    },
    // 打包优化
    performance: {
        prefetch: true,
        chunkSplit: {
            strategy: 'single-vendor',
        },
        removeConsole:
            process.env.REACT_APP_API_ENV === 'prod' || process.env.REACT_APP_API_ENV === 'stg',
    },
});
