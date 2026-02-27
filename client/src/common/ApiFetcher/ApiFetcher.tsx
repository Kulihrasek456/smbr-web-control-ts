import { createEffect, createSignal, onCleanup, onMount, Show } from 'solid-js'

import { refreshValueUpdate, useRefreshValue } from '../other/RefreshProvider';
import { sendApiMessageSimple, type apiMessageSimple } from '../../apiMessages/apiMessageSimple';
import { ValueDisplay, type ValueDisplayProps } from './ValueDisplay';

export interface ApiFetcherProps extends Omit<ValueDisplayProps,"value">{
    target: apiMessageSimple;
    interval?: number,
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
            {...props}
         ></ValueDisplay>
    );
}