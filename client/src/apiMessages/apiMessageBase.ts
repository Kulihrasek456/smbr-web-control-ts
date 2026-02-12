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
  constructor(message : string){
    super(message)
    this.stack=""
  }
}

export class ApiConnectionError extends ApiMessageError {
  constructor(fullUrl : string, method : string) {
    super(`Error occured while connecting to: ${fullUrl} [${method}]`);
    this.name = "ApiConnectionError";
  }
}

export class ApiInvalidStatusCodeError extends ApiMessageError {
  constructor(fullUrl : string, method : string, status : number) {
    super(`${fullUrl} [${method}] returned an invalid status code: ${status}`);
    this.name = "ApiInvalidStatusCodeError";
  }
}

export class ApiUnparsableJsonBody extends ApiMessageError{
  constructor(options:apiMessageOptions){
    const fullUrl = "http://" + options.hostname + ":" + options.port?.toString() + options.url;
    super(`${fullUrl} [${options.method}] returned an unparsable body (should be JSON)`);
    this.name = "ApiUnparsableJsonBody";
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
        throw new ApiConnectionError(url_full,method);
    }

    if(returnCodes.includes(response.status)){
        return response;
    }else{
        throw new ApiInvalidStatusCodeError(url_full,method,response.status);
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