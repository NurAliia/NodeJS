const Joi = require('joi');

const userSchema = Joi
  .object()
  .keys({
    id: Joi.string().required(),
    login: Joi.string().required().regex(/^[0-9]*[a-z]*$/),
    password: Joi.string().required(),
    age: Joi.number().integer().min(0).max(99).required(),
    isDeleted: Joi.boolean()
  })

const validateRemotely = (obj) => {
  return Joi.validate(obj, userSchema);
}

module.exports={
  userSchema,
  validateRemotely
}