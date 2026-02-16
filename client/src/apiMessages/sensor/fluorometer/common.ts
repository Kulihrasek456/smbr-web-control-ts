import { checkArray, checkBoolean, checkNumber, checkStringEnum, type apiMessageOptions } from "../../apiMessageBase";

export namespace ApiMessages.Sensor.Fluorometer {
    export namespace detectorGains {
        export const values = ["x1", "x10", "x50", "Auto"] as const;
        export type type = typeof values[number];
    }

    export namespace detectorTimebase {
        export const values = ["logarithmic", "linear"] as const;
        export type type = typeof values[number];
    }

    export type Sample = {
        time_ms: number,
        raw_value: number,
        relative_value: number,
        absolute_value: number
    }

    export type Measurement = {
        measurement_id: number,
        read: boolean,
        saturated: boolean,
        detector_gain: detectorGains.type,
        intensity: number,
        timebase: detectorTimebase.type,
        length_ms: number,
        required_samples: number,
        captured_samples: number,
        missing_samples: number,
        samples: Sample[]
    }

    export function checkMeasurement(data : any, opts : apiMessageOptions){
        checkNumber(data,"measurement_id",opts);
        checkBoolean(data,"read",opts);
        checkBoolean(data,"saturated",opts);
        checkStringEnum(data,"detector_gain",detectorGains.values,opts);
        checkNumber(data,"intensity",opts);
        checkStringEnum(data,"timebase",detectorTimebase.values,opts);
        checkNumber(data,"length_ms",opts);
        checkNumber(data,"required_samples",opts);
        checkNumber(data,"captured_samples",opts);
        checkNumber(data,"missing_samples",opts);
        checkArray(data,"samples",(element:  any)=>{
            checkNumber(element,"absolute_value",opts);
            checkNumber(element,"relative_value",opts);
            checkNumber(element,"raw_value",opts);
            checkNumber(element,"time_ms",opts);
            return true;
        },opts);
    }
}