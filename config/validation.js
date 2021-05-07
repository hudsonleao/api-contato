const Joi = require('joi');

const schema = Joi.object({
    headers: Joi.object({
        authorization: Joi.string().required()
    })
});

module.exports = async (req, res, next) => {
    try {
        const { error } = await schema.validate(req, {
            stripUnknown: true,
            allowUnknown: true
        });
        if (error) {
            const messages = [];
            for (const details of error.details) {
                messages.push({ message: details.message });
            }
            res.status(400).json({ messages });
        } else {
            next();
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};