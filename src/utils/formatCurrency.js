// utils/formatCurrency.js
export const formatCurrency = (value) => {
    if (isNaN(value)) return 'Invalid Amount';
    return `$${parseFloat(value).toFixed(2)}`;
};
