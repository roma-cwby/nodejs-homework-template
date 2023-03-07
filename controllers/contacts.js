const { Contact } = require('../models/contact');
const requestError = require('../helpers/RequestEroor');

const getAll = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10, favorite } = req.query;
    const skip = (page - 1) * limit;
    const data = await Contact.find(
      { owner, favorite: favorite ? favorite : [true, false] },
      `-updatedAt -createdAt`,
      {
        skip,
        limit,
      }
    ).populate('owner', 'name email');

    if (!data) throw requestError(404, 'Not found');

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const data = await Contact.findById(req.params.contactId, '-updatedAt -createAt');

    if (!data) throw requestError(404, 'Not found');

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const add = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const data = await Contact.create({ ...req.body, owner });
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const data = await Contact.findByIdAndUpdate(req.params.contactId, req.body, { new: true });

    if (!data) throw requestError(404, 'Not found');

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const updateFavorite = async (req, res, next) => {
  try {
    const data = await Contact.findByIdAndUpdate(req.params.contactId, req.body, { new: true });

    if (!data) throw requestError(404, 'Not found');

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const del = async (req, res, next) => {
  try {
    const data = await Contact.findByIdAndRemove(req.params.contactId);

    if (!data) throw requestError(404, 'Not found');
    res.status(200).json({ message: 'contact deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  add,
  update,
  updateFavorite,
  del,
};
