var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    proxy: {
        "**": "http://localhost:9090"
    },
    noInfo: true,
    open: true,

}).listen(9090, 'localhost', function(err, result) {
    if (err) {
        return console.log(err);
    }
    console.log('Listening at http://localhost:9090/');
});

