const path = require('path'); // Eto yung path 
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Eto yung plugin na nag iinject ng HTML na nasa folder na src to folder dist

module.exports = {
    entry: ['babel-polyfill', './src/js/index.js'], // Eto yung location ng file na i mimix or i cocompile para maging isang file, 
    //which is bundle.js
    output: {
        path: path.resolve(__dirname, 'dist'), // Eto yung path kung saan mo ilalagay yung compiled na js 
        filename: 'js/bundle.js' // Eto yung name na ma cocompiled once na irun mo na yung code sa cli
    },
    devServer: {
        contentBase: './dist' // Eto yung dev server na mag aautomatic mag load yung page once na mag save ka ng code
        // Eto yung folder na mag seserve sa file for production kasi yung src is for development lang
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html', // Eto yung name ng file na maiinject sa dist folder 
            template: './src/index.html' // Eto yung index.html na ma cocopy or ma iinjext sa dist folder
        })
    ],
    devtool: "eval-cheap-source-map",
    module: {
        rules: [
            {
                test: /\.js$/, // This will look for all the files that ends with .js
                exclude: /node_modules/, // We need to use this para hindi ma apply sa node modules yung babel loader
                use: {
                    loader: 'babel-loader' // This is the package that convert ES6 to ES5
                }
            }
        ]
    }
};