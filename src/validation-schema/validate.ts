import Joi from "joi";

export const validate = async (schema: Joi.Schema, data: any) => {
  try {
    await schema.validateAsync(data, {
      abortEarly: false,
    });
  } catch (error) {
    throw error;
  }
};
