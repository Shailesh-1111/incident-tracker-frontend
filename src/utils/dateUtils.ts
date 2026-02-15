export const formatDate = (dateInput: string | Date): string => {
    const date = new Date(dateInput);
    // Format: 12 April 2026
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateString = date.toLocaleDateString('en-GB', options);

    // exact match for "12 April 2026" -> "12 April, 2026"
    // We want to add a comma after the month
    // en-GB puts day first: "12 April 2026"
    // We can regex replace the space before the year with ", "
    return dateString.replace(/ (\d{4})$/, ', $1');
};

export const formatDateTime = (dateInput: string | Date): string => {
    const date = new Date(dateInput);
    const datePart = formatDate(date);
    const timePart = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    return `${datePart}, ${timePart}`;
};
