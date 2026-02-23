import { checkArray, checkString, checkStringEnum, sendJsonApiMessage, type apiMessageOptions } from "../apiMessageBase"

export namespace ServicesStatus{
    export type stateTypes =  "ok" | "problem" | "critical-problem"

    export type servicesStatusResult = {
        services: {
            name: string,
            uptime: string,
            state : string,
            stateType : stateTypes
        }[]
    }

    export async function sendServicesStatus() : Promise<servicesStatusResult>{
        let opts : apiMessageOptions = {
            url: "/services-status",
            target: "webControlApi"
        }

        let result = await sendJsonApiMessage(opts);
        let data = result.jsonValue;

        checkArray(data,"services",(el)=>{
            checkString(el,"name",opts);
            try {
                checkString(el,"uptime",opts);
            } catch (error) {
                el.uptime = undefined;
            }
            checkString(el,"state",opts);
            checkStringEnum(el,"stateType",["ok","problem","critical-problem"],opts);
            return true;
        },opts);

        return data;
    }
}