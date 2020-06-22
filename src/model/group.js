const Joi = require('joi');

const groupSchema = Joi
  .object()
  .keys({
    id: Joi.string().required(),
    name: Joi.string().required(),
    permission: Joi.string(['READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES']).required(),
  })

const validateRemotely = (obj) => {
  return Joi.validate(obj, groupSchema);
}

module.exports = {
  validateRemotely
}