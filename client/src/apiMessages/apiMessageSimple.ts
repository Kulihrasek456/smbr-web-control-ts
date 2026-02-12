import { ApiMessageError, sendApiMessage, sendJsonApiMessage } from "./apiMessageBase"

export type apiMessageSimple = {
    url : string,
    key : string,
    port? : number,
}

export class ApiMessageSimpleMissingKey extends ApiMessageError {
  constructor(message: string) {
    super(message);
    this.name = "ApiMessageSimpleMissingKey";
  }
}

export type apiMessageSimpleResult = string | number | boolean

export async function sendApiMessageSimple(options : apiMessageSimple) : Promise<apiMessageSimpleResult>{
    let response = await sendJsonApiMessage({
        url: options.url,
        port: options.port
    });

    let result = response.jsonValue[options.key]
    if(result != undefined){
        return (result).toString()
    }else{
        throw new ApiMessageSimpleMissingKey(`${options.url}:${options.port??"---"} doesn't contain: ${options.key}`);
    }
}