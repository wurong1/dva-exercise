const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function(webpackConfig) {
  webpackConfig.babel.plugins.push('transform-runtime');

  webpackConfig.resolve.alias = {
    ui: path.resolve(__dirname, './src/ui'),
  };
  webpackConfig.plugins.push(
    new CopyWebpackPlugin([
       { from: __dirname+'/favicon.ico', to: 'favicon.ico' },
       { from: __dirname+'/src/plugs/FlexPaper/FlexPaperViewer.swf', to: 'FlexPaperViewer.swf' },
    ])
 )

  return webpackConfig;
};