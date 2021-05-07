const Joi = require('joi');

module.exports = () => ({
    body: Joi.object({
        name: Joi.string().required()
    })

});