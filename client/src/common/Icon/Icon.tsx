import styles from './Icon.module.css'

type IconProps = {
    name: string;
    filled?: boolean;
    color?: string;
    class?: string;
};

export function Icon(props: IconProps) {

    return (
        <span
            class={props.class}
            classList={{
                [styles.icon]: true,
                [styles.filled]: props.filled ?? true
            }}
            style={(props.color) ? `color: ${props.color}` : ''}
        >
            {props.name}
        </span>
    );
}
