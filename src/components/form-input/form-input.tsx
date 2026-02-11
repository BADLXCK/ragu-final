import { FC, HTMLInputTypeAttribute, InputHTMLAttributes } from "react";
import styles from './form-input.module.scss';

interface IFormInput extends InputHTMLAttributes<HTMLInputElement> {
    name: string,
    label?: string,
    type?: HTMLInputTypeAttribute,
    placeholder?: string,
    required?: boolean,
    pattern?: string,
    borderRadius?: string,
    background?: string,
    color?: string,
}

export const FormInput: FC<IFormInput> = ({
    name,
    label = '',
    borderRadius = '20px',
    background = 'rgba(230, 225, 221, 0.1)',
    color = 'rgba(164, 164, 164, 1)',
    type = 'text',
    placeholder = '',
    required = false,
    pattern,
    className,
    ...props
}) => {
    return (
        <label className={`${styles.label} ${className}`} style={{ borderRadius, background }}>
            {label}
            <input
                className={styles.input}
                name={name}
                type={type}
                placeholder={placeholder}
                required={required}
                pattern={pattern}
                style={{ color }}
                {...props}
            />
        </label>
    );
};