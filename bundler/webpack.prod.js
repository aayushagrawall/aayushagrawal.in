const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = merge(
    commonConfiguration,
    {
        mode: 'production',
        // no source maps in production: nothing points to a .map file that isn't there
        devtool: false,
        plugins:
        [
            new CleanWebpackPlugin()
        ]
    }
)
