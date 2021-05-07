const express = require('express');
const consign = require('consign');
const sequelize = require('./sequelize')();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const validation = require('./validation');
const authentication = require('./authentication');

module.exports = function () {
    let app = express();
    global.jwtSecret = '2423rWFq21fdEr3awr';
    app.sequelize = {
        macapa: sequelize.getConnection('mysql'),
        varejao: sequelize.getConnection('postgres')
    };
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use('/', express.static('static'));
    app.use(require('method-override')());
    app.use(cors());
    app.options('*', cors());
    app.use('/api/v1', app._router);
    const expressSwagger = require('express-swagger-generator')(app);

    let options = {
        swaggerDefinition: {
            info: {
                description: 'API de contatos',
                title: 'api-contatos',
                version: '1.0.0',
            },
            host: 'localhost:3000',
            basePath: '/api/v1',
            produces: [
                'application/json',
                'application/xml'
            ],
            schemes: ['http', 'https'],
            securityDefinitions: {
                JWT: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                    description: '',
                }
            }
        },
        basedir: __dirname,
        files: ['../app/routes/*.js', '../config/express.js']
    };
    expressSwagger(options);
    /**
    * Função para gerar o token
    * @route POST /auth
    * @group auth - Autenticar o usuário
    * @headers {string} 200.key - key do client
    * @returns {object} 200 - {"token": "string"}
    * @returns {Error}  400 - {"messages": [{"message": "headers.authorization" is required"}]}
    * @returns {Error}  401 - {"messages": [{"message": "Invalid token"}]}
    */
    app.get('/auth', authentication);
    app.use(validation);
    app.use(async (req, res, next) => {
        try {
            const decoded = jwt.verify(req.headers.authorization, global.jwtSecret, { algorithm: 'HS256' });
            req.headers.empresa = decoded.empresa;

            next();
        } catch (err) {
            res.status(401).json({
                messages: [{
                    message: 'Invalid token'
                }]
            });
        }
    });
    consign({ cwd: 'app', verbose: false })
        .include('models')
        .then('controllers')
        .then('routes')
        .into(app);

    return app;
};