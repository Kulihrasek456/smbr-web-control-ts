import { isArray, isNumber } from "../../../common/other/utils"
import { ApiUnparsableBody, sendJsonApiMessage, type apiMessageOptions } from "../../apiMessageBase"

export namespace ApiMessages{
    export namespace Sensor{
        export namespace Spectrophotometer{

            export type measureAll = {
            }

            export type measureAllResult = {
                samples: {
                    channel:number,
                    relative_value: number,
                    absolute_value: number
                }[]
            }

            export async function sendMeasureAll(options : measureAll) : Promise<measureAllResult>{
                let opts : apiMessageOptions = {
                    url: "/sensor/spectrophotometer/measure_all",
                    method: "POST"
                }
                let result = await sendJsonApiMessage(opts)

                let channels = result.jsonValue["samples"]

                if(!isArray(channels)){
                    throw new ApiUnparsableBody(opts,"should contain samples array")
                }

                for(let i = 0; i<(channels as any[]).length; i++){
                    let channel : {
                        channel?:number,
                        relative_value?:number,
                        absolute_value?:number
                    } = channels[i];

                    if(!isNumber(channel.channel)){
                        throw new ApiUnparsableBody(opts,"channel shoud contain channel index")
                    }
                    if(!isNumber(channel.relative_value)){
                        throw new ApiUnparsableBody(opts,"channel should contain relative_value")
                    }
                    if(!isNumber(channel.absolute_value)){
                        throw new ApiUnparsableBody(opts,"channel should contain absolute_value")
                    }
                }

                return {
                    samples: channels
                }
            }
        }
    }
}