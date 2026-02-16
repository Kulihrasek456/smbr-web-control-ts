import { isArray, isBoolean, isNumber } from "../../../common/other/utils";
import { ApiUnparsableBody, checkArray, checkBoolean, checkNumber, checkStringEnum, sendJsonApiMessage, type apiMessageOptions } from "../../apiMessageBase"

import { ApiMessages as commonApiMessages } from "./common";
import commonNamespace = commonApiMessages.Sensor.Fluorometer;

export namespace ApiMessages.Sensor.Fluorometer{      
    
    export type capture = {
        detectorGain: commonNamespace.detectorGains.type
        emitorIntensity: number,
        timebase: commonNamespace.detectorTimebase.type,
        lengthMs: number,
        sampleCount: number
    }
    
    export type captureResult = {
        measurement: commonNamespace.Measurement,
    }

    export async function sendCapture(options : capture) : Promise<captureResult>{
        let opts : apiMessageOptions = {
            url: "/sensor/fluorometer/capture",
            method: "POST",
        }

        opts.data = JSON.stringify({
            "detector_gain": options.detectorGain,
            "emitor_intensity": options.emitorIntensity,
            "timebase": options.timebase,
            "length_ms": options.lengthMs,
            "sample_count": options.sampleCount
        })

        let result = await sendJsonApiMessage(opts)

        let data = ( result.jsonValue as commonNamespace.Measurement)

        commonNamespace.checkMeasurement(data,opts);

        return {
            measurement: data
        }
    }
}