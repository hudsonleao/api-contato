const Joi = require('joi');
const jwt = require('jsonwebtoken');

const schema = Joi.object({
    headers: Joi.object({
        key: Joi.string().required(),
    })
});

const clientes = {
    macapa: '@asd3d213AD1!@cas0',
    varejao: '&23safd@as23WA213e'
};

module.exports = async (req, res) => {

    const { error } = await schema.validate(req, {
        stripUnknown: true,
        allowUnknown: true
    });
    if (error) {
        const messages = [];
        for (const details of error.details) {
            messages.push({ message: details.message });
        }
        return res.status(400).json({ messages });
    } else {
        let empresa;
        for (let [key, value] of Object.entries(clientes)) {
            if (value === req.headers.key) empresa = key;
        }
        if (!empresa) {
            return res.status(401).json({
                messages: [{
                    message: 'Invalid token'
                }]
            });
        }
        const token = jwt.sign({ empresa }, global.jwtSecret, { algorithm: 'HS256', expiresIn: '24h' });
        res.status(200).json({ token: token });
    }
};
