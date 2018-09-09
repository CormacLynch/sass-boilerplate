const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require('webpack-merge');
const NPM_EVENT = process.env.npm_lifecycle_event;

const webpackConfig = {
	entry: {
		polyfills: './src/js/polyfills.js',
		app: './src/js/index.js'
	},
	devServer: {
		contentBase: './dist'
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Sass Boilerplate',
			favicon: './favicon.ico',
			meta: { viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no' }
		})
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				include: path.resolve(__dirname, 'src/js'),
				exclude: path.resolve(__dirname, 'node_modules'),
				use: {
					loader: 'babel-loader?cacheDirectory=true',
					options: {
						presets: ['@babel/preset-env'],
						plugins: ['@babel/plugin-transform-runtime']
					}
				}
			},
			{
				test: /\.scss$/,
				use: [
					NPM_EVENT !== 'prod' ? 'style-loader' : MiniCssExtractPlugin.loader,
					{ loader: 'css-loader', options: { importLoaders: 1 } },
					'postcss-loader',
					'sass-loader'
				]
			},
			{
				test: /\.(png|svg|jpg|gif|ico)$/,
				include: path.resolve(__dirname, 'src/images'),
				use: ['file-loader']
			}
		]
	}
};

if (NPM_EVENT !== 'prod') {
	module.exports = merge(webpackConfig, {
		devtool: 'inline-source-map',
		output: {
			filename: '[name].bundle.js',
			path: path.resolve(__dirname, 'dist')
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: 'style.css'
			})
		],
		mode: 'development'
	});
}

if (NPM_EVENT === 'prod') {
	module.exports = merge(webpackConfig, {
		devtool: 'source-map',
		output: {
			filename: '[name].[contenthash].js',
			path: path.resolve(__dirname, 'dist')
		},
		plugins: [
			new CleanWebpackPlugin(['dist']),
			new MiniCssExtractPlugin({
				filename: 'style.[contenthash].css'
			})
		],
		optimization: {
			splitChunks: {
				chunks: 'all'
			}
		},
		mode: 'production'
	});
}
