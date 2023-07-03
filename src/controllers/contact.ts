import { Request, Response,NextFunction } from "express";

import { validate } from "../validation-schema/validate";
import { identifyContactSchema } from "../validation-schema/contact";
import { RequestValidationError } from "../utils/errors/request-validation-error";


export const identifyContact = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        await validate(identifyContactSchema, req.body)
        res.send({});
        
    } catch (error:any) {     
      if(error.isJoi){
        next(new RequestValidationError(error.details));
      }
    }
}