const joi = require('joi');

const addSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().required(),
  phone: joi.string().required(),
});

function validate(sch) {
  if (addSchema.validate(sch).error) return null;
  return 1;
}

module.exports = validate;
