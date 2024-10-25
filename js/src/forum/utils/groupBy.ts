export type GroupByFunction<T> = (val: T) => string | number;

const groupBy = <T>(arr: T[], fn: GroupByFunction<T> | keyof T): Record<string | number, T[]> =>
  arr.map(typeof fn === 'function' ? fn : (val) => (val as any)[fn]).reduce((acc, val, i) => {
    acc[val] = (acc[val] || []).concat(arr[i]);
    return acc;
  }, {} as Record<string | number, T[]>);

export default groupBy;
