let Sequelize = require('sequelize');
module.exports = function (app) {

    let Contacts = (dialect) => {
        return app.sequelize[dialect].define('contacts', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            nome: {
                type: Sequelize.STRING,
                allowNull: false
            },
            celular: {
                type: Sequelize.STRING,
                allowNull: false
            }
        }, {

            createdAt: false,
            updatedAt: false,
            deletedAt: false,
            freezeTableName: true,
            tableName: 'contacts'
        });

    };
    return Contacts;
};