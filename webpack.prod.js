// webpack.prod.js

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map', // Production-friendly source maps
    optimization: {
        minimize: true, // Enable minification for production
    },
});
