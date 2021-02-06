const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack'); //to access built-in plugins
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = env => {
    return {
        entry: {
            server: './src/server.ts',
        },
        mode: env.NODE_ENV,
        target: 'node',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js'
        },
        resolve: {
            extensions: ['.ts',],
            alias: {
                'src': path.resolve('./src'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: [
                        'ts-loader',
                    ],
                    exclude: /node_modules/,
                },
                {
                    test: /\.(png|jpg|gif|svg})$/,
                    loader: 'file-loader',
                    options: {name: '[name].[ext]?[hash]'}
                }
            ],
        },
        externals: [nodeExternals()],
        devtool: 'source-map',
        plugins: [
            new CleanWebpackPlugin(),
            new webpack.ProgressPlugin(),
            new ForkTsCheckerWebpackPlugin(),
            new CopyPlugin({
                patterns: [
                    {from: 'src/assets', to: 'public'},
                ],
                options: {
                    concurrency: 100,
                }
            }),
            new webpack.EnvironmentPlugin(
                (env.NODE_ENV === 'development') ?
                    {
                        NODE_ENV: 'development',
                        MONGO_URI: 'mongodb://localhost:27017/gibi-social',
                        JWT_SECRET: '7jekd*d9spongbobsquarepants260X*E',
                        JWT_EXPIRATION: '36h',
                        ENCRYPTION_KEY: '0123456789abcdefghiklmnopqrstuvx',
                        IV: '0123456789abcdef',
                        // GATEWAY_PORT: '8099',
                        // COOKIE_PASSWORD: 'some-password-used-to-secure-the-admin-cookie',
                        // LOGO_URL: 'https://getgibi.com/wp-content/uploads/2016/04/Gibi-Logo-Puppy.png',
                        // COMPANY_NAME: 'Gibi Technologies',
                        // RABBIT_MQ_URL: 'amqps://kbbbrvjd:MP0MMg-J1XjBIbTs44aaJBPZhbdRWrbM@shrimp.rmq.cloudamqp.com/kbbbrvjd',
                    }
                    :
                    {
                        NODE_ENV: 'production',
                        MONGO_URI: 'mongodb://localhost:27017/gibi-social',
                        JWT_SECRET: '7jekd*d9spongbobsquarepants260X*E',
                        JWT_EXPIRATION: '36h',
                        ENCRYPTION_KEY: '0123456789abcdefghiklmnopqrstuvx',
                        IV: '0123456789abcdef',
                        // GATEWAY_PORT: '8099',
                        // COOKIE_PASSWORD: 'some-password-used-to-secure-the-admin-cookie',
                        // LOGO_URL: 'https://getgibi.com/wp-content/uploads/2016/04/Gibi-Logo-Puppy.png',
                        // COMPANY_NAME: 'Gibi Technologies',
                        // RABBIT_MQ_URL: '',
                    }
            )
        ]
    }
};
