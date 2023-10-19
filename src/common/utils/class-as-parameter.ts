export interface ClassAsParameter<T> {
  new (): T;
}

export function getInstance<T>(entity: ClassAsParameter<T>) {
  return entity;
}
