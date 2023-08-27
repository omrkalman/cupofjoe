import { useMemo } from "react";
import { Category } from "../types/types";

const Price = ({ amount, currency, category, className }: {
    amount: string,
    currency: 'nis' | 'usd',
    category?: Category,
    className?: string
}) => {

    const symbol = useMemo(() => {
        switch (currency) {
            case 'nis':
                return '₪';
            case 'usd':
                return '$';
        }
    }, [currency]);

    const per = useMemo(() => {
        switch (category) {
            case 'capsules':
                return <span style={ {fontSize: 'max(0.7em, 16px)'} }>/24pc</span>;
            case 'beans':
                return <span style={ {fontSize: 'max(0.7em, 16px)'} }>/kg</span>;
            default:
                return '';
        }
    }, [category]);

    return <span className={className}>{symbol + amount}{per}</span>
}

export default Price;