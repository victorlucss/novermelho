import { useState, useEffect, useCallback } from 'react';

import { firestore } from '@Configs/Firebase';
import { useUser } from '@Authentication/context/UserContext';
import { BillTypes } from '@Modules/Bill/constants/Types';

export interface ICategory {
  id?: string;
  name: string;
  color: string;
  type: string;
}
interface UseCategoriesOptions {
  type?: string;
}
export const useCategories = (options?: UseCategoriesOptions) => {
  const [categories, setCategories] = useState(null);
  const { userId } = useUser();
  const fetchUserCategories = useCallback(async () => {
    if (!userId) return;

    const data = await firestore.collection('categories').where('userId', '==', userId).get();
    const docs = data.docs.map(
      category =>
        ({
          id: category.id,
          ...category.data(),
        } as ICategory)
    );

    const processedDocs = docs.filter(item => (options?.type ? item.type === options.type : true));

    setCategories(processedDocs);
  }, [setCategories, userId]);

  useEffect(() => {
    fetchUserCategories();
  }, [fetchUserCategories]);

  return categories;
};
