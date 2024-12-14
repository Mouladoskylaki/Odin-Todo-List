// webpack.dev.js

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map', // Fastest for development
    devServer: {
        watchFiles: ['./src/template.html'],
    },
});
