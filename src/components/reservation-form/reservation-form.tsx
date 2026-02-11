'use client'

import { FC, useRef } from "react";
import { FormInput } from "../form-input/form-input";
import styles from './reservation-form.module.scss';
import { FormTextArea } from "../form-textarea/form-textarea";
import { CustomButton } from "../custom-button/custom-button";
import { usePhoneMask } from "@/hooks/usePhoneMask";
import { sendMessageToBot } from "@/api/bot";

export const ReservationForm: FC = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const { mask, onInput, onKeyDown } = usePhoneMask();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!formRef.current) return;

        // Проверяем валидность формы
        if (!formRef.current.checkValidity()) {
            formRef.current.reportValidity();
            return;
        }

        const formData = new FormData(formRef.current);
        const data = Object.fromEntries(formData);
        const phone = data.phone.toString().replace(/\D/g, '');
        const text = `Бронирование стола:\nИмя: ${data.name}\nТелефон: +${phone}\nДата: ${data.date}\nКоличество гостей: ${data.guests}\nКомментарий: ${data.comment}`;
        sendMessageToBot(text);
    }

    return (
        <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <FormInput
                    name={'name'}
                    label={'Имя'}
                    placeholder={'Введите имя'}
                    required
                    className={styles.item}
                />
                <FormInput
                    name={'phone'}
                    label={'Телефон'}
                    type={'tel'}
                    placeholder={'Введите номер'}
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
                    name={'date'}
                    label={'Дата/время'}
                    placeholder={'дд.мм.гггг'}
                    required
                    className={styles.item}
                />
                <FormInput
                    type={'number'}
                    name={'guests'}
                    label={'Количество гостей'}
                    placeholder={'Гостей'}
                    required
                    className={styles.item}
                />
            </div>

            <FormTextArea
                name={'comment'}
                label={'Комментарий'}
                placeholder={'Введите комментарий'}
                className={styles.item}
            />
            <CustomButton label={'Отправить'} />
        </form>
    )
}