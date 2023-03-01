const { isValidObjectId } = require('mongoose');
const requestError = require('../helpers/RequestEroor');

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) next(requestError(400, `${contactId} is not valid id`));
  next();
};

module.exports = isValidId;
