import { children, createSignal, type JSXElement} from 'solid-js'

import styles from './Button.module.css'

export interface ButtonProps {
    callback? : () => Promise<boolean | void>;
    children?: JSXElement;
    class? : string;
    disabled ?:boolean;
    tooltip : string;
    disabledTooltip ?:string;
};

function getTooltip(tooltip : string, disabledTooltip : string | undefined, disabled : boolean){
    let result = tooltip;
    if(disabled && disabledTooltip){
        result += " (currently disabled, "+disabledTooltip+")";
    }
    return result;
}

function isDisabled(loading : boolean, disabled : boolean | undefined){
    return loading || (disabled ?? false)
}

export function Button(props: ButtonProps) {
    const [loading, setLoading] = createSignal<boolean>(false);

    const onclick = async () => {
        setLoading(true)
        try {
            await props.callback?.();
        } catch (error) {
            console.error(error);
        }

        setLoading(false);
    }


    return (
        <button 
            class={`${styles.fetcher} button ${props.class?props.class:""}`} 
            disabled={isDisabled(loading(),props.disabled)}
            onClick={onclick}
            title={getTooltip(props.tooltip,props.disabledTooltip,isDisabled(loading(),props.disabled))}
        >
            {props.children}
        </button>
    );
}