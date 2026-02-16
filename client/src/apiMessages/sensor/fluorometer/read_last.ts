import { checkBoolean, sendJsonApiMessage, type apiMessageOptions } from "../../apiMessageBase";

import { ApiMessages as commonApiMessages } from "./common";
import commonNamespace = commonApiMessages.Sensor.Fluorometer;

export namespace ApiMessages.Sensor.Fluorometer {

    export type sendReadLastResult = {
        measurement: commonNamespace.Measurement
    }

    export async function sendReadLast(): Promise<sendReadLastResult> {
        let opts: apiMessageOptions = {
            url: "/sensor/fluorometer/ojip/read_last"
        }

        let response = await sendJsonApiMessage(opts);
        let data = response.jsonValue

        commonNamespace.checkMeasurement(data,opts);

        return {
            measurement: data
        }
    }
}