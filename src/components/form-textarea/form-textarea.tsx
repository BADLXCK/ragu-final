import { FC } from "react";
import styles from './form-textarea.module.scss';

interface IFormTextArea {
    name: string,
    label: string,
    placeholder?: string,
    rows?: number,
    cols?: number,
    borderRadius?: string,
    className?: string,
}

export const FormTextArea: FC<IFormTextArea> = ({ name, label, borderRadius = '20px', placeholder = '', rows = 5, cols = 1, className, ...props }) => {
    return (
        <div className={`${styles.wrapper} ${className}`} style={{ borderRadius }}>
            <label htmlFor={name}>{label}</label>
            <textarea
                id={name}
                name={name}
                rows={rows}
                cols={cols}
                className={styles.input}
                placeholder={placeholder}
                {...props}
            />
        </div>
    );
};