export function round(num: number, fractionDigits: number): number {
  return Number(num.toFixed(fractionDigits));
}