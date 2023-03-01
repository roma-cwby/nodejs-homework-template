const { addSchema } = require('../models/contact');
const { updateFavoriteSchema } = require('../models/contact');

function validate(sch, type = null) {
  if (!type && addSchema.validate(sch).error) return null;
  else if (type === 'favorite' && updateFavoriteSchema.validate(sch).error) return null;
  return 1;
}

module.exports = validate;
