import { Router, type Request, type Response } from "express";

export const timeModulesRouter = Router();

timeModulesRouter.get("/",getTime)
timeModulesRouter.post("/convert",convertTime)

function getTime(req: Request, res: Response){
    res.send(JSON.stringify(
        {
            serverTime: new Date().toUTCString()
        }
    ));
}

/*
Converts from the Rest APIs stripped timstamp 
(with applied time zone and no information about it)
to a valid UTC timestamp
*/
function convertTime(req: Request, res: Response){
    if(req.body.time === undefined){
        res.status(400).send(JSON.stringify({message:"missing values in message body"}));
    }
    try{
        let result = new Date(req.body.time+"Z").getTime()
        res.send(JSON.stringify(
            {
                convertedTime: result
            }
        ));
    }catch{
        res.status(400).send(JSON.stringify({message:"invalid timestamp"}));
    }
}