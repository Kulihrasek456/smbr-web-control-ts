import { children, createSignal, type JSXElement} from 'solid-js'

import styles from './Button.module.css'

export interface ButtonProps {
    callback? : () => Promise<boolean | void>;
    children?: JSXElement;
    class? : string;
    disabled ?:boolean
};


export function Button(props: ButtonProps) {
    const [disabled, setDisabled] = createSignal<boolean>(false);

    const onclick = async () => {
        setDisabled(true)
        try {
            await props.callback?.();
        } catch (error) {
            console.error(error);
        }

        setDisabled(false);
    }

    return (
        <button 
        class={`${styles.fetcher} button ${props.class?props.class:""}`} 
        disabled={disabled() || (props.disabled ?? false)}
        onClick={onclick}>
            {props.children}
        </button>
    );
}