import { checkTimestamp, sendJsonApiMessage, type apiMessageOptions } from "../apiMessageBase";

export namespace Time{
    export async function getTime() : Promise<Date>{
        let opts : apiMessageOptions = {
            url: "/time",
            target: "webControlApi"
        }

        let sendTime = Date.now();

        let result = await sendJsonApiMessage(opts);
        let data = result.jsonValue;

        checkTimestamp(data,"serverTime",opts);

        let responseTime : Date = new Date(data.serverTime);

        let roundTripTime = Date.now() - sendTime;

        return new Date(responseTime.getTime() - (roundTripTime/2))
    }
}