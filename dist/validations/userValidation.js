"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require('joi');
const userValidation = (data) => {
    try {
        const schema = Joi.object().keys({
            email: Joi.string().email().max(100).required().messages({
                "string.email": `Please enter email in proper format!`,
                "string.max": `Email cannot exceed more than 100 characters!`,
                "string.empty": `Please enter email!`
            }),
            password: Joi.string().required().messages({
                "string.empty": `Please enter password!`
            }),
        });
        const result = schema.validate(data);
        // console.log(result.error.details);
        return result;
    }
    catch (error) {
        console.log(error);
    }
};
exports.default = userValidation;
