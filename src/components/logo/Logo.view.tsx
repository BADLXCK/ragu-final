import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
    className?: string;
}

export const Logo: FC<LogoProps> = ({ className }) => {
    return (
        <Link className={className} href={'/'}>
            <Image
                src={'/logo.svg'}
                alt="Логотип ресторана Рагу"
                width={0}
                height={0}
                style={{ width: '100%', height: 'auto' }}
            />
        </Link>
    )
}