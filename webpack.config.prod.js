const path = require('path');
const webpack = require('webpack');
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const pkg = require('./package.json');

// 获取定制的ant样式
function getTheme() {
    let theme = {};
    if (pkg.theme && typeof(pkg.theme) === 'string') {
        let cfgPath = pkg.theme;
        // relative path
        if (cfgPath.charAt(0) === '.') {
            cfgPath = path.resolve(process.cwd(), cfgPath);
        }
        const getThemeConfig = require(cfgPath);
        theme = getThemeConfig();
    }

    return theme;
}

module.exports = {
    devtool: false,
    entry: {
        "profile/index":  ["./src/pages/profile/index.jsx"]
    },
    resolve: {
        extensions: ['', '.js', '.jsx'] // 当requrie的模块找不到时，添加这些后缀
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].js'
    },
    plugins: [
        // 根据模块调用次数，给模块分配ids，常被调用的ids分配更短的id，使得ids可预测，降低文件大小，该模块推荐使用
        new webpack.optimize.OccurrenceOrderPlugin(),

        // 打包的时候删除重复或者相似的文件
        // new webpack.optimize.DedupePlugin(),

        // 限制打包文件的个数
        new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}),

        //把多个小模块进行合并，以减少文件的大小
        new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000}),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            },
            DEBUG: false
        }),

        // 压缩JS
        new webpack.optimize.UglifyJsPlugin({
            compressor: { warnings: false },
            output: { comments: false }
        }),

        // 提取公共文件
        new CommonsChunkPlugin({name: "common"}),
        new ExtractTextPlugin("[name].css")
    ],
    module: {
        loaders: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel'
        }, {
            test: /\.(jpg|png|gif|webp)$/,
            loader: 'url?limit=8000'
        }, {
            test: /antd\/.*\.less$/,
            loader: ExtractTextPlugin.extract('style-loader', `css-loader!less-loader?{"sourceMap":true,"modifyVars":${JSON.stringify(getTheme())}}`),
            include: __dirname
        }, {
            test(filePath) {
                return /\.less$/.test(filePath) && !/antd\/.*\.less$/.test(filePath);
            },
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
        }]
   },
    externals: {
        // "react": 'window.React',
        // "react-dom": 'window.ReactDOM'
    }
};
