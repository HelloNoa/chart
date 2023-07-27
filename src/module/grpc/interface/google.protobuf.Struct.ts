export interface Struct {
  fields: { [key: string]: Value };
}

interface Value {
  nullValue?: NullValue;
  numberValue?: number;
  stringValue?: string;
  boolValue?: boolean;
  structValue?: Struct;
  listValue?: ListValue;
}

enum NullValue {
  NULL_VALUE = 0,
}

interface ListValue {
  values: Value[];
}
