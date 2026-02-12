import { ApiMessageError, sendApiMessage, sendJsonApiMessage, type apiMessageOptions } from "./apiMessageBase"

export type apiMessageSimple = {
    url : string,
    key : string,
    port? : number,
}

export class ApiMessageSimpleMissingKey extends ApiMessageError {
  constructor(options: apiMessageOptions,key : string) {
    super(options,`missing key: ${key}`);
    this.name = "ApiMessageSimpleMissingKey";
  }
}

export type apiMessageSimpleResult = string | number | boolean

export async function sendApiMessageSimple(options : apiMessageSimple) : Promise<apiMessageSimpleResult>{
    let opts = {
        url: options.url,
        port: options.port
    }
    let response = await sendJsonApiMessage(opts);

    let result = response.jsonValue[options.key]
    if(result != undefined){
        return (result).toString()
    }else{
        throw new ApiMessageSimpleMissingKey(opts,options.key);
    }
}