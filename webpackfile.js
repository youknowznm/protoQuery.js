const webpack = require('webpack')
const path = require('path')
const fs = require('fs')

module.exports = {
    watch: true,
    entry: './src/main.js',
    output: {
        path: __dirname,
        filename: 'protoQuery.js',
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['es2015'],
                },
            },
        }],
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     sourceMap: true,
        //     compress: {
        //         warnings: true,
        //     },
        // }),
    ],
}
