// this file contains extras that should override angular's default configs

const { CycloneDxWebpackPlugin } = require('@cyclonedx/webpack-plugin')
const Dotenv = require('dotenv-webpack');

module.exports = {
  plugins: [
    // @see https://www.npmjs.com/package/@cyclonedx/webpack-plugin
    new Dotenv(),
    new CycloneDxWebpackPlugin({
      outputLocation: '../bom', // The path is relative to webpack's overall output path,
      includeWellknown: false
    })
  ]
}
