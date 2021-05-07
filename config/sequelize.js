const Sequelize = require('sequelize');
module.exports = function() {
    const controller = {};

    const getConfig = (dialect) => {
        let config = {
            host: 'localhost',
            database: 'databasename',
            user: 'root',
            pass: '',
            reconnect: true,
            logging: false
        };
        let env = process.env.NODE_ENV || 'development';
        if (env === 'development') {
            config.host = '127.0.0.1';
            config.database = 'admin';
            config.user = 'admin';
            config.pass = 'admin';
            console.log(`${dialect} - Database connected as development...`);
        } else if (env === 'test') {
            config.host = process.env.HOST || '127.0.0.1';
            config.database = process.env.DATABASE ||'admin';
            config.user = process.env.USER ||'admin';
            config.pass = process.env.PASS ||'admin';
            console.log(`${dialect} - Database connected as development...`);
        } else if (env === 'production') {
            config.host = process.env.HOST || '127.0.0.1';
            config.database = process.env.DATABASE ||'admin';
            config.user = process.env.USER ||'admin';
            config.pass = process.env.PASS ||'admin';
            config.logging = false;
            console.log(`${dialect} - Database connected as development...`);
        }
        return config;
    };
    

    controller.getConnection = function(dialect) {
        let config = getConfig(dialect);
        let connection = new Sequelize(config.database, config.user, config.pass, 
            {
                host: config.host,
                dialect: dialect,
                reconnect: config.reconnect,
                logging: config.logging
            });
        return connection;
    };

    return controller;
};
