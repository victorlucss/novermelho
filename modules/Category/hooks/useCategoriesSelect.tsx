import { useState, useEffect, useCallback } from 'react';

import { firestore } from '@Configs/Firebase';
import { useUser } from '@Authentication/context/UserContext';

export const useCategoriesSelect = () => {
  const [categories, setCategories] = useState([]);
  const { userId } = useUser();
  const fetchUserCategories = useCallback(async () => {
    const data = await firestore.collection('categories').where('userId', '==', userId).get();
    setCategories(
      data.docs.map(category => ({
        id: category.id,
        ...category.data(),
      }))
    );
  }, [setCategories, userId]);

  useEffect(() => {
    fetchUserCategories();
  }, [fetchUserCategories]);

  return categories;
};
