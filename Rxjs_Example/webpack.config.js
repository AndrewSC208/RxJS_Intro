const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const config = {
    entry: './app/index.ts',
    output: {
    	filename: 'bundle.js',
    	path: path.resolve(__dirname, 'dist')
  	},
  	module: {
 		rules: [
 	    	{
 	    	  test: /\.tsx?$/,
 	    	  loader: 'ts-loader',
 	    	  exclude: /node_modules/,
 	    	},
 	  	]
    },
 	resolve: {
 	  	extensions: [".tsx", ".ts", ".js"]
 	},
  	plugins: [
    	new webpack.optimize.UglifyJsPlugin(),
    	new HtmlWebpackPlugin({template: './index.html'})
  	]
};

module.exports = config;