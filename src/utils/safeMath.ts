export class SAFEMATH {
  trysum() {}
}

export const SafeMath = (n: number) => {
  if (isNaN(n)) {
    return false;
  }
  if (!isFinite(Number(n))) {
    return false;
  }
  if (n <= 0) {
    return false;
  }
  if (!(Number.isInteger(n) && Math.abs(n) <= Number.MAX_SAFE_INTEGER)) {
    return false;
  }
  return true;
};
