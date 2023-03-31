// 문자열을 ArrayBuffer로 변환하는 함수
export function str2ab(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length);
  const view = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    view[i] = str.charCodeAt(i);
  }
  return buf;
}
