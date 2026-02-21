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

export function isNull(target: any): target is null {
    return target === null;
}