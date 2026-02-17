import { isArray, isBoolean, isNumber, isString } from "../common/other/utils";
import { smbr_apiMessageConfig } from "./apiMessageConfig";

export interface apiMessageOptions{
    url : string;

    method ?: "GET" | "POST";
    port ?: number;
    hostname ?: string;
    data? : string;

    validStatusCodes?: number[]
}


export class ApiMessageError extends Error{
  constructor(options: apiMessageOptions ,message : string){
    const fullUrl = "http://" + options.hostname + ":" + options.port?.toString() + options.url;
    super(`${fullUrl} [${options.method}]: ${message}`)
    this.stack=""
    this.name = "ApiMessageError";
  }
}

export class ApiConnectionError extends ApiMessageError {
  constructor(options: apiMessageOptions) {
    super(options,`connection failed`);
    this.name = "ApiConnectionError";
  }
}

export class ApiInvalidStatusCodeError extends ApiMessageError {
  constructor(options: apiMessageOptions, status : number) {
    super(options,`invalid status code: ${status}`);
    this.name = "ApiInvalidStatusCodeError";
  }
}

export class ApiUnparsableJsonBody extends ApiMessageError{
  constructor(options:apiMessageOptions){
    super(options,`unparsable body (should be JSON)`);
    this.name = "ApiUnparsableJsonBody";
  }
}

export class ApiUnparsableBody extends ApiMessageError{
  constructor(options:apiMessageOptions, message:string){
    super(options,`unparsable body ${message}`);
    this.name = "ApiUnparsableBody";
  }
}

export type apiMessageJsonResult = {
  response: Response,
  jsonValue: any
}

export async function sendApiMessage(options:apiMessageOptions){
    const url = options.url
    const port = options.port ?? 8089
    const hostname = options.hostname ?? smbr_apiMessageConfig.defaultHostname
    const method = options.method ?? "GET"
    const returnCodes = options.validStatusCodes ?? [200]

    const url_full = "http://" + hostname + ":" + port.toString() + url;

    let response : Response;

    try {
        response = await fetch(url_full, {
            "credentials": "omit",
            "headers": {
                "Accept": "application/json",
                "Accept-Language": "cs,sk;q=0.8,en-US;q=0.5,en;q=0.3",
                "Content-Type": "application/json"
            },
            "body": options.data,
            "method": method,
            "mode": "cors",
            signal: AbortSignal.timeout( 10000 )  
        });
    } catch(error){
        throw new ApiConnectionError(options);
    }

    if(returnCodes.includes(response.status)){
        return response;
    }else{
        throw new ApiInvalidStatusCodeError(options,response.status);
    }
}

export async function sendJsonApiMessage(options:apiMessageOptions) : Promise<apiMessageJsonResult>{
    let response = await sendApiMessage(options)
    try {
      let jsonParsed = await response.json();
      return {
        response: response,
        jsonValue: jsonParsed
      };
    } catch (error) {
      throw new ApiUnparsableJsonBody(options);
    }
}


export function checkNumber(value: any, key:string, options : apiMessageOptions){
    if(!isNumber(value[key])){
        throw new ApiUnparsableBody(options,`response shoud contain a number: ${key}`);
    }
}

export function checkArray(value: any, key:string, checkElement: (element : any)=>boolean, options : apiMessageOptions){
    let values : any[] = value[key]

    if(!isArray(values)){
        throw new ApiUnparsableBody(options,"should contain samples array")
    }

    for(let i = 0; i<values.length; i++){
        if(!checkElement(values[i])){
          throw new ApiUnparsableBody(options,`element in ${key} is unparsable`)
        }
    }
}

export function checkBoolean(value: any, key:string, options : apiMessageOptions){
    if(!isBoolean(value[key])){
        throw new ApiUnparsableBody(options,`response should contain a boolean: ${key}`)
    }
}

export function checkString(value: any, key:string, options : apiMessageOptions){
    if(!isString(value[key])){
        throw new ApiUnparsableBody(options,`response should contain a string: ${key}`)
    }
}

export function checkStringEnum(value: any, key:string, possibleValues: readonly string[], options : apiMessageOptions){
    checkString(value,key,options);
    if(!possibleValues.includes((value[key] as string))){
        throw new ApiUnparsableBody(options,`response should contain an enum: ${key}`)
    }
}