'use client';

import { useState, KeyboardEvent, ChangeEvent } from 'react';

export const usePhoneMask = () => {
	const [mask, setMask] = useState('');

	const getNumbers = (input: string) => input.replace(/\D/g, '');

	const getRussianMask = (input: string) => {
		let result =
			input[0] === '9'
				? `+7 (${input.slice(0, 4)}`
				: `+7 (${input.slice(1, 4)}`;

		if (input.length > 4) {
			result = `${result}) ${input.slice(4, 7)}`;
		}

		if (input.length > 7) {
			result = `${result}-${input.slice(7, 9)}`;
		}

		if (input.length > 9) {
			result = `${result}-${input.slice(9, 11)}`;
		}

		return result;
	};

	const onInput = (event: ChangeEvent<HTMLInputElement>) => {
		const target = event.target;
		const input = target.value;
		const inputNumbers = getNumbers(input);
		let maskedPhone = '';

		if (!inputNumbers) {
			setMask('');
			return;
		}

		if (['7', '8', '9'].includes(inputNumbers[0])) {
			maskedPhone = getRussianMask(inputNumbers);
		} else {
			maskedPhone = `+${inputNumbers}`;
		}

		setMask(maskedPhone);
	};

	const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;
		if (
			event.key === 'Backspace' &&
			getNumbers(target.value).length === 1
		) {
			setMask('');
		}
	};

	return { mask, onInput, onKeyDown };
};
