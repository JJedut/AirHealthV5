export function FormatKeyToTitle(input: string): string {
  const words = input.replace(/([a-z])([A-Z])/g, '$1 $2');
  return words.replace(/\b\w/g, (char) => char.toUpperCase());
}
