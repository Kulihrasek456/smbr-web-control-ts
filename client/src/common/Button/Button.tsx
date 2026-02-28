import { children, createEffect, createSignal, Show, type JSXElement} from 'solid-js'

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
    const [error, setError] = createSignal<boolean>(false);

    const onclick = async () => {
        setLoading(true)
        setError(false);
        try {
            if((await props.callback?.())===false){
                setError(true);
            }
        } catch (error) {
            setError(true);
            console.error(error);
        }

        setLoading(false);
    }

    createEffect(()=>{
        if(error()){
            setTimeout(()=>{
                setError(false);
            },3000);
        }
    })


    return (
        <button 
            class={props.class}
            classList={{
                [styles.container]: true,
                [styles.error]: error(),
                ["button"]:true
            }} 
            disabled={isDisabled(loading(),props.disabled)}
            onClick={onclick}
            title={getTooltip(props.tooltip,props.disabledTooltip,isDisabled(loading(),props.disabled))}
        >
            <span 
                class={styles.normal_text}
            >
                {props.children}
            </span>
            <Show when={error()}>
                <span
                    class={styles.error_text}
                >Err</span>
            </Show>
        </button>
    );
}