'use strict';

const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isTest = process.env.NODE_ENV == 'test';
const isProduction = process.env.NODE_ENV === 'production';
const isDev = !isProduction;
const libraryName = 'caldera-s3-components';

module.exports = {
    target: 'web',
    debug: isDev,
    entry: _.extend({

        // Note: entry points must be in arrays to fix a strange bug with webpack
        // See: "A dependency to an entry point is not allowed"
        // https://github.com/webpack/webpack/issues/300
        index: ['./src/LibraryEntryPoint.js'],
        vendor: [
            'react',
            'react-dom'
		]
    },
    (isDev && !isTest) && {
        demo: ['./src/DemoEntryPoint.js'],
        'hotLoader': 'webpack-hot-middleware/client'
    }),
    externals: isTest ? {
        'react': true,
        'react-dom': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
    } : {},
    context: __dirname,
    devtool: isProduction ? 'cheap-module-source-map' : 'inline-source-map',
    node: {
        __filename: true,
        __dirname: true
    },
    output: {
        publicPath: '/lib/',
        path: path.resolve('lib'),
        filename: '[name].js',
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
        modulesDirectories: [
            'node_modules',
            path.resolve(__dirname, './node_modules')
        ],
        extensions: ['', '.js', '.jsx', '.css', '.scss'],
        alias: {
            modernizr$: path.resolve(__dirname, '.modernizrrc')
        }
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: _.compact([ (isDev && !isTest) && 'react-hot', 'babel']),
                exclude: /node_modules/,
                presets: ['react']
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true
                }
            },
            {
                test: /(\.scss)$/,
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass')
            },
            {
                test: /(\.css)$/,
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[local]')
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
                loader: 'file?name=[path][name].[ext]'
            },
            {
                test: /\.modernizrrc$/,
                loader: 'modernizr'
            },
            {
                test: /\.ejs/,
                loader: 'ejs'
            }
        ]
    },
    postcss: [autoprefixer],
    plugins: _.compact([
        new ExtractTextPlugin(libraryName + '.css', { allChunks: true }),
        new webpack.DefinePlugin({
            PROJECT_ROOT: path.join('"', __dirname, '"'),
            'typeof window': JSON.stringify('object')
        }),
        (isDev && !isTest) && new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(__dirname, 'template.ejs'),
            chunks: ['demo', 'vendor', 'hotLoader'],
            excludeChunks: [],
            chunksSortMode: 'dependency'
        }),

        (isDev && !isTest) && new webpack.HotModuleReplacementPlugin(),

        // TODO only use these for minified build
        // Optimization for production builds
        isProduction && new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true
            }
        }),
        isProduction && new webpack.optimize.DedupePlugin()
    ])
};
