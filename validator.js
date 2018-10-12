const Joi = require('joi');
const validateUserSchema = Joi.object().keys({
  username: Joi.string().alphanum().min(4).max(30).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
});

exports.validateInput = (req, res, next) => {
  const inputValue = validateUserSchema.validate(req.body)
  if (inputValue.error) {
    return next(inputValue.error)
  }
  next();
}