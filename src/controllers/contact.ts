import { Request, Response } from "express"

export const identifyContact = async (req: Request, res: Response) =>{
    try {
        res.send({});
        
    } catch (error) {
        console.log(error);
    }
}