export interface Timestamp {
  seconds: {
    low: number;
    high: number;
    unsinged: boolean;
  };
  nanos: number;
}

export enum Enum_timestamp {
  seconds = 0,
  nanos = 1,
}
