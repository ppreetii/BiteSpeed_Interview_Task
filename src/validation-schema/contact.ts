import Joi from "joi";

export const identifyContactSchema: Joi.Schema = Joi.object()
  .keys({
    email: Joi.string().email(),
    phone: Joi.string(),
  })
  .or("email", "phone")
  .not()
  .empty();
