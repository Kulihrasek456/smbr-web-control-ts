export function getCountdownArray(length : number){
    let result = [];
    for (let i = 0; i < length; i++) {
        result.push(i);
    }
    return result;
}

export function getEmptyDatasets(qantity : number){
    let result = [];
    for (let i = 0; i < qantity; i++) {
        result.push({
            data: [],
            cubicInterpolationMode: 'monotone',
        })
    }
    return result;
}

// adding additionalHeaders will cause this to not work on RestApi endpoints
export async function fetchDataAsJson(urlIn : string,additionalHeaders = {}, setMethod="GET") {
    const url = "http://" + window.location.hostname + urlIn;
    const response = await fetch(url,
                            {
                                method: setMethod,
                                headers: {
                                    'Content-Type': 'text/plain', //it has to be plain text else it will send a complex request with an additional OPTIONS request
                                    ...additionalHeaders
                                },
                                signal: AbortSignal.timeout( 10000 )                           
                            }
                        );
    //console.log(response);
    if(response.status != 200){
        let err = Error("server responded with code: "+response.status);
        //err.response = response;
        throw err;
    }
    return response.json()
}

export async function fetchData(urlIn : string,additionalHeaders = {}, setMethod="GET") {
    const url = "http://" + window.location.hostname + urlIn;


    const response = await fetch(url,
                            {
                                method: setMethod,
                                headers: {
                                    'Content-Type': 'text/plain', //it has to be plain text else it will send a complex request with an additional OPTIONS request
                                    ...additionalHeaders
                                }
                            }
                        );
    //console.log(response);
    return response

}

export async function sendData(urlIn : string, data : string,additionalHeaders = {}, setMethod="POST") {
    const url = "http://" + window.location.hostname + urlIn;

    console.debug("sending to ",url,": ",data);
    const response = await fetch(url, {
        "credentials": "omit",
        "headers": {
            "Accept": "application/json",
            "Accept-Language": "cs,sk;q=0.8,en-US;q=0.5,en;q=0.3",
            "Content-Type": "application/json",
            ...additionalHeaders
        },
        "body": data,
        "method": setMethod,
        "mode": "cors",
        signal: AbortSignal.timeout( 10000 )  
    });   
    return response;
}

export async function streamToString(readableStream : ReadableStream) {
    const reader = readableStream.getReader();
    const decoder = new TextDecoder();
    let result = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
    }

    result += decoder.decode();
    return result;
}


export function mapRangeToRange(number : number, inMin : number,inMax : number, outMin : number,outMax : number){
    return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}


export function formatTime(formatString : string,timestamp =new Date()){
    const seconds = timestamp.getSeconds()
    const minutes = timestamp.getMinutes()
    const hours   = timestamp.getHours()

    formatString = formatString.replaceAll("ss",seconds.toString())
    formatString = formatString.replaceAll("mm",minutes.toString())
    formatString = formatString.replaceAll("hh",hours.toString())
    formatString = formatString.replaceAll("dd",timestamp.getDate().toString())
    formatString = formatString.replaceAll("wd",timestamp.getDay().toString())
    formatString = formatString.replaceAll("mo",(timestamp.getMonth()+1).toString())
    formatString = formatString.replaceAll("yyyy",timestamp.getFullYear().toString())

    formatString = formatString.replaceAll("SS",((seconds<10)?"0"+seconds:seconds).toString());
    formatString = formatString.replaceAll("MM",((minutes<10)?"0"+minutes:minutes).toString());
    formatString = formatString.replaceAll("HH",((hours<10)?"0"+hours:hours).toString());

    return formatString;
}

export function downloadStringAsFile(content : string, filename : string, contentType = 'application/json') {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

export function downloadCanvas(canvasElement : HTMLCanvasElement, filename = 'image.png') {
    const dataUrl = canvasElement.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


export function sleep(ms : number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export function isObject(target : any){
    // Source - https://stackoverflow.com/a/8511350
    // Posted by Chuck, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-02-06, License - CC BY-SA 4.0

    return typeof target === 'object' && !Array.isArray(target) && target !== null
}

export function isArray(target : any): target is Array<any>{
    return target && target.constructor === Array
}

export function isNumber(target: any): target is number {
    return typeof target === 'number' && !isNaN(target);
}

export function isBoolean(target: any): target is boolean {
    return typeof target === 'boolean';
}

export function isString(target: any): target is string {
    return typeof target === 'string';
}

// Warning, Date() sometimes adds a lot of missing information.
export function isValidDateTime(target: any): boolean {
    if(isString(target)){
        const date = new Date(target);
        return !isNaN(date.getTime());
    }
    return false;
}