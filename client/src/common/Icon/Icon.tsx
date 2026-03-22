import styles from './Icon.module.css'

type IconProps = {
    name: string;
    filled?: boolean;
    color?: string;
    class?: string;
    scale?: number;
    animateColor?: boolean;
};

export function Icon(props: IconProps) {

    return (
        <span
            class={props.class}
            classList={{
                [styles.icon]: true,
                [styles.filled]: props.filled ?? true,
                [styles.color_animated]: props.animateColor ?? false,
                ["icon"]: true
            }}
            style={{
                color: props.color,
                scale: props.scale
            }}
        >
            {props.name}
        </span>
    );
}
