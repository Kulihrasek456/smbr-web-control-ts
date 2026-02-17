import { createEffect, createSignal, onCleanup, onMount, Show } from 'solid-js'

import { refreshValueUpdate, useRefreshValue } from '../other/RefreshProvider';
import { sendApiMessageSimple, type apiMessageSimple } from '../../apiMessages/apiMessageSimple';
import { ValueDisplay } from './ValueDisplay';

export interface ApiFetcherProps{
    target: apiMessageSimple;
    unit?: string,
    interval?: number,
    numberOnly?: {
        decimalPlaces :number
    }
};


export function ApiFetcher(props: ApiFetcherProps) {
    const undefinedPlaceholder = "---"

    const [value, setValue] = createSignal<string | undefined>(undefinedPlaceholder);
    const refreshValue = useRefreshValue
    
    let inProgress : boolean = false;

    createEffect(async () => {
        if(!refreshValueUpdate(refreshValue()) || inProgress){
            return
        }
        inProgress = true;
        try {
            setValue(((await sendApiMessageSimple(props.target)).toString()));
        } catch (e) {
            setValue(undefined);
            console.error(e);
        }
        inProgress = false;
    })

    return (
         <ValueDisplay
            value={value()}
            unit={props.unit}
            numberOnly={props.numberOnly}
         ></ValueDisplay>
    );
}