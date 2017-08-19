const
    webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    Express = require('express'),
    config = require('./webpack.config.dev'),
    compiler = webpack(config),
    app = new Express(),
    port = 8989;

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));
app.get('/*', (req, res) => {
  var originalUrl = req.originalUrl,
      quePos = originalUrl.indexOf('?');
  if (quePos !== -1) {
    originalUrl = originalUrl.slice(0,quePos);
  }

  if (!~originalUrl.indexOf('.html') ) {
    originalUrl += '.html';
  }
  res.sendFile(`${__dirname}/demo` + originalUrl);
});

app.listen(port, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.info('Listening on port http://localhost:%s', port);
  }
});
