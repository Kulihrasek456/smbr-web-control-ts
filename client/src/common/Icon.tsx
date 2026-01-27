import styles from './Icon.module.css'

type IconProps = {
  name: string;
  filled?: boolean;
  color?: string;
};

export function Icon({ name, filled = true,color}: IconProps) {

  return (
    <span class={`${styles.normal} ${(filled)?(styles.filled):''}`} style={(color)?`color: ${color}`:''}>
        {name}
    </span>
  );
}
