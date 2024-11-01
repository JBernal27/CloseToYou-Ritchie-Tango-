export function formatPhoneNumber(number: number): string {
    return number.toString().replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
}
