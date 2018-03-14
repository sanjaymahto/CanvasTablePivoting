module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'app.bundle.js'
    },
    devtool: 'source-map',
    module:{
        rules: [
            { test: /\.js$/, use: 'babel-loader' }
          ]
    }
}