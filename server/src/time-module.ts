import { Router, type Request, type Response } from "express";

export const timeModulesRouter = Router();

timeModulesRouter.get("/",getTime)

function getTime(req: Request, res: Response){
    res.send(JSON.stringify(
        {
            serverTime: new Date().toUTCString()
        }
    ));
}