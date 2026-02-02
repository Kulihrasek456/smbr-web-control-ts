import { children, createSignal, type JSXElement} from 'solid-js'

import styles from './Button.module.css'

export interface ButtonProps {
    callback? : () => Promise<boolean>;
    children?: JSXElement;
    class? : string;
};


export function Button(props: ButtonProps) {
    const c = children(() => props.children);
    
    const [state, setState] = createSignal(true);

    const onclick = async () => {
        if(await props.callback?.()){
            setState(true)
        }else{
            setState(false)
        }
    }

    return (
        <button class={`${state() ? "" : styles.error} ${styles.fetcher} button ${props.class?props.class:""}`} onClick={onclick}>
            {c()}
        </button>
    );
}