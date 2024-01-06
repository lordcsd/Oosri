export function RandomDigits(lenght: number): string {
  let digits = '';
  for (let i = 0; i < lenght; i++) {
    const numbers = '0123456789';
    digits += numbers[Math.floor(Math.random() * numbers.length)];
  }
  return digits;
}
