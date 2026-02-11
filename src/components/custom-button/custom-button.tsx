import { ButtonHTMLAttributes, FC } from "react";
import styles from './custom-button.module.scss';

type TCustomButton = Partial<ButtonHTMLAttributes<HTMLButtonElement>> & {
    label: string,
    className?: string,
};

export const CustomButton: FC<TCustomButton> = ({ label = '', className = '', ...buttonProps }) => {
    return (
        <button
            {...buttonProps}
            className={`${styles.button} ${className}`}
        >
            {label}
        </button>
    )
};