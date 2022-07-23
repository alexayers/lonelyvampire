const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const isDevelopment = process.env.NODE_ENV !== 'production';
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: isDevelopment ? 'development' : 'production',
    entry: './src/ts/app/app.ts',
    devtool: "source-map",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: isDevelopment ? '[name].js' : '[name].[hash].js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devServer: {
        static: './dist',
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                exclude: /node_modules/,
                use: [
                    { loader: "ts-loader" }
                ]
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.(ogg|wav|mp3)$/,
                type: 'asset/resource'
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
}
