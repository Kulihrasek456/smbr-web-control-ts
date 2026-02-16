import { checkBoolean, sendJsonApiMessage, type apiMessageOptions } from "../../apiMessageBase"

export namespace ApiMessages.Sensor.Fluorometer {
    export type completedResult = {
        capture_complete: boolean
    }

    export async function sendCompleted(): Promise<completedResult> {
        let opts: apiMessageOptions = {
            url: "/sensor/fluorometer/ojip/completed"
        }

        let response = await sendJsonApiMessage(opts);
        let data = response.jsonValue

        checkBoolean(data, "capture_complete", opts);

        return {
            capture_complete: data["capture_complete"]
        }
    }

}
