import { FC } from 'react';
import { FormInput } from '../FormInput/FormInput';

export const ContactsFormInput: FC<{ name: string; placeholder?: string }> = ({
	name,
	placeholder = '',
}) => {
	return (
		<FormInput
			name={name}
			placeholder={placeholder}
			required={true}
			padding="10px"
			borderRadius="2.06rem"
			background="#CFA887"
			color="rgba(67, 39, 17, 1)"
		/>
	);
};
