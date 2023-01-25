export interface Dictionary<T> {
  [key: string]: T;
}

export type TypedKeyDictionnary<Key, Value> = {
  [key in Key as string]: Value
}
