export function generateDynamicPort(): number {
  return Math.round(Math.random() * 16383) + 49152;
}
