import { Request, Response, NextFunction } from "express";

import { validate } from "../validation-schema/validate";
import { identifyContactSchema } from "../validation-schema/contact";
import { RequestValidationError } from "../utils/errors/request-validation-error";
import contactServices from "../services/contact";

export const identifyContact = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await validate(identifyContactSchema, req.body);
    const { email, phoneNumber } = req.body;
    const contacts = await contactServices.identifyContact(email, phoneNumber);

    res.json(contacts);
  } catch (error: any) {
    if (error.isJoi) {
      next(new RequestValidationError(error.details));
    }

    next(error);
  }
};
