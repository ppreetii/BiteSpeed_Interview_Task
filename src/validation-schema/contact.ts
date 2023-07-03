import Joi from "joi";

export const identifyContactSchema: Joi.Schema = Joi.object()
  .keys({
    email: Joi.string().email(),
    phoneNumber: Joi.string(),
  })
  .or("email", "phoneNumber")
  .not()
  .empty();
