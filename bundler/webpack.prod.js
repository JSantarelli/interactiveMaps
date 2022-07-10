const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = merge(
    commonConfiguration,
    {
        mode: 'development',
        stats: {
            children: true,
        },
        mode: 'production',
        plugins:
        [
            new CleanWebpackPlugin()
        ]
    }
)
