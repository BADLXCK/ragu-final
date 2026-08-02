'use client';

import { FC, useRef, useState } from 'react';
import { toast } from 'sonner';
import { sendMessageToBot } from '@/api/bot';
import { usePhoneMask } from '@/hooks/usePhoneMask';
import { CustomButton } from '../CustomButton/CustomButton';
import { FormInput } from '../FormInput/FormInput';
import { FormTextArea } from '../FormTextArea/FormTextArea';
import styles from './ReservationForm.module.css';

export const ReservationForm: FC = () => {
	const formRef = useRef<HTMLFormElement>(null);
	const [submitting, setSubmitting] = useState(false);
	const { mask, onInput, onKeyDown, clear } = usePhoneMask();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!formRef.current || submitting) return;

		// Проверяем валидность формы
		if (!formRef.current.checkValidity()) {
			formRef.current.reportValidity();
			return;
		}

		const formData = new FormData(formRef.current);
		const data = Object.fromEntries(formData);
		const phone = data.phone.toString().replace(/\D/g, '');
		const text = `Бронирование стола:\nИмя: ${data.name}\nТелефон: +${phone}\nДата: ${data.date}\nКоличество гостей: ${data.guests}\nКомментарий: ${data.comment}`;

		setSubmitting(true);
		try {
			await sendMessageToBot(text);
			formRef.current.reset();
			clear();
			toast.success(
				'Бронирование отправлено! Мы свяжемся с вами в ближайшее время.',
			);
		} catch {
			toast.error('Не удалось отправить заявку. Попробуйте ещё раз.');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
			<div style={{ display: 'flex', gap: '1rem' }}>
				<FormInput
					name="name"
					label="Имя"
					placeholder="Введите имя"
					required
					className={styles.item}
				/>
				<FormInput
					name="phone"
					label="Телефон"
					type="tel"
					placeholder="Введите номер"
					required
					onInput={onInput}
					onKeyDown={onKeyDown}
					value={mask}
					className={styles.item}
				/>
			</div>

			<div style={{ display: 'flex', gap: '1rem' }}>
				<FormInput
					type="date"
					name="date"
					label="Дата/время"
					placeholder="дд.мм.гггг"
					required
					className={styles.item}
				/>
				<FormInput
					type="number"
					name="guests"
					label="Количество гостей"
					placeholder="Гостей"
					required
					className={styles.item}
				/>
			</div>

			<FormTextArea
				name="comment"
				label="Комментарий"
				placeholder="Введите комментарий"
				className={styles.item}
			/>
			<CustomButton label="Отправить" disabled={submitting} />
		</form>
	);
};
