let path = require('path'),
    webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin"),
    FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin')
gutil = require('gulp-util');

function resolve(dir) {
    return path.join(__dirname, dir)
}

let outPath = path.resolve(__dirname, '__dist');
module.exports = {
    devtool: "cheap-source-map", // source-map
    debug: true,
    entry: {
        app: [
            'webpack-hot-middleware/client',
            path.resolve(__dirname, './app/index')],
    },
    output: {
        path: outPath,
        filename: "[name].js",
        publicPath: '',
        chunkFilename: "[hash].commons.js"
    },
    resolve: {
        alias: {
            '@': resolve('app'),
        },
    },
    externals: {
        'React': 'React'
    },
    module: {
        // preLoaders: [{
        //     test: /\.js|jsx$/,
        //     exclude: /node_modules/,
        //     loader: "eslint-loader",
        // }],
        loaders: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },
            {
                test: /\.js|jsx$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {compact: false}
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader", "postcss-loader")
            },
            {
                test: /\.less$/,
                //  postcss schema-utils
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!less-loader?strictMath&noIeCompat!postcss-loader')
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                loader: 'url-loader?limit=8192&name=imgs/[name]-[hash].[ext]'
            },
            // {
            //     test: /\.(woff|ttf|eot|svg)$/i,
            //     loader: 'base64-font-loader'
            // },
            {
                test: /\.(woff|ttf|eot|svg)$/i,
                loader: 'file-loader?name=[path][name].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            /**
             * 定义全局变量
             */
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            },
        }),
        new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin("app.css", {
            allChunks: true
        }),
        // new webpack.optimize.UglifyJsPlugin({       //过滤console
        //     comments: false,
        //     compress: {
        //         warnings: false,
        //         drop_debugger: true,
        //         drop_console: true
        //     }
        // }),
        new webpack.optimize.MinChunkSizePlugin({   //小于 10kb的块将会被合并
            minChunkSize: 1024, // ~50kb
        }),

        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 15 //控制chunks最大数量
        }),
        new CommonsChunkPlugin({        //公共块提举
            name: "commons",
            filename: "commons.js",
            chunks: ["app", "commons"],
        }),
        new FriendlyErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            inject: true,
            title: 'Custom template using Handlebars',
            template: path.resolve(__dirname, './app/index.html'),
            chunks: ['app', 'commons']
        }),
        new CopyWebpackPlugin(
            [{
                from: path.resolve(__dirname, './app/worker'),
                to: 'worker',
                ignore: ['.*']
            }]
        )
    ]
};