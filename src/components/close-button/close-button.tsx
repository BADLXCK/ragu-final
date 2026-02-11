'use client';

import { useRouter } from 'next/navigation';
import { CustomButton } from '@/components/custom-button';

interface CloseButtonProps {
    categorySlug: string;
    className?: string;
}

export const CloseButton: React.FC<CloseButtonProps> = ({ categorySlug, className = '' }) => {
    const router = useRouter();

    const handleClose = () => {
        router.push(`/menu/${categorySlug}`);
    };

    return (
        <CustomButton
            label=''
            className={className}
            style={{ width: 24, height: 24, padding: 20, background: 'url(/close.svg) no-repeat center center' }}
            onClick={handleClose}
        />
    );
}; 