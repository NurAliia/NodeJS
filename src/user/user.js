const Joi = require('joi');

// interface IUser {
//     id: string,
//     login: string,
//     password: string,
//     age: number,
//     isDeleted: boolean
// }
//
// type UserKeys<T> = {
//     [key in keyof T]: any;
// }

// const userSchema: UserKeys<IUser> = Joi
const userSchema = Joi
    .object()
    .keys({
        id: Joi.string().required(),
        login: Joi.string().required(),
        password: Joi.string().required().regex(/^(\d+[a-zA-Z]|[a-zA-Z]+\d)(\d|[a-zA-Z])*/),
        age: Joi.number().integer().min(4).max(130).required(),
        isDeleted: Joi.boolean()
    })

const validateRemotely = (obj) => {
    return Joi.validate(obj, userSchema);
}

module.exports = {
    userSchema,
    validateRemotely
}