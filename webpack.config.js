var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var buildPath = path.resolve(__dirname, 'dist');
var srcPath = path.resolve(__dirname, 'src');
var scssPath = path.resolve(srcPath);
var autoprefixer = require('autoprefixer');
var nodeModulePath = path.resolve(__dirname, 'node_modules');
var IS_PRODUCTION = process.env.NODE_ENV === 'production';

var webpackConfig = {
  entry: {
    index: path.join(srcPath, 'index.js'),
  },
  output: {
    path: buildPath,
    filename: process.env.NODE_ENV === 'production' ? '[name].[chunkhash].js' : '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: "pre",
        loader: "eslint-loader",
        include: srcPath,
      },
      {
        test: /\.ejs$/,
        loader: 'ejs-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                'env',
                'react',
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { minimize: IS_PRODUCTION } },
          { loader: 'postcss-loader', options: { plugins: () => [autoprefixer] } },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              minimize: IS_PRODUCTION,
              module: true,
              camelCase: true,
              localIdentName: '[local]-[hash:5]',
            }
          },
          { loader: 'postcss-loader', options: { plugins: () => [autoprefixer] } },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [scssPath, nodeModulePath],
              data: '@import "' + path.resolve(srcPath, 'app/styles/theme.scss') + '";',
            },
          },
        ],
      },
      {
        test: /\.less/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { minimize: IS_PRODUCTION } },
          { loader: 'postcss-loader', options: { plugins: () => [autoprefixer] } },
          {
            loader: 'less-loader',
            options: {
              paths: [
                srcPath,
                nodeModulePath,
              ],
            }
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|woff|svg|eot|ttf|woff2)$/,
        use: [
          { loader: 'file-loader?name=[name]-[hash:8].[ext]' },
        ],
      },
    ],
  },
  plugins: [
    // extract common js into one filejs
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
      minChunks: function(module){
        return module.context && module.context.indexOf("node_modules") !== -1;
      }
    }),

    // use html-webpack-plugin to create index.html
    new HtmlWebpackPlugin({
      inject: 'body',
      template: 'src/index.ejs',
      filename: 'index.html',
      chunks: ['vendor', 'index'],
      chunksSortMode: 'dependency',
      environment: process.env.NODE_ENV,
    }),
  ],
  resolve: {
    unsafeCache: !IS_PRODUCTION,
    symlinks: false,  // https://github.com/webpack/webpack/issues/1866
    modules: [
      'node_modules',
      srcPath,
    ],
  },
  devServer: {
    disableHostCheck: true,
  }
};

if (IS_PRODUCTION) {
  webpackConfig.devtool = 'source-map';
  webpackConfig.plugins = webpackConfig.plugins.concat([
    // define variable available in code
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
    }),
  ]);
} else {
  webpackConfig.devtool = 'eval';
  webpackConfig.plugins = webpackConfig.plugins.concat([
    // handle errors more cleanly, recover after syntax error
    new webpack.NoEmitOnErrorsPlugin(),
  ]);
}

module.exports = webpackConfig;
