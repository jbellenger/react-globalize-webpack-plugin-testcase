const webpack = require('webpack');
const ReactGlobalizePlugin = require('react-globalize-webpack-plugin');
const GlobalizePluginUtil = require('globalize-webpack-plugin/util');
const path = require('path');

const buildModule = (main, builddir) => new Promise((resolve, reject) => {
  const webpackConfig = {
    entry: {
      main: main
    },
    output: {
      chunkFilename: '[name].[chunkhash].js',
      filename: '[name].[chunkhash].js',
      path: builddir,
      pathinfo: true,
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        }
      ]
    },
    bail: true,
    plugins: [
      new ReactGlobalizePlugin({
        production: true,
        developmentLocale: 'en',
        supportedLocales: ['en'],
        output: '[locale].[chunkhash].js',
        cldr: GlobalizePluginUtil.cldr('en')
      })
    ]
  };

  webpack(webpackConfig, (err, stats) => {
    if (err) {
      return reject(err);
    }
    const enAsset = stats.toJson().assetsByChunkName['globalize-compiled-data-en'];
    const enHash = enAsset.split('.')[1];
    return resolve(enHash);
  });
});

const promises = [
  buildModule(require.resolve('./module-a'), path.resolve(__dirname, 'build-a')),
  buildModule(require.resolve('./module-b'), path.resolve(__dirname, 'build-b')),
  buildModule(require.resolve('./module-c'), path.resolve(__dirname, 'build-c')),
];

Promise.all(promises)
  .then(([hashA, hashB, hashC]) => {
    if (hashA === hashB) {
      console.log('i18n asset hash for strings in module-a and module-b are the same, even though they have different strings');
      console.log('  module-a hash:', hashA);
      console.log('  module-b hash:', hashB);
      console.log('\n');
    }

    if (hashB !== hashC) {
      console.log('i18n asset hash for strings in module-b and module-c are different, even though they have the same strings');
      console.log('  module-b hash:', hashB);
      console.log('  module-c hash:', hashC);
      console.log('\n');
    }
  })
  .catch((err) => {
    console.log('error', err);
    process.exit(1);
  });
