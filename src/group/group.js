// type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';
//
// type Group = {
//   id: string;
//   name: string;
//   permission: Array<Permission>;
// };
const Joi = require('joi');

const groupSchema = Joi
  .object()
  .keys({
    id: Joi.string().required(),
    name: Joi.string().required(),
    permission: Joi.string().required(),
  })

const validateRemotely = (obj) => {
  return Joi.validate(obj, groupSchema);
}

module.exports = {
  validateRemotely
}