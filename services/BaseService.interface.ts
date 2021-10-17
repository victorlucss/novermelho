import Generic from '@/utils/Generic.interface';

export default interface BaseService<T, F> {
  insert: (model: T) => Promise<T>;
  remove: (id: string | number) => Promise<void>;
  update: (id: string | number, model: T) => Promise<boolean>;
  read: (id: string | number) => Promise<T>;
  listAll: () => Promise<T[]>;
  listWithFilters: (filters: F) => Promise<T[]>;
}
