const RequestEroor = require('../helpers/RequestEroor');

const validateBody = schema => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(RequestEroor(400, error.message));
    }
    next();
  };

  return func;
};

module.exports = validateBody;
