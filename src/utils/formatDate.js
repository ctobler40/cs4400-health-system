// utils/formatDate.js
export const formatDate = (date) => {
    if (!date || isNaN(Date.parse(date))) return 'Invalid Date';
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(date));
};
