import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { makeshiftSessionUserId } from "../controllers/user.controller" ; 

export const authentication: RequestHandler = (req, res, next) => {
    if (makeshiftSessionUserId) {
        next() ; 
    } else {
        next(createHttpError(401, "This user is not authenticated.")) ;
    }
}

