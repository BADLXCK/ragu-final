import { LinkHTMLAttributes } from 'react';
import styles from './LinkButton.module.scss';


interface LinkButtonProps extends LinkHTMLAttributes<HTMLAnchorElement> {
    href: string;
    text: string;
}

export const LinkButton = ({ href, text, ...props }: LinkButtonProps) => {
    return (
        <a target='_blank' className={styles.linkButton} href={href} {...props}>{text}</a>
    )
}