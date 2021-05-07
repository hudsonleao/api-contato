const Joi = require('joi');

const schemaHeaders = Joi.object({
    empresa: Joi.string().required(),
});
const schemaQuery = Joi.object({
    pagina: Joi.string(),
    limite: Joi.string(),
});
const schemaParams = Joi.object({
    idContato: Joi.string().required(),
});

const schemaBodyUpdate = Joi.object({
    nome: Joi.string(),
    celular: Joi.string().min(13).max(13),
});

const schemaBodyCreate = Joi.array().items(
    Joi.object({
        nome: Joi.string().required(),
        celular: Joi.string().min(13).max(13).required(),
    }));

function formatarErro(error) {
    const messages = [];
    for (const details of error.details) {
        messages.push({ message: details.message });
    }
    return messages;
}

async function validacao({ headers = false, query = false, params = false, bodyUpdate = false, bodyCreate = false }) {
    const options = {
        stripUnknown: true,
        allowUnknown: true
    };
    if (headers) {
        const { error } = await schemaHeaders.validate(headers, options);
        if (error) return formatarErro(error);
    }
    if (query) {
        const { error } = await schemaQuery.validate(query, options);
        if (error) return formatarErro(error);
    }
    if (params) {
        const { error } = await schemaParams.validate(params, options);
        if (error) return formatarErro(error);
    }
    if (bodyUpdate) {
        const { error } = await schemaBodyUpdate.validate(bodyUpdate, options);
        if (error) return formatarErro(error);
    }
    if (bodyCreate) {
        const { error } = await schemaBodyCreate.validate(bodyCreate, options);
        if (error) return formatarErro(error);
    }
    return false;
}

module.exports = validacao;
