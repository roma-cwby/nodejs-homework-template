const { Schema, model } = require('mongoose');
const joi = require('joi');

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post('save', (error, data, next) => {
  error.status = 400;
  next();
});

const Contact = model('contact', contactSchema);

const addSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().required(),
  phone: joi.string().required(),
  favorite: joi.boolean(),
});

const updateFavoriteSchema = joi.object({
  favorite: joi.boolean().required(),
});

module.exports = { Contact, addSchema, updateFavoriteSchema };
