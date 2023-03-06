const jwt = require('jsonwebtoken');
const requestError = require('../helpers/RequestEroor');

const { User } = require('../models/users');

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') next(requestError(401));

  try {
    const { id } = jwt.verify(token, SECRET_KEY);

    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) next(requestError(401));
    req.user = user;
    next();
  } catch {
    next(requestError(401));
  }
};

module.exports = authenticate;
