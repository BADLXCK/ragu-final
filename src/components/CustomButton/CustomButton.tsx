import { ButtonHTMLAttributes, FC } from 'react';
import styles from './CustomButton.module.css';

type TCustomButton = Partial<ButtonHTMLAttributes<HTMLButtonElement>> & {
	label: string;
	className?: string;
};

export const CustomButton: FC<TCustomButton> = ({
	label = '',
	className = '',
	...buttonProps
}) => {
	return (
		<button {...buttonProps} className={`${styles.button} ${className}`}>
			{label}
		</button>
	);
};
