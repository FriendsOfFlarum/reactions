export type GroupByFunction<T> = (val: T) => string | number;
declare const groupBy: <T>(arr: T[], fn: GroupByFunction<T> | keyof T) => Record<string | number, T[]>;
export default groupBy;
