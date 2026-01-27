export class apiMessage{
    url: string = ""
    port: number = 0
    data ?: string = ""
    method : string = "GET"

    response? : Response = undefined
    responseCode : number = -1

    constructor(url : string,port : number, data : string | undefined, method: string){
        this.url = url
        this.port = port
        this.data = data
        this.method = method
    }

    protected printError(error : unknown){
        if (error instanceof Error) {
            console.warn("Error occured while getting response to: ",this, "\nerror: ",error);
        } else {
            console.error("Unkown error occured while getting response to: ",this);
        }        
    }

    public async send() {
        const url = "http://" + window.location.hostname + ":" + this.port.toString() + this.url;

        try {
            this.response = await fetch(url, {
                "credentials": "omit",
                "headers": {
                    "Accept": "application/json",
                    "Accept-Language": "cs,sk;q=0.8,en-US;q=0.5,en;q=0.3",
                    "Content-Type": "application/json"
                },
                "body": this.data,
                "method": this.method,
                "mode": "cors",
                signal: AbortSignal.timeout( 10000 )  
            });  
            this.responseCode = this.response.status
        } catch(error){
            this.printError(error)
            this.responseCode = -1
        }
        return this.responseCode
    }
}

export class apiMessageJSON extends apiMessage{
    responseJSON? : { [key: string]: string | number | boolean | null } = undefined

    constructor(url : string,port : number, data : object | undefined, method: string){
        super(url,port,(data)?(data.toString()):undefined,method)
    }

    public async send() {
        await super.send()

        if(this.response && this.responseCode >= 0){
            try {
                this.responseJSON = await this.response.json()
            } catch (error) {
                this.printError(error)
                this.responseCode = -1
            }
        }
        return this.responseCode
    }
}

export class apiMessageSimple extends apiMessageJSON{
    key : string = ""
    expectedCode ?: number = undefined

    constructor(url: string, key : string, port : number = 8089, data : object | undefined = undefined,method : string = "GET", expectedCode ?: number){
        super(url,port,data,method)
        this.key = key
        this.expectedCode = expectedCode
    }

    public getValue(): string | number | boolean {
        if (!this.responseJSON || this.responseCode < 0) {
            throw new Error("message not ready yet")
        }
        
        try {
            let result = this.responseJSON[this.key]
            if(result != null){
                return (result).toString()
            }else{
                return "null"
            }
        } catch (error) {
            this.printError(error)
        }
        throw new Error("message incorrect")
    }

    public async send(){
        if (await super.send() > -1 && this.responseJSON){
            if (this.responseCode != this.expectedCode && this.expectedCode){
                this.printError(new Error("server responded with undesired response code"))
                this.responseCode=-1
            }
        }
        return this.responseCode
    }

}